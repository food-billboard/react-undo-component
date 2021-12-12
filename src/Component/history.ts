import { ActionTypes, CAN_NOT_DEALING, DEFAULT_CONFIGURATION, DEFAULT_PRESENT_DATA } from './constants'
import Debug from './debug'
import { HookProps, StateType } from './type'

export default class UndoHistory<S=any> {

  constructor(configuration: HookProps<S>={}, initialValue?: S) {
    this.config = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
    } as Required<HookProps<S>>
    this.debug = new Debug(!!this.config.debug)
    if(initialValue !== undefined) this.initState(initialValue)
  }

  private config!: Required<HookProps<S>>

  private feature: (S | undefined)[] = []
  private past: (S | undefined)[] = []
  private present?: S | typeof DEFAULT_PRESENT_DATA = DEFAULT_PRESENT_DATA
  private debug!: Debug

  private isNumber(value: any) {
    return typeof value === "number" && !Number.isNaN(value)
  }

  public enqueue(state: S, prevState: S) {
    // const prevFeature = [
    //   ...this.feature
    // ]
    // const prevPast = [
    //   ...this.past
    // ]
    // const prevPresent = this.present
    this.present = state 
    this.past.push(prevState)
  }

  private filter(action: keyof typeof ActionTypes, currentHistory: StateType<S>, prevHistory: StateType<S>) {

  }

  private actionCan(type: keyof typeof ActionTypes, index?: number) {
    if(type === "CLEAR_HISTORY") return true 
    // limit 
    if(!!~this.config.limit && this.feature.length + this.past.length > this.config.limit) return false 
    switch(type) {
      case "JUMP":
        return this.isNumber(index) && index !== 0 && (index as number) > 0 ? this.feature.length >= (index as number) : this.past.length >= (index as number) * -1 
      case "REDO":
        return this.feature.length >= 1 
      case "UNDO":
        return this.past.length >= 1
      case "JUMP_TO_FUTURE":
        return this.isNumber(index) && (index as number) >= 0 && this.feature.length >= (index as number) + 1
      case "JUMP_TO_PAST":
        return this.isNumber(index) && (index as number) >= 0 && this.past.length >= (index as number) + 1
    }
    return false 
  }

  // 设置初始值
  initState(value: S) {
    this.present = value 
  }

  // 后退
  undo() {
    if(!this.actionCan(ActionTypes.UNDO)) return CAN_NOT_DEALING
    const newPresent = this.past.pop()
    this.feature.unshift(this.present as S)
    this.present = newPresent
    return this.present
  }

  // 前进
  redo() {
    if(!this.actionCan(ActionTypes.REDO)) return CAN_NOT_DEALING
    const newPresent = this.feature.shift()
    this.past.push(this.present as S)
    this.present = newPresent
    return this.present
  }

  // 清除  
  clear() {
    if(!this.actionCan(ActionTypes.CLEAR_HISTORY)) return CAN_NOT_DEALING 
    this.feature = []
    this.past = [] 
    this.present = DEFAULT_PRESENT_DATA
  }

  // 前进或后退指定步数
  jump(index: number) {
    if(!this.actionCan(ActionTypes.JUMP, index)) return CAN_NOT_DEALING
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
    return newFeature
  }

  // 跳到指定past位置
  jumpToPast(index: number) {
    if(!this.actionCan(ActionTypes.JUMP_TO_PAST, index)) return CAN_NOT_DEALING
    const temp = this.past.splice(index, this.past.length - index)
    const newPresent = temp.shift()
    this.feature.unshift(...temp)
    this.present = newPresent
    return newPresent
  }

  // 跳到指定future位置
  jumpToFuture(index: number) {
    if(!this.actionCan(ActionTypes.JUMP_TO_FUTURE, index)) return CAN_NOT_DEALING
    const temp = this.feature.splice(0, index + 1)
    const newPresent = temp.pop()
    this.past.push(...temp)
    this.present = newPresent
    return newPresent
  }

}