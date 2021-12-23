# react-undo-component
React状态控制组件  

## Demo  
点我查看[demo](https://food-billboard.github.io/react-undo-component/)  

## 介绍  
`react-undo-component`是一个用于控制`react`组件状态历史管理的工具库，支持`class`和`hooks`两种，可以对数据进行前进和后退的操作。  
并且扩展了一些比较实用的方法。    
## 基本使用  
- class  
```tsx
  import React from 'react'
  import { Component } from 'react-undo-component' 

  class UndoComponent extends Component<ant, any, any, {
    counter: number
  }> {

    state = {
      counter: 0
    }

    handleAdd = () => {
      const { counter } = this.state 
      this.setState({
        counter: counter + 1
      })
    }

    handleUndo = () => {
      this.undo()
    }

    render() {

      const { counter } = this.state 

      return (
        <div>
          <div>counter: {counter}</div>
          <button onClick={this.handleAdd}>+1</button>
          <button onClick={this.handleUndo}>undo</button>
        </div>
      )

    }

  }

```

- hooks  
```tsx
  import React from 'react'
  import { useUndo } from 'react-undo-component'

  const UndoComponent = () => {

    const [ counter, setCounter, {
      undo
    } ] = useUndo<number>(0)

    const handleAdd = () => {
      setCounter(prev => prev + 1)
    }

    const handleUndo = () => {
      undo()
    }

    return (
        <div>
          <div>counter: {counter}</div>
          <button onClick={handleAdd}>+1</button>
          <button onClick={handleUndo}>undo</button>
        </div>
      )
  }

```

## 方法  
工具库提供了`undo`、`redo`、`jump`、`jumpToPast`、`jumpToFuture`等方法控制组件状态的改变。  
具体可以查看[demo](https://food-billboard.github.io/react-undo-component/)  