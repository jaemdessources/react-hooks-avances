// Hook Perso
// http://localhost:3000/alone/exercise/04.js

import * as React from 'react'
import '../04-styles.css'

// 🐶 Utilise `React.forwardRef` pour wrapper le composant avec la 'ref' parente.
// Grace à cet référence tu pourras utiliser `useImperativeHandle`
// 🤖 const Composant = React.forwardRef(function Composant({onsubmit} , ref) {
const Composant = React.forwardRef(function Composant({onsubmit}, ref) {
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef()
  const buttonRef = React.useRef()

  function focusInput() {
    inputRef.current.focus()
  }

  function focusButton() {
    buttonRef.current.focus()
  }

  React.useImperativeHandle(ref, () => ({focusButton, focusInput}))

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      ></input>
      <input
        ref={buttonRef}
        type="button"
        value={'submit'}
        onClick={() => onsubmit(value)}
      ></input>
    </div>
  )
})

function App() {
  const [, setValue] = React.useState('')
  const [checked, setChecked] = React.useState('')

  const composantRef = React.useRef()

  const focusInput = () => composantRef.current.focusInput()
  const focusButton = () => composantRef.current.focusButton()

  const handleCheck = e => {
    setChecked(e.target.checked)
    e.target.checked ? focusInput() : focusButton()
  }
  return (
    <div>
      <Composant ref={composantRef} onsubmit={setValue} />
      <label>
        <input type="checkbox" checked={checked} onChange={handleCheck} /> Focus
        sur input / button ?
      </label>
    </div>
  )
}

export default App
