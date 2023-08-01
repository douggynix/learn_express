const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

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
        response.json(notes)
})

app.get('/api/notes/:id',(request, response) =>  {
    const id = Number(request.params.id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    console.log('Search Result: ',note)
    if(note){
        response.json(note)
    }
    else{
        response.status(404).send("Not Found")
    }
}
)

const generateId = () => {

    console.log("notes.map(n => n.id) : ",notes.map(n => n.id))
    console.log("...notes.map(n => n.id) : ",...notes.map(n => n.id))
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }


app.post('/api/notes', (request,response) =>{
    const note = request.body
    console.log(note)
    const newNote = {
        id: generateId(),
        content: note.content,
        important: note.important || false,
    }
    notes=notes.concat(newNote)
    response.json(newNote);
}
)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


