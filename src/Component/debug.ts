import { ActionTypes } from './constants'

class Debug<S=any> {

  constructor(debug: boolean) {
    this.__DEBUG__ = debug 
  }

  __DEBUG__: boolean = false
  displayBuffer: {
    [key: string]: any[]
  } = {
    header: [],
    prev: [],
    action: [],
    next: [],
    msgs: []
  }

  colors = {
    prevState: '#9E9E9E',
    action: '#03A9F4',
    nextState: '#4CAF50'
  }

  /* istanbul ignore next: debug messaging is not tested */
  initBuffer() {
    this.displayBuffer = {
      header: [],
      prev: [],
      action: [],
      next: [],
      msgs: []
    }
  }

  /* istanbul ignore next: debug messaging is not tested */
  printBuffer() {
    const { header, prev, next, action, msgs } = this.displayBuffer
    console.groupCollapsed(...header)
    console.log(...prev)
    console.log(...action)
    console.log(...next)
    console.log(...msgs)
    console.groupEnd()
  }

  /* istanbul ignore next: debug messaging is not tested */
  colorFormat(text: string, color: string, obj: any) {
    return [
      `%c${text}`,
      `color: ${color}; font-weight: bold`,
      obj
    ]
  }

  /* istanbul ignore next: debug messaging is not tested */
  start(action: {
    type: keyof typeof ActionTypes
    [key: string]: any 
  }, state: S) {
    this.initBuffer()
    if (this.__DEBUG__) {
      this.displayBuffer.header = ['%cundo', 'font-style: italic', 'action', action.type]
      this.displayBuffer.action = this.colorFormat('action', this.colors.action, action)
      this.displayBuffer.prev = this.colorFormat('prev history', this.colors.prevState, state)
    }
  }

  /* istanbul ignore next: debug messaging is not tested */
  end(nextState: S) {
    if (this.__DEBUG__) {
      this.displayBuffer.next = this.colorFormat('next history', this.colors.nextState, nextState)
      this.printBuffer()
    }
  }

  /* istanbul ignore next: debug messaging is not tested */
  log(...args: any[]) {
    if (this.__DEBUG__) {
      this.displayBuffer.msgs = this.displayBuffer.msgs
        .concat([...args, '\n'])
    }
  }

}

export default Debug