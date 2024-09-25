import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(
    {
      data: null,
      error: null,
      state: "initial"
    }
  )

  useEffect(() => {
    if (name) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`).then(res => {
          setCountry({ data: res.data, error: null, state: 'found' })
        })
        .catch(error => {
          setCountry({ data: null, error, state: 'not_found' })
        })
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (country.state === 'initial') {
    return null
  }

  if (country.state === 'not_found') {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.svg} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button type='submit'>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App