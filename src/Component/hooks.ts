import { useCallback, useState, Dispatch, SetStateAction, useRef } from 'react'
import UndoHistory from './history'
import { HookProps } from './type'

export default function useRedo<S = undefined>(initialState: S | (() => S), configuration: HookProps<S>): [S | undefined, Dispatch<SetStateAction<S | undefined>>, UndoHistory] {

  // const [ state, setState ] = useState<S>()

  const state = useRef<S>()

  const undoHistory = new UndoHistory<S>(configuration)

  const internalSetState = useCallback(() => {
    
  }, [])

  return [
    state.current,
    internalSetState,
    undoHistory
  ]
}