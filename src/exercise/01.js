// useReducer
// http://localhost:3000/alone/exercise/01.js

/* eslint-disable no-unused-vars */
import * as React from 'react'

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {count: prevState.count + action.payload}
    case 'DECREMENT':
      return {count: prevState.count - action.payload}
    case 'RESET':
      return {count: 0}
    default:
      throw new Error()
  }
}

function Compteur() {
  const [state, dispatch] = React.useReducer(reducer, 0)
  const increment = (x = 1) => dispatch({type: 'INCREMENT', payload: x})
  const decrement = (x = 1) => dispatch({type: 'DECREMENT', payload: x})
  const reset = () => dispatch({type: 'RESET'})
  return (
    <>
      <input
        type="button"
        onClick={() => {
          decrement()
        }}
        value={'Decrement'}
      />
      <input
        type="button"
        onClick={() => {
          decrement(10)
        }}
        value={'Decrement by 10'}
      />
      <input
        type="button"
        onClick={() => {
          increment()
        }}
        value={'Increment'}
      />
      <input
        type="button"
        onClick={() => {
          increment(5)
        }}
        value={'Increment by 5'}
      />
      <input
        type="button"
        onClick={() => {
          reset()
        }}
        value={'Reset'}
      />
      <input type="button" value={state.count} />
    </>
  )
}

function App() {
  return <Compteur />
}

export default App
