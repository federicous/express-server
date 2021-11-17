const fs = require('fs')

class Contenedor {

	constructor(url) {
		this.url = url;
		this.contador=1;
	}

	async leerProductos(){
		try {
			const contenido = await fs.promises.readFile(this.url, 'utf-8') 
			// console.log(contenido);
			return contenido

		} catch (error) {
			throw new Error(error)
		}
		
	}
	

	async save(producto) {
		try {
		
			let lectura=await this.leerProductos() ? await this.leerProductos() : []
			let infoArray=lectura.length ? JSON.parse(lectura) : [];

			// let cantidad= infoArray.length
			// producto.id=cantidad+1
			producto.id=this.contador
			this.contador=this.contador+1
			// console.log(`este es el contador: ${this.contador}`);
			infoArray.push(producto)

			let actualizado=JSON.stringify(infoArray, null, 2)

			await fs.promises.writeFile(this.url, `${actualizado}`)

			return this.contador-1

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async getById(id) {
		try {
			let lectura=await this.leerProductos() ? await this.leerProductos() : []
			let infoArray=lectura.length ? JSON.parse(lectura) : [];
			let aux= infoArray
			let indice=aux.findIndex(product=>product.id===id)
			return infoArray[indice]


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let lectura=await this.leerProductos() ? await this.leerProductos() : []
			let infoArray=lectura.length ? JSON.parse(lectura) : [];

			return infoArray


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
		
	}

	async deleteById(id) {
		try {
			let lectura=await this.leerProductos() ? await this.leerProductos() : []
			let infoArray=lectura.length ? JSON.parse(lectura) : [];
			let aux= infoArray
			let indice=aux.findIndex(product=>product.id===id)
			aux.splice(indice,1)
			infoArray=[...aux]
			console.log(infoArray);	

			let actualizado=JSON.stringify(infoArray, null, 2)

			await fs.promises.writeFile(this.url, `${actualizado}`)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await fs.promises.writeFile(this.url,[])

		} catch (error) {
			throw new Error(error)
		}


	}
}



module.exports= Contenedor;














