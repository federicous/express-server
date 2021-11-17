let Contenedor=require('./manejadorDocumentos')
let express = require('express')

let misProductos = new Contenedor('./productos.txt')

function getRandom(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
 }


let app = express()

const PORT = 8080

app.get('/', (req, res) => {
	res.send({ mensaje: 'hola universo' })
     })

app.get('/productos', async (req, res) => {
   let resultado=await misProductos.getAll();
   res.json(resultado)
})

app.get('/productoRandom', async (req, res) => {
   let total= await misProductos.getAll();
   let randomNum=getRandom(0,total.length);
   let resultado= total[randomNum]
   res.json(resultado)
})



app.listen(PORT, () => {
   console.log(`Servidor http escuchando en http://localhost:${PORT}`)
})



/* const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`)) */