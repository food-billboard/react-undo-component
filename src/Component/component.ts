import { Component } from 'react'
import UndoHistory from './history'
import { CAN_NOT_DEALING, DEFAULT_CONFIGURATION } from './constants'
import { ComponentProps, HookProps } from './type'

type ReturnUndoType<C extends object={}> = C[keyof C] | undefined | typeof CAN_NOT_DEALING
type ReturnUndoVoidType = typeof CAN_NOT_DEALING | void | undefined

export default class WrapperComponent<P = {}, S = {}, SS = any, C extends object = {}> extends Component<P, S, SS> {

  constructor(props: P, configuration: ComponentProps<C>) {
    super(props)

    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      observer: true,
      ...configuration,
    }
    this.generateUndoHistory()

    this.originSetState = this.setState.bind(this)
    this.setState = function(state, callback) {
      let prevState!: S
      let realState!: any 
      this.originSetState((prev: S, props) => {
        prevState = prev 
        realState = state
        if(typeof state === "function") {
          realState = (state as any)(prev, props)
        }
        return realState
      }, () => {
        this.noteState(realState === null ? realState : this.state, prevState)
      })
    }

    this.init()

  }

  private undoHistory!: UndoHistory<S>
  private undoHistories = new Map<keyof C, UndoHistory<C[keyof C]>>()
  private isObserverAll = false 
  private configuration!: ComponentProps<C>

  private init = () => {
    this.undo = this.undo.bind(this)
    this.undo4target = this.undo4target.bind(this)
    this.redo = this.redo.bind(this)
    this.redo4target = this.redo4target.bind(this)
    this.noteState = this.noteState.bind(this)
  }

  private generateUndoHistory() {
    const { observer, ...nextConfiguration } = this.configuration
    if(observer === true) {
      this.undoHistory = new UndoHistory<S>(nextConfiguration as HookProps<S>)
      this.isObserverAll = true 
    }else {
      observer?.forEach((cur) => {
        this.undoHistories.set(cur, new UndoHistory(nextConfiguration))
      })
    }
  }

  private originSetState!: Component["setState"]
  private internalSetState(state: any, callback?: () => void) {
    if(!state) return 
    if(typeof state === "object") {
      this.originSetState(state, callback)
    }
  }

  private getHistoriesEntry() {
    const undoList = this.undoHistories.entries()
    const arrayUndoList = Array.from(undoList)
    return arrayUndoList
  }

  private historyActionCommon<CusReturnType>(action: (history?: UndoHistory) => CusReturnType, key?: keyof C, callback?: () => void) {
    let realKey 
    let realCallback 
    if(typeof key === "function") {
      realCallback = key 
    }else if(typeof key === "string") {
      realKey = key 
      realCallback = callback 
    }

    if(!realKey) {
      const arrayUndoList = this.getHistoriesEntry()
      let historyResult: CusReturnType[] = []
      let stateMap: any = {}
      arrayUndoList.forEach((entry) => {
        const [ key, history ] = entry
        const result = action(history)
        historyResult.push(result)
        if(history.isActionDataValid(result)) stateMap[key] = result 
      })
      this.internalSetState(stateMap, realCallback)
      return historyResult
    }else {
      const undoTarget = this.undoHistories.get(realKey as keyof C)
      const result = action(undoTarget)
      if(undoTarget?.isActionDataValid(result)) {
        this.internalSetState({
          [realKey]: result 
        }, realCallback)
      }else {
        realCallback
      }
      return result 
    }
  }

  private noteState(state: S | null, prevState: S) {
    if(!state) return 
    const { observer } = this.configuration
    if(this.isObserverAll) {
      this.undoHistory.enqueue(state, prevState)
    }else {
      Object.entries(state).forEach(stateData => {
        const [ key, value ] = stateData
        const prevValue = (prevState as any)[key]
        if((observer as string[]).includes(key)){
          const target = this.undoHistories.get(key as keyof C)
          target?.enqueue(value as C[keyof C], prevValue)
        }
      })
    }
  }

  public undo4target(key: keyof C): ReturnUndoType<C>; 
  public undo4target(): ReturnUndoType<C>[];
  public undo4target(key?: keyof C, callback?: () => void) {
    const result = this.historyActionCommon<ReturnUndoType<C>>((history) => {
      return history?.undo()
    }, key, callback)
    return result 
  }

  public undo(callback?: () => void) {
    const result = this.undoHistory?.undo() 
    this.internalSetState(result, callback)
    return result 
  }

  public redo4target(key: keyof C): ReturnUndoType<C>; 
  public redo4target(): ReturnUndoType<C>[];
  public redo4target(key?: keyof C, callback?: () => void) {
    const result = this.historyActionCommon<ReturnUndoType<C>>((history) => {
      return history?.redo()
    }, key, callback)
    return result 
  }

  public redo(callback?: () => void) {
    const result = this.undoHistory?.redo() 
    this.internalSetState(result, callback)
    return result 
  }

  public clear4target(key: keyof C): ReturnUndoVoidType; 
  public clear4target(): ReturnUndoVoidType[];
  public clear4target(key?: keyof C) {
    const result = this.historyActionCommon<ReturnUndoVoidType>((history) => {
      return history?.clear()
    }, key)
    return result 
  }

  public clear() {
    return this.undoHistory?.clear()
  }

  public jump4target(index: number, key: keyof C): ReturnUndoType<C>; 
  public jump4target(index: number): ReturnUndoType<C>[];
  public jump4target(index: number, key?: keyof C, callback?: () => void) {
    const result = this.historyActionCommon<ReturnUndoType<C>>((history) => {
      return history?.jump(index)
    }, key, callback)
    return result
  }

  public jump(index: number, callback?: () => void) {
    const result = this.undoHistory?.jump(index)
    this.internalSetState(result, callback)
    return result 
  }

  public jumpToPast4target(index: number, key: keyof C): ReturnUndoType<C>; 
  public jumpToPast4target(index: number): ReturnUndoType<C>[];
  public jumpToPast4target(index: number, key?: keyof C, callback?: () => void) {
    const result = this.historyActionCommon<ReturnUndoType<C>>((history) => {
      return history?.jumpToPast(index)
    }, key, callback)
    return result
  }

  public jumpToPast(index: number, callback?: () => void) {
    const result = this.undoHistory?.jumpToPast(index)
    this.internalSetState(result, callback)
    return result 
  }

  public jumpToFuture4target(index: number, key: keyof C): ReturnUndoType<C>; 
  public jumpToFuture4target(index: number, ): ReturnUndoType<C>[];
  public jumpToFuture4target(index: number, key?: keyof C, callback?: () => void) {
    const result = this.historyActionCommon<ReturnUndoType<C>>((history) => {
      return history?.jumpToFuture(index)
    }, key, callback)
    return result 
  }

  public jumpToFuture(index: number, callback?: () => void) {
    const result = this.undoHistory.jumpToFuture(index)
    this.internalSetState(result, callback)
    return result 
  }

}