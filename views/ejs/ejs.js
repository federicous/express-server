let Contenedor=require('../../public/manejadorDocumentos')
let express = require('express')
let app = express()
const PORT = 8088
const { Router } = express
const router = Router()
const routerProd = Router()
const routerCart = Router()

// carga del modulo EJS
const ejs= require("ejs")

app.set("view engine", "ejs");

let misProductos = new Contenedor('./public/productos.txt')
let misCarritos = new Contenedor('./public/carritos.txt')


let acceso = {
   isAdmin : function (req, res, next) {
      // console.log(JSON.stringify(req.headers));
      // return next();
         if (req.headers.admin=="true") {
            return next();
         }else{
            res.json({ error : -1, descripcion: "ruta 'x' método 'y' no autorizada" })
            res.redirect('/');
         }
      
   }
};

function getRandom(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
 }


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static("./public"));

app.get('/', async (req, res) => {
   let total= await misProductos.getAll();
   res.render('ejs/pages',{productList: total, listExist: total.length, productTable: false});
   // res.render('ejs/pages',{mensaje: 'usando pug'})
   })

app.post('/uploadproduct', async function (req, res) {
      console.log("post recibido");

      const newProduct = {
         name: req.body.name,
         price: req.body.price,
         image: req.body.image
      };
      console.log(newProduct);
      // res.status(201).json(newProduct)
      await misProductos.save(newProduct)
      await misProductos.getAll();
      res.redirect("/");
   })
   

app.get('/productos', async (req, res) => {
   let total=await misProductos.getAll();
   // res.json(resultado)
   res.render('ejs/pages',{productList: total, listExist: total.length, productTable: true});
})

app.get('/productoRandom', async (req, res) => {
   let total= await misProductos.getAll();
   let randomNum=getRandom(0,total.length);
   let resultado= total[randomNum]
   res.json(resultado)
})

/* ############################## Product ###################################### */
// ----------- GET ---------------
routerProd.get('/', acceso.isAdmin, async (req, res, next) => {
   let total= await misProductos.getAll();
   res.json(total)
})
// ----------- GET ID---------------
routerProd.get('/:id', async (req, res) => {
   console.log(req.params.id);
   let resultado= await misProductos.getById(parseInt(req.params.id))
   console.log(resultado);
      res.json(resultado)
})
// ----------- POST ---------------
routerProd.post('/', acceso.isAdmin, async (req, res, next) => {
   console.log(req.body)
   let resultado= await misProductos.save(req.body)

   let total= await misProductos.getAll();
   res.json(total)
})
// ----------- PUT ---------------
routerProd.put('/:id', async (req, res, next) => {
   await misProductos.deleteById(req.params.id);
   await misProductos.save(req.body, req.params.id)
   res.json({
      result:'ok',
      id: req.params.id,
      new: req.body
   })
})
// ----------- DELETE ---------------
routerProd.delete('/:id', async (req, res, next) => {
   console.log(req.params.id);
   await misProductos.deleteById(req.params.id);
   res.json({
      result:'ok',
      id: req.params.id      
   })
})
/* ############################## Fin Product ###################################### */

/* ############################## Cart ###################################### */
// ----------- GET ---------------
routerCart.get('/', async (req, res, next) => {
   let total= await misCarritos.getAll();
   res.json(total)
})
// ----------- GET ID ---------------
routerCart.get('/:id', async (req, res) => {
   console.log(req.params.id);
   let resultado= await misCarritos.getById(parseInt(req.params.id))
   console.log(resultado);
      res.json(resultado)
})
// ----------- POST ---------------
routerCart.post('/', async (req, res, next) => {
   console.log(req.body)
   let cartToSave= {
      cartList: req.body
   }
   let resultado= await misCarritos.save(cartToSave)

   let total= await misCarritos.getAll();
   res.json({id: total[total.length - 1].id})
   console.log(`Id del pedido: ${total[total.length - 1].id}`);
})
// ----------- POST Producto---------------
routerCart.post('/:id/product', async (req, res, next) => {
   let cart= await misCarritos.getById(parseInt(req.params.id))


   console.log(req.body)
   let resultado= await misCarritos.save(req.body)

   let total= await misCarritos.getAll();
   res.json({id: total[total.length - 1].id})
   console.log(`Id del pedido: ${total[total.length - 1].id}`);
})
// ----------- PUT ---------------
routerCart.put('/:id', async (req, res, next) => {
   await misCarritos.deleteById(req.params.id);
   await misCarritos.save(req.body, req.params.id)
   res.json({
      result:'ok',
      id: req.params.id,
      new: req.body
   })
})
// ----------- DELETE Cart---------------
routerCart.delete('/:id', async (req, res, next) => {
   console.log(req.params.id);
   await misCarritos.deleteById(req.params.id);
   res.json({
      result:'ok',
      id: req.params.id      
   })
})
// ----------- DELETE Product from Cart---------------
routerCart.delete('/:id/product/:id_prod', async (req, res, next) => {
   // console.log(`id cart: ${req.params.id}`);
   // console.log(`id producto: ${req.params.id_prod}`);
   let cart= await misCarritos.getById(parseInt(req.params.id))
   // console.log(`cart a modificar: ${JSON.stringify(cart)}`);
   let aux=cart
   // console.log(`aux.cartList: ${JSON.stringify(aux.cartList)}`);
   // console.log(`aux.cartList[${req.params.id_prod}]: ${JSON.stringify(aux.cartList[req.params.id_prod])}`);
   let indice=aux.cartList.findIndex(product=>product.id===parseInt(req.params.id_prod))
   // console.log(`indice borrar: ${indice}`);

   aux.cartList.splice(indice,1)
   // console.log(`nuevo carrito : ${JSON.stringify(aux)}`);
   // borro el carrito original
   await misCarritos.deleteById(req.params.id);
   // guardo el carrito modificado
   await misCarritos.save(aux, req.params.id)

   res.json({
      result:'ok',
      id: req.params.id      
   })
})
/* ############################## Fin Cart ###################################### */

app.use('/api', router)
app.use('/api/product', routerProd)
app.use('/api/cart', routerCart)

app.listen(PORT, () => {
   console.log(`Servidor http escuchando en http://localhost:${PORT}`)
})
