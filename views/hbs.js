let Contenedor=require('../public/manejadorDocumentos')
let express = require('express')
let app = express()
const PORT = 8088
const { Router } = express
const router = Router()

// carga del modulo Handlebars
const handlebars = require("express-handlebars")

// configuracion de handlebars
app.engine(
   "handlebars",
   handlebars.engine()
);

app.set("view engine", "handlebars");
app.set("views","./views")


let misProductos = new Contenedor('./public/productos.txt')

function getRandom(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
 }


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static("./public"));

/* 
app.get('/', (req, res) => {
	// res.send({ mensaje: 'hola universo' })
   // res.send("index", {});
   res.sendFile(__dirname + '/public/index.html');
     })
 */

     app.get('/', async (req, res) => {
      // res.send({ mensaje: 'hola universo' })
      // res.send("index", {});
      let total= await misProductos.getAll();
      res.render('home',{productList: total, listExist: total.length});
        })

app.post('/uploadproduct', async function (req, res) {
      console.log("post recibido");

      const newProduct = {
         name: req.body.name,
         price: req.body.price,
         image: req.body.image
      };
      console.log(newProduct);
      res.status(201).json(newProduct)
      await misProductos.save(newProduct)
      await misProductos.getAll();

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

router.get('/productos', async (req, res, next) => {
   let resultado= await misProductos.getAll();
   res.json(resultado)
})

router.get('/productos/:id', async (req, res) => {
   console.log(req.params.id);
   let resultado= await misProductos.getById(parseInt(req.params.id))
   console.log(resultado);
      res.json(resultado)
})

router.post('/productos', async (req, res, next) => {
   console.log(req.body)
   let resultado= await misProductos.save(req.body)

   let resultado2= await misProductos.getAll();
   res.json(resultado2)
})

router.put('/productos/:id', async (req, res, next) => {
   await misProductos.deleteById(req.params.id);
   await misProductos.save(req.body, req.params.id)
   res.json({
      result:'ok',
      id: req.params.id,
      new: req.body
   })
})

router.delete('/productos/:id', async (req, res, next) => {
   console.log(req.params.id);
   await misProductos.deleteById(req.params.id);
   res.json({
      result:'ok',
      id: req.params.id      
   })
})



app.use('/api', router)

app.listen(PORT, () => {
   console.log(`Servidor http escuchando en http://localhost:${PORT}`)
})



/* const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`)) */