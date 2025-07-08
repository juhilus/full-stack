require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const { request } = require('express')
const Person = require('./person')


app.use(express.json())
app.use(express.static('build'))
app.use(express.static('dist'))
morgan.token('bodyreq', request => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyreq'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
    const curT = new Date().toString()
    const persN = Persons.length
    const info = `
    <p>Phonebook has info for ${persN} people</p>
    <p>${curT}</p>`
    response.send(info)
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
  })

app.delete('/api/persons/:id', (request, response) => {
const id = request.params.id
persons = Persons.filter(person => person.id !== id)

response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    //const id = String(Math.floor(Math.random() * 1000000) + 1)
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }else{
      const person = new Person ({
        //id: id,
        name: body.name,
        number: body.number,
      })
  
    person.save().then(person => {
      response.json(person)
    })
    }

  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
