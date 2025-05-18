const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const { request } = require('express')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('bodyreq', request => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyreq'))
let persons = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
        id: "4",
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const curT = new Date().toString()
    const persN = persons.length
    const info = `
    <p>Phonebook has info for ${persN} people</p>
    <p>${curT}</p>`
    response.send(info)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
const id = request.params.id
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = String(Math.floor(Math.random() * 1000000) + 1)
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const checkname = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())
    if (checkname){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const personN = {
        id: id,
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(personN)
  
    response.status(201).json(personN)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
