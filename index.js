const Note = require("./model/note")

const process = require("node:process")

const express = require("express")
const app = express()

const cors = require("cors")

app.use(cors())

app.use(express.json())

app.use(express.static("build"))

const errorHandler = (error, request, response, next) => {
  console.error("ErrorHandler: ",error.message)
  
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {    return response.status(400).json({ error: error.message })  }
  
  next(error)
}

app.use(errorHandler)


const requestLogger =(request,response,next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

app.use(requestLogger)


app.get("/api/notes",(request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })       
})

app.get("/api/notes/:id",(request, response) =>  {
  Note.findById(request.params.id).then( note => {
    response.json(note)
  })
})


app.post("/api/notes", (request,response) =>{
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


app.put("/api/notes/:id", (request,response,next) =>{
  const {content,important} = request.body

  console.log("update note with id",request.params.id, " and body", request.body)
  Note.findByIdAndUpdate(
    request.params.id,
    {content,important},
    {new: true, runValidators: true, context: "query"}
  ).then(updatedNote =>{
    response.json(updatedNote)
  })
    .catch(error => {
      console.log("Failed Updating :",request.params.id,error)
      next(error)
    })
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


