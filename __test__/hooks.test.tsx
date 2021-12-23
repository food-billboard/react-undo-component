import React, { useRef, useEffect } from 'react'
import { mount } from 'enzyme';
import { useUndo } from '../src'

describe("react hooks test", function() {

  it('set state with function', (done) => {
    
    const Component = () => {

      const [ state, setState ] = useUndo<number>(0)

      useEffect(() => {
        setState(prev => {
          return prev + 1
        })
      }, [])

      useEffect(() => {
        if(state === 1) {
          done()
        }
      }, [state])

      return (
        <div>

        </div>
      )

    }

    mount(<Component />)

  })

  it('set state with data', (done) => {

    const Component = () => {

      const [ state, setState ] = useUndo<number>(0)

      useEffect(() => {
        setState(1)
      }, [])

      useEffect(() => {
        if(state === 1) {
          done()
        }
      }, [state])

      return (
        <div>

        </div>
      )

    }

    mount(<Component />)

  })

  describe(`util function test`, () => {

    it(`undo test`, (done) => {

      const Component = () => {

        const [ state, setState, {
          undo
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 1) {
            if(!doneRef.current) {
              doneRef.current = true 
              setState(2)
            }else {
              done()
            }
          }else if(state === 2) {
            undo()
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)

    })

    it(`redo test`, (done) => {

      const Component = () => {

        const [ state, setState, {
          redo,
          undo
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
        const actionRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 0) {
            if(!doneRef.current) {
              doneRef.current = true 
            }else {
              redo()
            }
          }else if(state === 1) {
            if(!actionRef.current) {
              actionRef.current = true 
              undo()
            }else {
              done()
            }
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)

    })

    it(`jump test`, (done) => {

      const Component = () => {

        const [ state, setState, {
          jump
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 0) {
            if(!doneRef.current) {
              doneRef.current = true 
            }else {
              done()
            }
          }else if(state === 1) {
            jump(-1)
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)

    })

    it(`jumpToPast test`, (done) => {
      const Component = () => {

        const [ state, setState, {
          jumpToPast
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 0) {
            if(!doneRef.current) {
              doneRef.current = true 
            }else {
              done()
            }
          }else if(state === 1) {
            jumpToPast(0)
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)
    })

    it(`jumpToFuture test`, (done) => {

      const Component = () => {

        const [ state, setState, {
          jumpToFuture,
          undo
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
        const actionRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 0) {
            if(!doneRef.current) {
              doneRef.current = true 
            }else {
              jumpToFuture(0)
            }
          }else if(state === 1) {
            if(!actionRef.current) {
              actionRef.current = true 
              undo()
            }else {
              done()
            }
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)

    })

    it(`clear test`, (done) => {
      const Component = () => {

        const [ state, setState, {
          clear
        } ] = useUndo<number>(0)

        const doneRef = useRef(false)
  
        useEffect(() => {
          setState(1)
        }, [])
  
        useEffect(() => {
          if(state === 0) {
            if(!doneRef.current) {
              doneRef.current = true 
            }else {
              done()
            }
          }else if(state === 1) {
            clear()
          }
        }, [state])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)
    })

    it(`initState test`, (done) => {
      
      const Component = () => {

        const [ state ] = useUndo<number>(100)
  
        useEffect(() => {
          expect(state).toEqual(100)
          done()
        }, [])
  
        return (
          <div>
  
          </div>
        )
  
      }
  
      mount(<Component />)

    })

  })

})