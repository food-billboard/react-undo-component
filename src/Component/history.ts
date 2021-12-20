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
      feature: S[]
    }>(!!this.config.debug)
    if(initialValue !== undefined) this.initState(initialValue)
  }

  private config!: Required<HookProps<S>>

  private feature: (S | undefined)[] = []
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
      feature: this.feature
    })  
  }

  private logEnd() {
    this.debug.end({
      past: this.past,
      present: this.present,
      feature: this.feature
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
    const realPrevState = prevState ?? this.present
    this.present = state 
    if(!!~limit && this.past.length + this.feature.length >= limit) this.past.shift()
    this.past.push(prevState)

    this.logEnd()
  }

  private filter(action: keyof typeof ActionTypes, currentHistory: StateType<S>, prevHistory: StateType<S>) {

  }

  private actionCan(type: keyof typeof ActionTypes, index?: number) {
    if(type === "CLEAR_HISTORY") return true 
    // limit 
    if(!!~this.config.limit && this.feature.length + this.past.length > this.config.limit) {
      this.debug.log(`${type} cannot be done because the history is limited`)
      return false 
    }
    let valid = false 
    switch(type) {
      case "JUMP":
        valid = this.isNumber(index) && index !== 0 && (index as number) > 0 ? this.feature.length >= (index as number) : this.past.length >= (index as number) * -1 
        break 
      case "REDO":
        valid = this.feature.length >= 1 
        break 
      case "UNDO":
        valid = this.past.length >= 1
        break 
      case "JUMP_TO_FUTURE":
        valid = this.isNumber(index) && (index as number) >= 0 && this.feature.length >= (index as number) + 1
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
    const newPresent = this.past.pop()
    this.feature.unshift(this.present as S)
    this.present = newPresent

    this.logEnd()

    return this.present
  }

  // 前进
  redo() {
    this.logStart(ActionTypes.REDO)
    if(!this.actionCan(ActionTypes.REDO)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }
    const newPresent = this.feature.shift()
    this.past.push(this.present as S)
    this.present = newPresent

    this.logEnd()

    return this.present
  }

  // 清除  
  clear() {
    this.logStart(ActionTypes.CLEAR_HISTORY)
    if(!this.actionCan(ActionTypes.CLEAR_HISTORY)) {
      this.logEnd()
      return CAN_NOT_DEALING
    } 
    this.feature = []
    this.past = [] 
    this.present = DEFAULT_PRESENT_DATA

    this.logEnd()

  }

  // 前进或后退指定步数
  jump(index: number) {
    this.logStart(ActionTypes.JUMP)
    if(!this.actionCan(ActionTypes.JUMP, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }
    let newFeature 
    if(index > 0) {
      const temp = this.feature.splice(0, index)
      newFeature = temp.pop()
      this.past.push(...temp)
      this.present = newFeature
    }else {
      const temp = this.past.splice(this.past.length - 1, this.past.length - index - 1)
      newFeature = temp.shift()
      this.feature.unshift(...temp)
      this.present = newFeature
    }

    this.logEnd()

    return newFeature
  }

  // 跳到指定past位置
  jumpToPast(index: number) {
    this.logStart(ActionTypes.JUMP_TO_PAST)
    if(!this.actionCan(ActionTypes.JUMP_TO_PAST, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }
    const temp = this.past.splice(index, this.past.length - index)
    const newPresent = temp.shift()
    this.feature.unshift(...temp)
    this.present = newPresent

    this.logEnd()

    return newPresent
  }

  // 跳到指定future位置
  jumpToFuture(index: number) {
    this.logStart(ActionTypes.JUMP_TO_FUTURE)
    if(!this.actionCan(ActionTypes.JUMP_TO_FUTURE, index)) {
      this.logEnd()
      return CAN_NOT_DEALING
    }
    const temp = this.feature.splice(0, index + 1)
    const newPresent = temp.pop()
    this.past.push(...temp)
    this.present = newPresent

    this.logEnd()

    return newPresent
  }

}