// useContext
// 🚀 Mettre en cache avec l'API context
// http://localhost:3000/alone/final/06.bonus-3.js

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

const MarvelCacheContext = React.createContext()

function marvelCacheReducer(state, action) {
  switch (action.type) {
    case 'ADD_MARVEL': {
      return {...state, [action.marvelName]: action.marvelData}
    }
    case 'ADD_MARVEL_LIST': {
      return {...state, [`${action.marvelName}-list`]: action.marvelData}
    }
    default: {
      throw new Error(`action impossible: ${action.type}`)
    }
  }
}

function MarvelCacheProvider(props) {
  const [cache, dispatch] = React.useReducer(marvelCacheReducer, {})
  return <MarvelCacheContext.Provider value={[cache, dispatch]} {...props} />
}

function useMarvelCache() {
  const context = React.useContext(MarvelCacheContext)
  if (!context) {
    throw new Error('useMarvelCache doit être utilisé avec MarvelCacheProvider')
  }
  return context
}

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
  const {data, error, status} = state

  const execute = React.useCallback(promise => {
    dispatch({type: 'fetching'})
    promise
      .then(marvel => dispatch({type: 'done', payload: marvel}))
      .catch(error => dispatch({type: 'fail', error}))
  }, [])

  const setData = React.useCallback(
    data => dispatch({type: 'done', payload: data}),
    [dispatch],
  )

  return {data, error, status, execute, setData}
}

function useFindMarvelByName(marvelName) {
  const [cache, dispatch] = useMarvelCache()

  const {data, error, status, execute, setData} = useFetchData()
  React.useEffect(() => {
    if (!marvelName) {
      return
    } else if (cache[marvelName]) {
      setData(cache[marvelName])
    } else {
      execute(
        fetchMarvel(marvelName).then(marvelData => {
          dispatch({type: 'ADD_MARVEL', marvelName, marvelData})
          return marvelData
        }),
      )
    }
  }, [marvelName, execute, cache, setData, dispatch])
  return {data, error, status}
}

function useFindMarvelList(marvelName) {
  const [cache, dispatch] = useMarvelCache()

  const {data, error, status, execute, setData} = useFetchData()
  React.useEffect(() => {
    if (!marvelName) {
      return
    } else if (cache[`${marvelName}-list`]) {
      setData(cache[`${marvelName}-list`])
    } else {
      execute(
        fetchMarvelsList(marvelName).then(marvelData => {
          dispatch({type: 'ADD_MARVEL_LIST', marvelName, marvelData})
          return marvelData
        }),
      )
    }
  }, [marvelName, execute, cache, setData, dispatch])
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
      <MarvelCacheProvider>
        <div className="marvel-detail">
          <ErrorBoundary key={marvelName} FallbackComponent={ErrorDisplay}>
            {searchList ? (
              <MarvelList marvelName={marvelName} />
            ) : (
              <Marvel marvelName={marvelName} />
            )}
          </ErrorBoundary>
        </div>
      </MarvelCacheProvider>
    </div>
  )
}

export default App
