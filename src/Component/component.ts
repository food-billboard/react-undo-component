import React, { Component } from 'react'
import UndoHistory from './history'
import { ComponentProps } from './type'

export default class WrapperComponent<P = {}, S = {}, SS = any, C extends object = {}> extends Component<P, S, SS> {

  constructor(props: P, configuration: ComponentProps<C>) {
    super(props)

    this.generateUndoHistory(configuration)

    this.internalSetState = this.setState.bind(this)
    this.setState = function(state, callback) {
      this.internalSetState((prev, props) => {
        let realState 
        if(typeof state !== "function") {
          realState = (state as any)(prev, props)
        }else {
          realState = state 
        }
      }, callback)
    }
  }

  private undoHistory:any 

  private generateUndoHistory(configuration: ComponentProps<C>) {
    const { observer, ...nextConfiguration } = configuration
    if(observer === true) {
      this.undoHistory = new UndoHistory(nextConfiguration)
    }else {
      observer?.forEach((cur) => {
        this.undoHistory[cur] = new UndoHistory(nextConfiguration)
      })
    }
  }

  private internalSetState!: Component["setState"]

}