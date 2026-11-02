const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json({ type: ['application/json', 'text/plain']}))
app.use(cors())
app.set('json spaces', 2)

app.use(express.static(path.join(__dirname, '../frontend/dist')))

let names = [
    {id:1, name:"Huzaifa"},
    {id:2, name:"Talha"},
    {id:4, name:"Ali"}
]

function validateName(body) {
    if(!body.name || body.name.length < 3) {
    return "Error:400 Bad Request!\nEnter a valid name above 3 characters"
    }
    return null
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.post('/api/names', (req, res) => {

    const error = validateName(req.body)
    if (error) return res.status(400).send(error)

    const name = {
        id: names.length + 1,
        name: req.body.name
    }

    names.push(name)
    res.send(name)
    
    return
})

app.get('/api/names', (req, res) => {
    res.send(names)
})

app.put('/api/names/:id', (req, res) => {
    const error = validateName(req.body)
    const name = names.find(c => c.id === parseInt(req.params.id))

    if (!name) return res.status(404).send('The Name with the given ID was not found.')
    if (error) return res.status(400).send(error)

    name.name = req.body.name
    res.send(name)

})

app.get('/api/names/:id', (req, res) => {
    const name = names.find(c => c.id === parseInt(req.params.id))

    if (!name) return res.status(404).send('The Name with the given ID was not found.')
        res.send(name)
})

app.delete('/api/names/:id', (req, res) => {
    const name = names.find(c => c.id === parseInt(req.params.id))

    if (!name) return res.status(404).send('The Name with the given ID was not found.')
    
    const index = names.indexOf(name)
    names.splice(index, 1)

    res.send(name)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port} ... `))
