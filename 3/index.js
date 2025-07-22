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

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const curT = new Date().toString()
    Person.find({}).then(result => {
      const info = `
       <p>Phonebook has info for ${result.length} people</p>
       <p>${curT}</p>`
       response.send(info)
    }).catch(error => next(error))
   
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))

})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(uPerson => {
    response.json(uPerson)
  }).catch(error => next(error))
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name == 'CastError'){
      return response.status(400).send({ error: 'invalid id'})
  }
    next(error)
  }
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
