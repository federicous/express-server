// const http = require('http')

// const server = http.createServer((peticion, respuesta) => {
// 	respuesta.end('Hola mundo')
// })

// const connectedServer = server.listen(8080, () => {
// 	console.log(`Servidor Http escuchando en el puerto ${connectedServer.address().port}`)
//      })
     
const express = require('express')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
	res.send({ mensaje: 'hola mundo' })
     })

app.get('/productos', (req, res) => {
	res.send({ mensaje: 'hola mundo' })
     })

app.get('/productoRandom', (req, res) => {
   res.send({ mensaje: 'hola mundo' })
})
