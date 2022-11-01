// Hook Perso
// http://localhost:3000/alone/exercise/02.js

/* eslint-disable no-unused-vars */
import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchMarvel,
  MarvelPersoView,
  MarvelSearchForm,
  ErrorDisplay,
  fetchMarvelsList,
} from '../marvel'
import '../02-styles.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'fetching':
      return {status: 'fetching', data: null, error: null}
    case 'done':
      return {status: 'done', data: action.payload, error: null}
    case 'fail':
      return {status: 'fail', data: null, error: action.payload}
    default:
      throw new Error('action type not authorized')
  }
}

function useFetchData(search, fetch) {
  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!search) {
      return
    }

    dispatch({type: 'fetching'})
    fetch(search)
      .then(data => {
        dispatch({type: 'done', payload: data})
      })
      .catch(error => dispatch({type: 'fail', payload: error}))
  }, [search, fetch])

  return state
}

function Marvel({marvelName}) {
  const {data, error, status} = useFetchData(marvelName, fetchMarvel)
  if (status === 'fail') {
    throw error
  } else if (status === 'idle') return 'Entrez un nom de personnage Marvel'
  else if (status === 'fetching') return 'Chargement en cours'
  else if (status === 'done') {
    return <MarvelPersoView marvel={data} />
  }
}

function MarvelList({marvelName}) {
  const {data, status, error} = useFetchData(marvelName, fetchMarvelsList)
  if (status === 'fail') {
    throw error
  } else if (status === 'idle') return 'Entrez un nom de personnage Marvel'
  else if (status === 'fetching') return 'Chargement en cours'
  else if (status === 'done') {
    return data.map(marvel => (
      <>
        <hr style={{background: 'grey'}} />
        <MarvelPersoView marvel={marvel} />
      </>
    ))
  }
}

function App() {
  const [marvelName, setMarvelName] = React.useState('')
  const [searchList, setSearchList] = React.useState(false)
  const handleSearch = name => {
    setMarvelName(name)
  }
  return (
    <div className="marvel-app">
      <label>
        <input type="checkbox" onChange={() => setSearchList(!searchList)} />
        Afficher une list de personnages ?
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
