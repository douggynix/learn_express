const mongoose = require("mongoose")

if (process.argv.length<4) {
  console.log("give user and password as argument")
  process.exit(1)
}

const user = process.argv[2]
const password = process.argv[3]

const url =
  `mongodb+srv://${user}:${password}@cluster0.knl5djk.mongodb.net/testDoug?retryWrites=true&w=majority`

mongoose.set("strictQuery",false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

const note = new Note({
  content: "Java is Easy",
  important: true,
})

note.save().then(() => {
  console.log("note saved!")
  mongoose.connection.close()
})  

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})