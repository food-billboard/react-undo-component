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

  public get state() {
    return this.present
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
      return 
    }
    this.debug.log("the action is not performance because filter")
    return CAN_NOT_DEALING
  }

  private actionCan(type: keyof typeof ActionTypes, index?: number) {
    if(type === "CLEAR_HISTORY") return true 
    // limit 
    if(!!~this.config.limit && this.future.length + this.past.length > this.config.limit) {
      this.debug.log(`${type} cannot be done because the history is limited`)
      return false 
    }
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
        valid = this.isNumber(index) && (index as number) >= 0 && this.future.length >= (index as number) + 1
        break 
      case "JUMP_TO_PAST":
        valid = this.isNumber(index) && (index as number) >= 0 && this.past.length >= (index as number) + 1
        break 
    }
    
    if(!valid) this.debug.log("action fail")

    return valid 

  }

  // 设置初始值
  initState(value: S) {
    this.present = value 
  }

  // 后退
  undo() {
    this.logStart(ActionTypes.UNDO)
    if(!this.actionCan(ActionTypes.UNDO)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }

    const result = this.filter(ActionTypes.UNDO, (past, future, present) => {
      const newPresent = past.pop()
      future.unshift(present as S)
      return {
        past: past,
        future,
        present: newPresent
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? this.present : result
  }

  // 前进
  redo() {
    this.logStart(ActionTypes.REDO)
    if(!this.actionCan(ActionTypes.REDO)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }

    const result = this.filter(ActionTypes.REDO, (past, future, present) => {
      const newPresent = future.shift()
      past.push(present as S)
      present = newPresent
      return {
        past: past,
        future,
        present: newPresent
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? this.present : result
  }

  // 清除  
  clear() {
    this.logStart(ActionTypes.CLEAR_HISTORY)
    if(!this.actionCan(ActionTypes.CLEAR_HISTORY)) {
      this.logEnd()
      return CAN_NOT_DEALING
    } 
    this.filter(ActionTypes.CLEAR_HISTORY, () => {
      return {
        past: [] as S[],
        future: [] as S[],
        present: DEFAULT_PRESENT_DATA as any 
      }
    })

    this.logEnd()

  }

  // 前进或后退指定步数
  jump(index: number) {
    this.logStart(ActionTypes.JUMP)
    if(!this.actionCan(ActionTypes.JUMP, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }
    let newFuture 
    const result = this.filter(ActionTypes.JUMP, (past, future, present) => {
      if(index > 0) {
        const temp = future.splice(0, index)
        newFuture = temp.pop()
        past.push(...temp)
        present = newFuture
      }else {
        const temp = past.splice(past.length - 1, past.length - index - 1)
        newFuture = temp.shift()
        future.unshift(...temp)
        present = newFuture
      }
      return {
        past,
        future,
        present: newFuture
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? newFuture : result
  }

  // 跳到指定past位置
  jumpToPast(index: number) {
    this.logStart(ActionTypes.JUMP_TO_PAST)
    if(!this.actionCan(ActionTypes.JUMP_TO_PAST, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }

    let newPresent

    const result = this.filter(ActionTypes.JUMP_TO_PAST, (past, future) => {
      const temp = past.splice(index, this.past.length - index)
      newPresent = temp.shift()
      future.unshift(...temp)
      return {
        past,
        future,
        present: newPresent as S 
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? newPresent : result
  }

  // 跳到指定future位置
  jumpToFuture(index: number) {
    this.logStart(ActionTypes.JUMP_TO_FUTURE)
    if(!this.actionCan(ActionTypes.JUMP_TO_FUTURE, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }

    let newPresent
    const result = this.filter(ActionTypes.JUMP, (past, future) => {
      const temp = future.splice(0, index + 1)
      newPresent = temp.pop()
      past.push(...temp)
      return {
        past,
        future,
        present: newPresent as S 
      }
    })

    this.logEnd()

    return this.isActionDataValid(result) ? newPresent : result
  }

}