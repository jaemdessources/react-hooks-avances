/* NE PAS MODIFIER CE FICHIER  */
/* eslint-disable no-unused-vars */
import * as React from 'react'

// GET FREE KEY https://developer.marvel.com/account
// add localhost to referrers
// clef limité à 3000 appels par jour

// const marvelApiKey = '6bcc5c7ff0ad488fb58f759c4069964c'
const marvelApiKey = '5a4bd353e754599ed13518c2f87509df'

const myHeader = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
})
const init = {
  method: 'GET',
  headers: myHeader,
  mode: 'cors',
}

const fetchMarvel = name => {
  const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${marvelApiKey}&nameStartsWith=${name}`
  return fetch(url, init)
    .then(response => response.json())
    .then(json => {
      if (json.data.results.length > 0) {
        return json.data.results[0]
      } else {
        return Promise.reject(
          new Error(`Aucun Marvel trouvé avec le nom "${name}"`),
        )
      } // ERROR DU JSON()
    })
    .catch(error => {
      return Promise.reject(
        new Error(`Aucun Marvel trouvé avec le nom "${name}"`),
      )
    }) // ERROR APPEL API
}

const fetchMarvelById = id => {
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${marvelApiKey}`
  return fetch(url, init)
    .then(response => response.json())
    .then(json => {
      if (json.data.results.length > 0) {
        return json.data.results[0]
      } else {
        return Promise.reject(
          new Error(`Aucun Marvel trouvé avec l'id "${id}"`),
        )
      } // ERROR DU JSON()
    })
    .catch(error => {
      return Promise.reject(new Error(`Aucun Marvel trouvé avec l'id "${id}"`))
    }) // ERROR APPEL API
}

const fetchMarvelsList = name => {
  const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${marvelApiKey}&nameStartsWith=${name}`
  return fetch(url, init)
    .then(response => response.json())
    .then(json => {
      if (json.data.results.length > 0) {
        return json.data.results
      } else {
        return Promise.reject(
          new Error(`Aucun Marvel trouvé avec le nom "${name}"`),
        )
      } // ERROR DU JSON()
    })
    .catch(error => {
      return Promise.reject(
        new Error(`Aucun Marvel trouvé avec le nom "${name}"`),
      )
    }) // ERROR APPEL API
}

function MarvelPersoView({marvel}) {
  return (
    <div>
      <div className="marvel-img">
        <img
          height="400"
          src={marvel.thumbnail.path + '.' + marvel.thumbnail.extension}
          alt={marvel.name}
        />
      </div>
      <div className="marvel-name">
        <h1>
          {marvel.name}
          <sup>{marvel.number}</sup>
        </h1>
      </div>
      <div className="marvel-wrapper">
        <h3>Apparait dans</h3>
        <ul>
          {marvel.series.items.map((serie, idx) => (
            <li key={idx}>
              <label>{serie.name}</label>:{' '}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MarvelSearchForm({onSearch, marvelName}) {
  const [name, setName] = React.useState(marvelName)
  return (
    <div className="component-header">
      <div>
        Recherche Marvel (<span onClick={e => setName('x-men')}>x-men</span>,{' '}
        <span onClick={e => setName('spider-man')}>spider-man</span> ...)
      </div>
      <div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="button"
          onClick={() => onSearch(name)}
          value={'rechercher'}
        />
      </div>
    </div>
  )
}

function ErrorDisplay({error}) {
  return (
    <div style={{color: 'red'}}>
      Une erreur est survenue lors de la recherche de Marvel detail :
      <pre style={{color: 'grey'}}> Détail : {error.message}</pre>
    </div>
  )
}

export {
  MarvelPersoView,
  MarvelSearchForm,
  fetchMarvel,
  ErrorDisplay,
  fetchMarvelById,
  fetchMarvelsList,
}
