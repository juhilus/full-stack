import { useState } from 'react'

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

const Persons = ({showPers}) => {
  return (
    <div>
      {showPers.map(person => (
        <p key={person.name}>{person.name} {person.number}</p>
      ))}
    </div>

  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '050-050050'},
    {name: 'testi Mctestington', number: '050-050051'},
    {name: 'Puhelin Myyjä', number: '050-050052'},
    {name: 'Mikan Sukset', number: '050-050053'},
    {name: 'Mikon Kaakelit', number: '050-050054'}
   
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    const duplicate = persons.some(person =>
      person.name.toLowerCase() === newName.trim().toLowerCase())
    if (duplicate) {
      window.alert(`${newName.trim()} is already added to the phonebook`)
    } else if (newName.trim() !== '') {
      const newPerson = {
        name: newName.trim(),
        number: newNumber.trim()
      }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
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
  const showPers = filter.trim() === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.trim().toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
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
      />
    </div>
  )

}

export default App