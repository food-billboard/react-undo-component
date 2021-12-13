
## Component 


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
    } ] = useUndo()

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
      context.beginPath()
      console.log(x, y)
      context.arc(x, y , 10, 0, 2 * Math.PI)
      context.stroke()
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

### 筛选需要保存的历史记录 

### 限制保存的记录条数

### debug  

<style>
  button {
    margin: 16px;
  }
</style>

## API 

|  属性   | 说明  | 类型  | 默认值  |
|  ----  | ----  | ----  | ----  |
| limit  | 限制保存的记录数量，设置为`-1`则不限制 | `number` | - |
| filter  | 自定义筛选存入记录的数据 | `(action, currentState, prevState) => boolean` | - |
| debug  | 是否打印操作记录 | `boolean` | `true` |
| observer  | 指定需要记录的属性，仅支持`class`组件 | `boolean | string[]` | `true` |