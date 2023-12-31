//clase molde
class Producto{
    constructor(id, nombre, precio, categoria, imagen){
        this.id = id ;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria =categoria;
        this.imagen = imagen;
    }
}

class BaseDeDatos {
    constructor() {
        //array para el catalogo de productos
    
        this.productos = [];

       this.cargarRegistros() ;
    
    }

    async cargarRegistros() {
      const resultado = await fetch("./json/productos.json");
      this.productos = await resultado.json();
      cargarProductos(this.productos);
    }


    traerRegistros() {
        return this.productos;
    }



    registroPorId(id){
        return this.productos.find((producto) => producto.id === id);
    }

    registrosPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase())
        );
    }
}

class Carrito{
    constructor(){
      const carritoStorage =JSON.parse( localStorage.getItem("carrito"));
        //array
        this.carrito = carritoStorage || [];  
        this.total = 0;
        this.cantidadProductos = 0; 
    }

    // 
    estaEnCarrito({ id } ){
        return this.carrito.find((producto) => producto.id === id);
    }

    //Agregar al carrito
    agregar(producto){
        const productoEnCarrito = this.estaEnCarrito(producto);
        if (!productoEnCarrito) {
              this.carrito.push({...producto, cantidad: 1 }); 
            
        }else{
          productoEnCarrito.cantidad++;
        }
        // Actualizo el storage 
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();

    }

    //Quitar del carrito
    quitar(id) {
      const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
          } else {
            this.carrito.splice(indice, 1);
          }
          // Actualizo el storage 
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

          this.listar();
    }
        
        

   // listar
  listar() {

    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
  
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h2>${producto.nombre}</h2>
          <p>$${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
        </div>
      `;

      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }
    

    
    const botonesQuitar = document.querySelectorAll(".btnQuitar");


    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        
        const idProducto = Number(boton.dataset.id);
       
        this.quitar(idProducto);
      });
    }
   
    // Actualizo los contadores del HTML
    spancantidadProductos.innerText = this.cantidadProductos;
    spantotalCarrito.innertext = this.total;
    
  }
}
   


 
//instanciamos base de datos
const bd = new BaseDeDatos();

// instanciamos la clase carrito
 const carrito = new Carrito();


//elementos
const spancantidadProductos = document.querySelector("#cantidadProductos")
const spantotalCarrito = document.querySelector("#totalCarrito")
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito"); 


cargarProductos(bd.traerRegistros());


function cargarProductos(productos) {
  // Vacio el div
  divProductos.innerHTML = "";

  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" width="400" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    `;
  }

  // lista dinamica de los botones
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
for (const boton of botonesAgregar){
    boton.addEventListener("click", (event) =>{
        event.preventDefault();
        const idProducto = +boton.dataset.id;
        console.log("id del producto:", idProducto);
        const producto = bd.registroPorId(idProducto);
        //
        carrito.agregar(producto);


    });
}
}