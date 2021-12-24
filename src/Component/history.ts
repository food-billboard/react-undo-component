import { ActionTypes, CAN_NOT_DEALING, DEFAULT_CONFIGURATION, DEFAULT_PRESENT_DATA } from './constants'
import Debug from './debug'
import { HookProps, StateType } from './type'

export default class UndoHistory<S=any> {

  constructor(configuration: HookProps<S>={}, initialValue?: S) {
    this.config = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
    } as Required<HookProps<S>>
    this.debug = new Debug<{
      present: S 
      past: S[] 
      future: S[]
    }>(!!this.config.debug)

    if(initialValue !== undefined) this.initState(initialValue)
  }

  private config!: Required<HookProps<S>>

  private future: (S | undefined)[] = []
  private past: (S | undefined)[] = []
  private present?: S | typeof DEFAULT_PRESENT_DATA = DEFAULT_PRESENT_DATA
  private debug!: Debug
  private initialValue: S | typeof DEFAULT_PRESENT_DATA = DEFAULT_PRESENT_DATA

  public get state() {
    return this.present
  }

  public get history() {
    return {
      present: this.present,
      past: this.past,
      future: this.future
    }
  }

  private isNumber(value: any) {
    return typeof value === "number" && !Number.isNaN(value)
  }

  private logStart(action: keyof typeof ActionTypes, params: any={}) {
    this.debug.start({
      type: action,
      ...params
    }, {
      past: this.past,
      present: this.present,
      future: this.future
    })  
  }

  private logEnd() {
    this.debug.end({
      past: this.past,
      present: this.present,
      future: this.future
    })  
  }

  public isActionDataValid(value: any) {
    return value !== CAN_NOT_DEALING
  }

  public enqueue(state: S, prevState?: S) {
    const { limit } = this.config
    this.logStart(ActionTypes.ENQUEUE)
    this.debug.log("enqueue the state")
    this.debug.log("previous state is: ", prevState)
    this.debug.log("target state is: ", state)

    this.filter(ActionTypes.ENQUEUE, (past, future, present) => {
      const newPresent = state 
      if(!!~limit && past.length + future.length >= limit) past.shift()
      past.push(prevState)
      return {
        past: past,
        future,
        present: newPresent
      }
    })

    this.logEnd()
  }

  private filter(action: ActionTypes, actionMethod: (past: any[], next: any[], present: any) => StateType<S>) {
    const { filter } = this.config 
    const currentState = actionMethod([...this.past], [...this.future], this.present)
    const { past, future, present } = currentState
    const isFilterList = Array.isArray(filter) && filter.includes(action) 
    const isCustomFilter = typeof filter === "function" && filter(action, currentState, {
      past: this.past as S[],
      future: this.future as S[],
      present: this.present as any 
    })
    if(isFilterList || isCustomFilter || filter === undefined) {
      this.past = past
      this.future = future
      this.present = present
      return present
    }
    this.debug.log("the action is not performance because filter")
    return CAN_NOT_DEALING
  }

  private actionCan(type: keyof typeof ActionTypes, index?: number) {
    if(type === "CLEAR_HISTORY") return true 

    let valid = false 
    switch(type) {
      case "JUMP":
        valid = this.isNumber(index) && index !== 0 && (index as number) > 0 ? this.future.length >= (index as number) : this.past.length >= (index as number) * -1 
        break 
      case "REDO":
        valid = this.future.length >= 1 
        break 
      case "UNDO":
        valid = this.past.length >= 1
        break 
      case "JUMP_TO_FUTURE":
        valid = this.isNumber(index) && (index as number) >= 0 && this.future.length > (index as number)
        break 
      case "JUMP_TO_PAST":
        valid = this.isNumber(index) && (index as number) >= 0 && this.past.length > (index as number)
        break 
    }
    
    if(!valid) this.debug.log("action fail")

    return valid 

  }

  // 设置初始值
  initState(value: S, defaultOnly?: boolean) {
    this.initialValue = value 
    if(!defaultOnly) this.present = value 
  }

  // 后退
  undo() {
    return this.commonAction(ActionTypes.UNDO, this.internalJump.bind(this, -1))
  }

  // 前进
  redo() {
    return this.commonAction(ActionTypes.REDO, this.internalJump.bind(this, 1))
  }

  // 清除  
  clear() {
    this.logStart(ActionTypes.CLEAR_HISTORY)

    const result = this.filter(ActionTypes.CLEAR_HISTORY, () => {
      return {
        past: [] as S[],
        future: [] as S[],
        present: this.initialValue as any 
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? undefined : CAN_NOT_DEALING

  }

  // 前进或后退指定步数
  jump(index: number) {
    return this.commonAction(ActionTypes.JUMP, this.internalJump.bind(this, index), index)
  }

  // 跳到指定past位置
  jumpToPast(index: number) {
    return this.commonAction(ActionTypes.JUMP_TO_PAST, this.internalJumpToPast.bind(this, index), index)
  }

  // 跳到指定future位置
  jumpToFuture(index: number) {
    return this.commonAction(ActionTypes.JUMP_TO_FUTURE, this.internalJumpToFuture.bind(this, index), index)
  }

  private commonAction = (actionType: ActionTypes, action: any, index?: number) => {
    this.logStart(actionType)
    if(!this.actionCan(actionType, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }

    let returnData 

    const result = this.filter(actionType, (...args) => {
      const { returnData: customReturnData, ...historyData } = action(...args)
      returnData = customReturnData
      return historyData
    })

    this.logEnd()

    return this.isActionDataValid(result) ? returnData : result 

  }

  private internalJumpToPast(index: number, past: S[], future: S[], present: S) {
    const newPast = past.slice(0, index)
    const newFuture = [
      ...past.slice(index + 1),
      present,
      ...future
    ]
    const newPresent = past[index]

    return {
      past: newPast,
      future: newFuture,
      present: newPresent as S,
      returnData: newPresent
    }
  }

  private internalJumpToFuture(index: number, past: S[], future: S[], present: S) {
    const newPast = [
      ...past,
      present,
      ...future.slice(0, index)
    ]
    const newPresent = future[index]
    const newFuture = future.slice(index + 1)
    return {
      past: newPast,
      future: newFuture,
      present: newPresent as S,
      returnData: newPresent as S 
    }
  }

  private internalJump(index: number, past: S[], future: S[], present: S) {
    let method 
    let targetIndex = 0 
    if(index > 0) {
      method = this.internalJumpToFuture
      targetIndex = index - 1
    }else if(index < 0){
      method = this.internalJumpToPast
      targetIndex = past.length + index 
    }
    return method?.(targetIndex, past, future, present) || {
      past,
      future,
      present,
      returnData: present
    }
  }

}