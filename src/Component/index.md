
## Component 
当中包含了`hooks`和`class`的例子  

## Example
### class形式  
```jsx
  import React from 'react'
  import { Component } from 'react-undo-component'

  export default class extends Component {

    state = {
      counter: 0
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1
        }
      })
    }

    render() {
      const { counter } = this.state 

      return (
        <div>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={this.handleAdd}>+1</button>
          <div>{counter}</div>
        </div>
      )
    }

  }

```

### hooks形式
```jsx
  import React, { useRef, useCallback, useEffect } from 'react'
  import { useUndo } from 'react-undo-component'

  export default () => {

    const [ step, setStep, {
      undo,
      redo 
    } ] = useUndo([])

    const canvasRef = useRef()

    const handleClick = useCallback((e) => {
      const left = e.target.offsetLeft 
      const top = e.target.offsetTop 
      const pageX = e.pageX 
      const pageY = e.pageY 
      const step = [ pageX - left, pageY - top ] 
      setStep(step)
    }, [])

    const dragArc = useCallback((state) => {
      if(!state) return 
      const [ x, y ] = state 
      const context = canvasRef.current.getContext("2d") 
      context.clearRect(0, 0, 400, 400)
      if(state.length) {
        context.beginPath()
        context.arc(x, y , 10, 0, 2 * Math.PI)
        context.stroke()
      }
    }, [])

    useEffect(() => {
      dragArc(step)
    }, [step])

    return (
      <div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
          onClick={handleClick}
        />
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
      </div>
    )

  }

```

### 指定需要保存记录的状态
- 此例子适用于`class`组件，`hooks`组件本身就是单一监听  
```jsx
  import React from 'react'
  import { Component } from 'react-undo-component'

  export default class extends Component {

    constructor(props) {
      super(props, {
        observer: ["counter"]
      })
    }

    state = {
      counter: 0,
      unObserverCounter: 0
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1,
          unObserverCounter: prev.counter + 1,
        }
      })
    }

    render() {
      const { counter, unObserverCounter } = this.state 

      return (
        <div>
          <button onClick={() => this.undo4target("counter")}>undo</button>
          <button onClick={() => this.redo4target("counter")}>redo</button>
          <button onClick={this.handleAdd}>+1</button>
          <div>
            counter: {counter}
          </div>
           <div>
            unObserverCounter: {unObserverCounter}
          </div>
        </div>
      )
    }

  }

```


### 筛选需要保存的历史记录 
```jsx
  import React from 'react'
  import { Component, ActionTypes } from 'react-undo-component'

  export default class extends Component {

    constructor(props) {
      super(props, {
        filter(action, currentState) {
          return action !== ActionTypes.ENQUEUE || currentState.present.counter % 5 !== 0
        }
      })
    }

    state = {
      counter: 0
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1
        }
      })
    }

    render() {
      const { counter } = this.state 

      return (
        <div>
          <div>这里使用自定义筛选，你也可以指定特定的类型进行筛选，具体查看下面的API</div>
          <div>只有不能被5整除的数据才能被保存</div>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={this.handleAdd}>+1</button>
          <div>{counter}</div>
        </div>
      )
    }

  }

```


### 限制保存的记录条数
```jsx
  import React from 'react'
  import { Component } from 'react-undo-component'

  export default class extends Component {

    constructor(props) {
      super(props, {
        limit: 5
      })
    }

    state = {
      counter: 0
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1
        }
      })
    }

    render() {
      const { counter } = this.state 

      return (
        <div>
          <div>只能存储最近的5条记录</div>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={this.handleAdd}>+1</button>
          <div>{counter}</div>
        </div>
      )
    }

  }

```


### debug  
```jsx
  import React from 'react'
  import { Component } from 'react-undo-component'

  export default class extends Component {

    constructor(props) {
      super(props, {
        debug: true 
      })
    }

    state = {
      counter: 0
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1
        }
      })
    }

    render() {
      const { counter } = this.state 

      return (
        <div>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={this.handleAdd}>+1</button>
          <div>{counter}</div>
        </div>
      )
    }

  }

```

<style>
  button {
    margin: 16px;
  }
</style>

## API 

|  属性   | 说明  | 类型  | 默认值  |
|  ----  | ----  | ----  | ----  |
| limit  | 限制保存的记录数量，设置为`-1`则不限制 | `number` | - |
| filter  | 自定义筛选存入记录的数据 | `(action, currentState, prevState) => boolean` \| `ActionTypes[]`  | - |
| debug  | 是否打印操作记录 | `boolean` | `true` |
| observer  | 指定需要记录的属性，仅支持`class`组件 | `boolean | string[]` | `true` |


- ActionTypes   

|  类型   | 名称  |
|  ----  | ----  |
| UNDO  | 撤销 |
| REDO  | 重做 |
| JUMP  | 跳到指定位置 |
| JUMP_TO_PAST  | 跳到历史指定位置 |
| JUMP_TO_FUTURE  | 跳到未来指定位置 |
| CLEAR_HISTORY  | 清除历史 |
| ENQUEUE  | 添加数据 |