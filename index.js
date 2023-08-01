const Note = require('./model/note')

const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

const requestLogger =(request,response,next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/api/notes',(request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
      })       
})

app.get('/api/notes/:id',(request, response) =>  {
    Note.findById(request.params.id).then( note => {
        response.json(note)
    })
})

const generateId = () => {

    console.log("notes.map(n => n.id) : ",notes.map(n => n.id))
    console.log("...notes.map(n => n.id) : ",...notes.map(n => n.id))
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }


app.post('/api/notes', (request,response) =>{
    const body = request.body
    console.log(body)
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save().then(savedNote =>{
        response.json(savedNote)
    })  
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


