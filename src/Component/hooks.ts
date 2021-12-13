import { useCallback, useState, SetStateAction, useMemo, useEffect } from 'react'
import UndoHistory from './history'
import { DEFAULT_PRESENT_DATA, CAN_NOT_DEALING } from './constants'
import { HookProps } from './type'

export type HistoryReturnType<T> = undefined | typeof CAN_NOT_DEALING | T

export type SetStateType<T> = (state: ((prevState: T) => T) | T) => void

export default function useRedo<S = any>(initialState: S | (() => S), configuration: HookProps<S>): [S | undefined | typeof DEFAULT_PRESENT_DATA, SetStateType<S>, {
  undo: () => HistoryReturnType<S>
  redo: () => HistoryReturnType<S>
  clear: () => typeof CAN_NOT_DEALING | void 
  jump: (index: number) =>  HistoryReturnType<S>
  jumpToPast: (index: number) =>  HistoryReturnType<S>
  jumpToFuture: (index: number) =>  HistoryReturnType<S>
}] {

  const [ state, setState ] = useState<S>(initialState)

  const undoHistory = new UndoHistory<S>(configuration)

  const present = useMemo(() => {
    return undoHistory.state
  }, [undoHistory])

  const internalSetState = useCallback((state: SetStateAction<S>) => {
    setState(prev => {
      let realState: S 
      if(typeof state === "function") {
        realState = (state as Function)(prev)
      }else {
        realState = state 
      }
      undoHistory.enqueue(realState, prev)
      return realState
    })
  }, [])

  const unNillAndUpdate = (state: HistoryReturnType<S>) => {
    if(state !== undefined && state !== CAN_NOT_DEALING) setState(state)
  }

  const undo = useCallback(() => {
    const result = undoHistory.undo()
    unNillAndUpdate(result)
    return result 
  }, [])

  const redo = useCallback(() => {
    const result = undoHistory.redo()
    unNillAndUpdate(result)
    return result 
  }, [])

  const clear = useCallback(() => {
    return undoHistory.clear()
  }, [])

  const jump = useCallback((index: number) => {
    const result = undoHistory.jump(index)
    unNillAndUpdate(result)
    return result 
  }, [])

  const jumpToPast = useCallback((index: number) => {
    const result = undoHistory.jumpToPast(index)
    unNillAndUpdate(result)
    return result 
  }, [])

  const jumpToFuture = useCallback((index: number) => {
    const result = undoHistory.jumpToFuture(index)
    unNillAndUpdate(result)
    return result 
  }, [])

  useEffect(() => {
    const value = typeof initialState === "function" ? (initialState as Function)() : initialState
    value !== undefined && undoHistory.initState(value)
  }, [])

  return [
    state,
    internalSetState,
    {
      undo,
      redo,
      clear,
      jump,
      jumpToFuture,
      jumpToPast
    }
  ]
}