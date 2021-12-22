import React from 'react'
import { mount, shallow } from 'enzyme';
import { Component } from '../src'
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

    it('undo4Target test', () => {

    })

    it(`redo test`, () => {

    })

    it('redo4Target test', () => {

    })

    it(`jump test`, () => {

    })

    it(`jump4target test`, () => {

    })

    it(`jumpToPast test`, () => {

    })

    it(`jumpToPast4target test`, () => {

    })

    it(`jumpToFuture test`, () => {

    })

    it(`jumpToFuture4target test`, () => {

    })

    it(`clear test`, () => {

    })

    it(`clear4target test`, () => {

    })

    it(`initState test`, () => {
      
    })

  })

})