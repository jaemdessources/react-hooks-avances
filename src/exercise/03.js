// Hook Perso
// http://localhost:3000/alone/exercise/02.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchMarvel,
  fetchMarvelsList,
  MarvelSearchForm,
  ErrorDisplay,
  MarvelPersoView,
} from '../marvel'
import '../02-styles.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'fetching':
      return {status: 'fetching', data: null, error: null}
    case 'done':
      return {status: 'done', data: action.payload, error: null}
    case 'fail':
      return {status: 'fail', data: null, error: action.error}
    default:
      throw new Error('Action non supporté')
  }
}

function useFetchData() {
  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    error: null,
    status: 'idle',
  })

  const execute = React.useCallback(fn => {
    dispatch({type: 'fetching'})
    fn.then(marvel => dispatch({type: 'done', payload: marvel})).catch(error =>
      dispatch({type: 'fail', error}),
    )
  }, [])

  return {...state, execute}
}

function useFindMarvelList(marvelName) {
  const {data, error, status, execute} = useFetchData()
  React.useEffect(() => {
    if (!marvelName) return
    execute(fetchMarvelsList(marvelName))
  }, [marvelName, execute])
  return {data, error, status}
}

function useFindMarvelByName(marvelName) {
  const {data, error, status, execute} = useFetchData()
  React.useEffect(() => {
    if (!marvelName) return
    execute(fetchMarvel(marvelName))
  }, [marvelName, execute])
  return {data, error, status}
}

function Marvel({marvelName}) {
  const state = useFindMarvelByName(marvelName)
  const {data: marvel, error, status} = state
  if (status === 'fail') {
    throw error
  } else if (status === 'idle') {
    return 'enter un nom de Marvel'
  } else if (status === 'fetching') {
    return 'chargement en cours ...'
  } else if (status === 'done') {
    return <MarvelPersoView marvel={marvel} />
  }
}

function MarvelList({marvelName}) {
  const state = useFindMarvelList(marvelName)
  const {data: marvels, error, status} = state
  if (status === 'fail') {
    throw error
  } else if (status === 'idle') {
    return 'enter un nom de Marvel'
  } else if (status === 'fetching') {
    return 'chargement en cours ...'
  } else if (status === 'done') {
    return (
      <>
        {marvels.map(marvel => {
          return (
            <div key={marvel.id}>
              <hr style={{background: 'grey'}} />
              <MarvelPersoView marvel={marvel} />
            </div>
          )
        })}
      </>
    )
  }
}

function App() {
  const [marvelName, setMarvelName] = React.useState('')
  const [searchList, setSearchList] = React.useState('')
  const handleSearch = name => {
    setMarvelName(name)
  }
  return (
    <div className="marvel-app">
      <label>
        <input
          type="checkbox"
          checked={searchList}
          onChange={e => setSearchList(e.target.checked)}
        />{' '}
        Chercher une liste ?
      </label>
      <MarvelSearchForm marvelName={marvelName} onSearch={handleSearch} />
      <div className="marvel-detail">
        <ErrorBoundary key={marvelName} FallbackComponent={ErrorDisplay}>
          {searchList ? (
            <MarvelList marvelName={marvelName} />
          ) : (
            <Marvel marvelName={marvelName} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
