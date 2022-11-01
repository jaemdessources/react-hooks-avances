// useReducer
// http://localhost:3000/alone/exercise/01.js

/* eslint-disable no-unused-vars */
import * as React from 'react'
import calculate from '../logic/calculate'
import '../01-styles.css'

// 🐶 va en bas dans App() finir le refactoring classe Hook
function Display({value}) {
  return (
    <div className="component-display">
      <div>{value}</div>
    </div>
  )
}
function Button({name, orange, wide, clickHandler}) {
  const handleClick = () => {
    clickHandler(name)
  }

  const className = [
    'component-button',
    orange ? 'orange' : '',
    wide ? 'wide' : '',
  ]
  return (
    <div className={className.join(' ').trim()}>
      <button onClick={handleClick}>{name}</button>
    </div>
  )
}
function ButtonPanel({clickHandler}) {
  const handleClick = buttonName => {
    clickHandler(buttonName)
  }

  return (
    <div className="component-button-panel">
      <div>
        <Button name="AC" clickHandler={handleClick} />
        <Button name="+/-" clickHandler={handleClick} />
        <Button name="%" clickHandler={handleClick} />
        <Button name="÷" clickHandler={handleClick} orange />
      </div>
      <div>
        <Button name="7" clickHandler={handleClick} />
        <Button name="8" clickHandler={handleClick} />
        <Button name="9" clickHandler={handleClick} />
        <Button name="x" clickHandler={handleClick} orange />
      </div>
      <div>
        <Button name="4" clickHandler={handleClick} />
        <Button name="5" clickHandler={handleClick} />
        <Button name="6" clickHandler={handleClick} />
        <Button name="-" clickHandler={handleClick} orange />
      </div>
      <div>
        <Button name="1" clickHandler={handleClick} />
        <Button name="2" clickHandler={handleClick} />
        <Button name="3" clickHandler={handleClick} />
        <Button name="+" clickHandler={handleClick} orange />
      </div>
      <div>
        <Button name="0" clickHandler={handleClick} wide />
        <Button name="." clickHandler={handleClick} />
        <Button name="=" clickHandler={handleClick} orange />
      </div>
    </div>
  )
}

const reducer = (state, newState) => {
  console.info({...state, ...newState})
  return {...state, ...newState}
}
function App() {
  const [state, setState] = React.useReducer(reducer, {
    total: null,
    next: null,
    operation: null,
  })

  const handleClick = buttonName => {
    setState(calculate(state, buttonName))
  }

  return (
    <div className="component-app">
      <Display value={state.next || state.total || '0'} />
      <ButtonPanel clickHandler={handleClick} />
    </div>
  )
}

export default App
