
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
        filter(action, _, prevState) {
          return action !== ActionTypes.ENQUEUE || (prevState.present.counter % 5 !== 0)
        },
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
          <button onClick={() => this.jump(3)}>jump+3</button>
          <button onClick={() => this.jump(-3)}>jump-3</button>
          <button onClick={() => this.jumpToPast(2)}>jumpToPast&2</button>
          <button onClick={() => this.jumpToFuture(2)}>jumpToFuture&2</button>
          <button onClick={() => this.clear()}>clear</button>
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

### defined method 

#### hooks 

**useUndo**  
```js
  const [ state, setState, {
    undo,
    redo,
    history,
    jump,
    jumpToPast,
    jumpToFuture
  } ] = useUndo(0, { /*config*/ })
```
##### undo  
状态回退  
`undo()`

##### redo 
状态前进  
`redo()`

##### clear 
清除历史记录  
`clear()`  

##### jump  
前进(正数)或后退(负数)  
`jump(1)`  

##### jumpToPast  
跳转到历史指定位置  
`jumpToPast(0)` 
##### jumpToFuture
跳转到未来指定位置  
`jumpToFuture(0)` 
##### history  
获取`history`实例  

#### component 

下面所有方法都存在一个`callback`参数，为`setState`的第二参数  

- 以下为全量监听时使用  
##### undo  
同上  
`undo(callback?)`  

##### redo 
同上  
`redo(callback?)`  

##### clear 
同上  
`redo(callback?)`  

##### jump  
同上  
`jump(1, callback?)`  

##### jumpToPast  
同上  
`jumpToPast(1, callback?)`  
##### jumpToFuture
同上  
`jumpToFuture(1, callback?)`  
##### history  
同上  `History`

- 以下为指定监听时使用，用法基本与上面一致，多了一个参数`key`，为指定需要操作的`state`名称，不填则操作全部`observer`状态    

##### undo4target  
同上  
`undo4target(key?, callback?)`  

##### redo4target 
同上  
`redo4target(key?, callback?)`  

##### clear4target 
同上  
`clear4target(key?, callback?)`  

##### jump4target  
同上  
`jump4target(1, key?, callback?)`  

##### jumpToPast4target  
同上  
`jumpToPast4target(1, key?, callback?)`  
##### jumpToFuture4target
前进指定步数  
`jumpToFuture4target(1, key?, callback?)`  
#### history  
同上  `Map<string, History>`  
### config 

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

- 可以直接使用内置的`includeFilter`和`excludeFilter`方法做对应的筛选。  

## 注意事项  
### 关于`clear`方法  
`class`组件与`hooks`某些情况下可能表现不同  
`class`组件的`clear`与`clear4target`方法表现也不同  
具体如下: 
  1. hooks 
```js | pure 
  // 1. when set the initialValue 
  const [state, setState, {
    clear 
  }] = useUndo(0)

  clear()  

  // the state will be the initialValue 
  console.log(state) // ->> 0

  // -------------------------------

  // 2. when ignore the initialValue 
  const [ state, setState ] = useUndo()

  clear() 

  // the state will be the default initialValue for string "__DEFAULT_PRESENT_DATA__"
  console.log(state) // -->> "__DEFAULT_PRESENT_DATA__"

```

  2. class  
  - 全量监听
```js | pure 

class Template extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    counter: 0
  }

  clearState = () => {

    // when not set the initialValue 
    this.clear() 

    // the state will not be changed 
    console.log(this.state.counter) // -->> 0

    // ---------------
    
    // set the initialValue 
    this.history.initState({
      counter: 1
    })

    this.clear() 

    // clear the history and the state will be the initialValue 
    console.log(this.state.counter) // --> 1

  } 

  render() {
    const { counter } = this.state 
    return (
      <div>
        <span>counter: {counter}</span>
        <span onClick={this.clearState}>clear</span>
      </div>
    )
  }

}

```
  - 部分监听  
```js | pure 

class Template extends Component {

  constructor(props) {
    // just observer the state of counter 
    super(props, {
      observer: ["counter"]
    })
  }

  state = {
    counter: 0,
    anotherCounter: 0
  }

  clearState = () => {

    // when not set the initialValue 
    this.clear4target("counter") 

    // the state will not be changed 
    console.log(this.state) // -->> { anotherCounter: 0, counter: "__DEFAULT_PRESENT_DATA__" }

    // ---------------
    
    // set the initialValue 
    const histories = this.history // Map 
    const counterHistory = histories.get("counter") 
    counterHistory.initState(1)

    this.clear4target("counter") 

    // clear the history and the state will be the initialValue 
    console.log(this.state) // -->> { anotherCounter: 0, counter: 1 }

  } 

  render() {
    const { counter } = this.state 
    return (
      <div>
        <span>counter: {counter}</span>
        <span onClick={this.clearState}>clear</span>
      </div>
    )
  }

}

```

### 关于history  
- history是状态控制的工具方法，在`hooks`和`component`组件中都对外暴露了它的实例，你可以通过直接操作他们来完成状态的切换。  
当然他不会同步到`react`组件的状态当中去。  
- 你也可以使用`history`完成自己的状态控制。  
- 在`component`组件当中，与上面的`clear`方法一样，存在**全量监听**和**指定监听**  
  - 当设置`全量监听`时，通过`this.history`返回的是一个包含整个`state`的实例。  
  - 当设置`指定监听`时，通过`this.history`返回的是一个`Map`对象，`key`为`observer`指定的值，`value`为对应的`history`实例。  

### 关于失败的情况  
在操作组件历史状态的时候，有时会出现一些不合理的操作，比如`past`当中没有记录了，但是调用了`undo`方法，这就是不合理的情况，所以在判断是否合理时，可以通过判断返回值是否为`"__CAN_NOT_DEALING__"`，当出现这个值时，即为不合理的操作。   
你也可以使用`history`示例的`isActionDataValid`方法判断响应值是否合理。     

### 关于callback  
在`component`中所有的方法都包含了一个`callback`参数，其为`setState`的第二参数，但是因为可能会出现`history`操作不合理的情况。  
当出现不合理情况时，`callback`方法是不会被调用的，所以尽量不要使用它来作为状态改变的依据。  
当需要做状态改变判断时，可以通过和方法返回值配合使用来进行判断，具体请看下方示例：    
```js | pure 
  import React from 'react' 
  import { Component } from 'react-undo-component'

  class TemplateUndoComponent extends Component {

    state = {
      counter: 1
    }

    handleAdd = () => {
      this.setState(prev => {
        return {
          counter: prev.counter + 1
        }
      })
    }

    handleUndo = () => {
      await new Promise((resolve, reject) => {
        const result = this.undo(resolve)
        // Judge whether the value is "__CAN_NOT_DEALING__"
        if(!this.history.isActionDataValid(result)) {
          reject()
        }
      })
    }

    render() {

      const { counter } = this.state 

      return (
        <div>
          counter: {counter}
          <button onClick={this.handleAdd}>+1</button>
          <button onClick={this.handleUndo}>undo</button>
        </div>
      )

    }

  }

```