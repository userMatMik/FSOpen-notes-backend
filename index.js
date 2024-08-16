require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note.js')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// const mongoose = require('mongoose')
// const password = process.argv[2]


// mongoose.set('strictQuery',false)
// // mongoose.connect(url)

// mongoose
//   .connect(url)
//   .then(() => {
//     console.log('connected to db');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//       }
// })

// const Note = mongoose.model('Note', noteSchema)
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

let notes = [];

// const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => Number(n.id)))
//       : 0
//     return String(maxId + 1)
// }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
    // const id = request.params.id
    // const note = notes.find(note => note.id === id)
    // if(note) {
    //     response.json(note)
    // } else {
    //     response.status(404).end();
    // }
})
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
})

app.post('/api/notes', (request, response) => {
    
  // const note = {
    //     content: body.content,
    //     important: Boolean(body.important) || false,
    //     id: generateId(),
    // }
    
    // if(!body.content) {
      //     return response.status(400).json({
        //         error: 'content missing'
        //     })
        // }
        
        //  notes = [...notes, note]
        //  response.json(note)
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })

})

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (body.content === undefined) {
//     return response.status(400).json({ error: 'content missing' })
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note.save().then(savedNote => {
//     console.log('savedNote posted')
//     response.json(savedNote)
//   })
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})