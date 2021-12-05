import React, { Component } from 'react'
import { ComponentProps } from './type'

export default class WrapperComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {

  constructor(props: P, configuration: ComponentProps<S>) {
    super(props)
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

  private internalSetState!: Component["setState"]

}