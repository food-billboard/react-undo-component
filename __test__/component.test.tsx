import React from 'react'
import { shallow } from 'enzyme';
import { Component } from '../src'
import { DEFAULT_PRESENT_DATA } from '../src/Component/constants'
import UndoHistory from '../src/Component/history'

class DefaultUndoComponent extends Component<any, {
  counter: number
}> {

  state = {
    counter: 0
  }

  setData = async (value: number) => {
    return new Promise((resolve) => {
      this.setState({
        counter: value
      }, resolve.bind(this, undefined))
    })
  }

  render() {
    return (
      <div></div>
    )
  }

}

class ObserverUndoComponent extends Component<any, {}, any, {
  counter: number
}> {

  constructor(props) {
    super(props, {
      observer: ["counter"]
    })
  }

  state = {
    counter: 0
  }

  setData = async (value: number) => {
    return new Promise((resolve) => {
      this.setState({
        counter: value
      }, resolve.bind(this, undefined))
    })
  }

  render() {
    return (
      <div></div>
    )
  }

}

class ObserverMultiUndoComponent extends Component<any, {}, any, {
  counter: number
  total: number 
}> {

  constructor(props) {
    super(props, {
      observer: ["counter", "total"]
    })
  }

  state = {
    counter: 0,
    total: 0
  }

  setCounter = async (value: number) => {
    return new Promise((resolve) => {
      this.setState({
        counter: value
      }, resolve.bind(this, undefined))
    })
  }

  setTotal = (value: number) => {
    return new Promise((resolve) => {
      this.setState({
        total: value
      }, resolve.bind(this, undefined))
    })
  }

  render() {
    return (
      <div></div>
    )
  }

}

describe("react component test", function() {

  it('set state with function', (done) => {

    const wrapper = shallow(<DefaultUndoComponent />)

    expect(wrapper.state().counter).toEqual(0)

    wrapper.instance().setState(prev => {
      return {
        counter: 1
      }
    }, () => {
      expect(wrapper.state().counter).toEqual(1);
  
      expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

      done()
    })

  })

  it('set state with data', (done) => {

    const wrapper = shallow(<DefaultUndoComponent />)

    expect(wrapper.state().counter).toEqual(0)

    wrapper.instance().setState({
      counter: 1
    }, () => {
      expect(wrapper.state().counter).toEqual(1);
  
      expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

      done()
    })

  })

  it(`set state with function and return null`, (done) => {
    const wrapper = shallow(<DefaultUndoComponent />)

    expect(wrapper.state().counter).toEqual(0)

    wrapper.instance().setState(() => {
      return null 
    }, () => {
      expect(wrapper.state().counter).toEqual(0);
  
      expect((wrapper.instance().history as UndoHistory).history.past.length).toEqual(0)

      done()
    })
  })

  it(`set state with null`, (done) => {
    const wrapper = shallow(<DefaultUndoComponent />)

    expect(wrapper.state().counter).toEqual(0)

    wrapper.instance().setState(null, () => {
      expect(wrapper.state().counter).toEqual(0);
  
      expect((wrapper.instance().history as UndoHistory).history.past.length).toEqual(0)

      done()
    })
  })

  describe(`config observer`, () => {


    it(`observer for all`, (done) => {

      const wrapper = shallow(<DefaultUndoComponent />)

      expect(wrapper.state().counter).toEqual(0)
  
      wrapper.instance().setState(prev => {
        return {
          counter: 1
        }
      }, () => {
    
        expect((wrapper.instance().history as UndoHistory).state).toEqual({ counter: 1 })
  
        done()
      })

    })

    it(`observer for appoint`, (done) => {

      class DefaultUndoComponent extends Component<any, {
        counter: number
      }, any, {
        counter: number 
      }> {

        constructor(props) {
          super(props, {
            observer: [ "counter" ]
          })
        }
      
        state = {
          counter: 0
        }
      
        render() {
          return (
            <div></div>
          )
        }
      
      }
      
      const wrapper = shallow(<DefaultUndoComponent />)

      expect(wrapper.state().counter).toEqual(0)
  
      wrapper.instance().setState(prev => {
        return {
          counter: 1
        }
      }, () => {

        const history = wrapper.instance().history

        expect(Object.prototype.toString.call(history)).toEqual("[object Map]")
        
        const target = (history as Map<any, UndoHistory>).get("counter")

        expect(target.state).toEqual(1)
  
        done()
      })

    })

  })

  describe(`util function test`, () => {

    it(`undo test`, (done) => {

      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        wrapper.instance().undo(() => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(0)

          done()
        })
      })

    })

    it('undo4Target test', (done) => {

      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        wrapper.instance().undo4target("counter", () => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect(targetHistory.state).toEqual(0)

          done()
        })
      })

    })

    it(`undo4Target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      .then(_ => wrapper.instance().setTotal(1))
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().undo4target(() => {
          expect(wrapper.state().counter).toEqual(0);
          expect(wrapper.state().total).toEqual(0);
    
          expect(counterHistory.state).toEqual(0)
          expect(totalHistory.state).toEqual(0)

          done()
        })
      })
    })

    it(`redo test`, (done) => {

      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        wrapper.instance().undo(() => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(0)

          wrapper.instance().redo(() => {
            expect(wrapper.state().counter).toEqual(1);
      
            expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)
  
            done()
  
          })

        })
      })

    })

    it('redo4Target test', (done) => {

      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        wrapper.instance().undo4target("counter", () => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect(targetHistory.state).toEqual(0)

          wrapper.instance().redo4target("counter", () => {
            expect(wrapper.state().counter).toEqual(1);
      
            expect(targetHistory.state).toEqual(1)
  
            done()
          })
        })
      })

    })

    it(`redo4Target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      .then(_ => wrapper.instance().setTotal(1))
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().undo4target(() => {
          expect(wrapper.state().counter).toEqual(0);
          expect(wrapper.state().total).toEqual(0);
    
          expect(counterHistory.state).toEqual(0)
          expect(totalHistory.state).toEqual(0)

          wrapper.instance().redo4target(() => {
            expect(wrapper.state().counter).toEqual(1);
            expect(wrapper.state().total).toEqual(1);
        
            expect(counterHistory.state).toEqual(1)
            expect(totalHistory.state).toEqual(1)
  
            done()
          })
        })

      })
    })

    it(`jump test`, (done) => {

      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        return wrapper.instance().setData(2)

      })
      .then(_ => {
        expect(wrapper.state().counter).toEqual(2);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(2)

        wrapper.instance().jump(-1, () => {
          expect(wrapper.state().counter).toEqual(1);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

          done()

        })
      })

    })

    it(`jump4target test`, (done) => {
      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        return wrapper.instance().setData(2)

      })
      .then(_ => {
        expect(wrapper.state().counter).toEqual(2);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(2)

        wrapper.instance().jump4target(-1, "counter", () => {
          expect(wrapper.state().counter).toEqual(1);
    
          expect(targetHistory.state).toEqual(1)

          done()
        })
      })
    })

    it(`jump4target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      .then(_ => wrapper.instance().setTotal(1))
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().jump4target(-1, () => {
          expect(wrapper.state().counter).toEqual(0);
          expect(wrapper.state().total).toEqual(0);
    
          expect(counterHistory.state).toEqual(0)
          expect(totalHistory.state).toEqual(0)

          done()
        })
      })
    })

    it(`jumpToPast test`, (done) => {
      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        wrapper.instance().jumpToPast(0, () => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(0)

          done()
        })
      })
    })

    it(`jumpToPast4target test`, (done) => {
      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        wrapper.instance().jumpToPast4target(0, "counter", () => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect(targetHistory.state).toEqual(0)

          done()
        })
      })
    })

    it(`jumpToPast4target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      .then(_ => wrapper.instance().setTotal(1))
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().jumpToPast4target(0, () => {
          expect(wrapper.state().counter).toEqual(0);
          expect(wrapper.state().total).toEqual(0);
    
          expect(counterHistory.state).toEqual(0)
          expect(totalHistory.state).toEqual(0)

          done()
        })
      })
    })

    it(`jumpToFuture test`, (done) => {

      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        wrapper.instance().undo(() => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(0)

          wrapper.instance().jumpToFuture(0, () => {
            expect(wrapper.state().counter).toEqual(1);
      
            expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)
  
            done()
  
          })

        })
      })

    })

    it(`jumpToFuture4target test`, (done) => {
      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        wrapper.instance().undo4target("counter", () => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect(targetHistory.state).toEqual(0)

          wrapper.instance().jumpToFuture4target(0, "counter", () => {
            expect(wrapper.state().counter).toEqual(1);
      
            expect(targetHistory.state).toEqual(1)
  
            done()
          })
        })
      })
    })

    it(`jumpToFuture4target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      .then(_ => wrapper.instance().setTotal(1))
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().undo4target(() => {
          expect(wrapper.state().counter).toEqual(0);
          expect(wrapper.state().total).toEqual(0);
    
          expect(counterHistory.state).toEqual(0)
          expect(totalHistory.state).toEqual(0)

          wrapper.instance().jumpToFuture4target(0, () => {
            expect(wrapper.state().counter).toEqual(1);
            expect(wrapper.state().total).toEqual(1);
        
            expect(counterHistory.state).toEqual(1)
            expect(totalHistory.state).toEqual(1)
  
            done()
          })
        })

      })
    })

    it(`clear test`, (done) => {
      const wrapper = shallow(<DefaultUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect(wrapper.instance().history.state.counter).toEqual(1)
        wrapper.instance().clear()
        expect(wrapper.state().counter).toEqual(1);
    
        expect(wrapper.instance().history.state).toEqual(DEFAULT_PRESENT_DATA)

        done()
      })
    })

    it(`clear4target test`, (done) => {

      const wrapper = shallow(<ObserverUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);

        const history = wrapper.instance().history
        const targetHistory = history.get("counter")

        expect(targetHistory.state).toEqual(1)

        wrapper.instance().clear4target("counter")

        expect(wrapper.state().counter).toEqual(DEFAULT_PRESENT_DATA);
    
        expect(targetHistory.state).toEqual(DEFAULT_PRESENT_DATA)

        done()

      })

    })

    it(`clear4target for all test`, (done) => {
      const wrapper = shallow(<ObserverMultiUndoComponent />)

      wrapper.instance().setCounter(1)
      wrapper.instance().setTotal(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
        expect(wrapper.state().total).toEqual(1);

        const history = wrapper.instance().history
        const counterHistory = history.get("counter")
        const totalHistory = history.get("total")

        expect(counterHistory.state).toEqual(1)
        expect(totalHistory.state).toEqual(1)

        wrapper.instance().clear4target()

        expect(wrapper.state().counter).toEqual(DEFAULT_PRESENT_DATA);
        expect(wrapper.state().total).toEqual(DEFAULT_PRESENT_DATA);
    
        expect(counterHistory.state).toEqual(DEFAULT_PRESENT_DATA)
        expect(totalHistory.state).toEqual(DEFAULT_PRESENT_DATA)

        done()

      })
    })

    it(`initState test`, (done) => {
      
      class InitStateUndoComponent extends Component<any, {}, any, {
        counter: number
      }> {
      
        constructor(props) {
          super(props)
        }
      
        state = {
          counter: 0
        }

        componentDidMount = () => {
          (this.history as UndoHistory).initState({
            counter: 0
          }, true)
        }
      
        setData = async (value: number) => {
          return new Promise((resolve) => {
            this.setState({
              counter: value
            }, resolve.bind(this, undefined))
          })
        }
      
        render() {
          return (
            <div></div>
          )
        }
      
      }

      const wrapper = shallow(<InitStateUndoComponent />)

      wrapper.instance().setData(1)
      .then(_ => {
        expect(wrapper.state().counter).toEqual(1);
    
        expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(1)

        wrapper.instance().clear(() => {
          expect(wrapper.state().counter).toEqual(0);
    
          expect((wrapper.instance().history as UndoHistory).state.counter).toEqual(0)

          done()

        })
      })

    })

  })

})