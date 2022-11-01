// useLayoutEffect
// http://localhost:3000/alone/exercise/04.js

import * as React from 'react'
import '../04-styles.css'

function Composant({onsubmit}) {
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef()

  React.useLayoutEffect(() => {
    inputRef.current.focus()
  })

  return (
    <div>
      <input
        className=""
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      ></input>
      <input
        type="button"
        value={'submit'}
        onClick={() => onsubmit(value)}
      ></input>
    </div>
  )
}

function ComposantLent() {
  React.useEffect(() => {
    //longue action
    const end = Date.now() + 2500
    while (Date.now() < end) {}
  })
  return null
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = React.useState('')
  return (
    <div>
      <Composant onsubmit={setValue} />
      <ComposantLent />
    </div>
  )
}

export default App
