import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({message,type}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
}
const Filter = ({filter, handleFilterChange}) => {
  return (
      <div>
        filter shown with:
        <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
  )
}
const PersForm = ({newName,newNumber,handleNameChange,handleNumberChange,addPerson}) => {
  return (
  <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({showPers, handleDelete}) => {
  return (
    <div>
      {showPers.map(person => (
        <p key={person.id}>{person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button></p>
      ))}
    </div>

  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initPers => {
        setPersons(initPers)
      })
      .catch(error => {
        //console.error("fetching error")
        console.log(error.response.data)
      })
  },[])

  const addPerson = (event) => {
    event.preventDefault()

    const duplicate = persons.find(person =>
      person.name.toLowerCase() === newName.trim().toLowerCase())
    if (duplicate) {
      if(window.confirm(`${newName.trim()} is already added to the phonebook, replace the old number with new one?`)){
        const updatedPers = {...duplicate,number: newNumber.trim()}
        personService
          .update(duplicate.id, updatedPers)
          .then(returnedPers => {
            setPersons(persons.map(person =>
              person.id === duplicate.id ? returnedPers : person
            ))
            setNewName('')
            setNewNumber('')
            setNotification({message: `Updated ${newName.trim()}'s number`, type: 'success'})
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            console.error('update err:', error)
            if (error.response && error.response.status === 404) {
              setNotification({ 
                message: `Information of ${newName.trim()} has already been removed from server`, 
                type: 'error' 
              })
              setPersons(persons.filter(person => person.id !== duplicate.id))
            } else {
              setNotification({ message: `Failed to update ${newName.trim()}'s number`, type: 'error' })
            }
            setTimeout(() => setNotification(null), 5000)
          })
      }
    } else {
      const newPerson = {
        name: newName.trim(),
        number: newNumber.trim()
      }
    personService
      .create(newPerson)
      .then(returnPers => {
        setPersons(persons.concat(returnPers))
        setNewName('')
        setNewNumber('')
        setNotification({message: `Updated ${newName.trim()}'s number`, type: 'success'})
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        console.error('Add error:', error)
        window.alert('Add failed')
      })
  }
}
  const handleNameChange = (event) => {
    setNewName(event.target.value) 
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({message: `Deleted ${name} from phonebook`, type: 'success'})
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          console.error('del err:', error)
          window.alert("failed del")
        })
    }
  }
  const showPers = filter.trim() === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.trim().toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>
      <PersForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons
        showPers={showPers}
        handleDelete={handleDelete}
      />
    </div>
  )

}

export default App