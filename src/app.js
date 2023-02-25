const path=require('path');
const express=require('express');
const engine=require('express-handlebars').engine
const Server=require('socket.io').Server;

const PORT=3000;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'./views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'./public')));

// app.get('/',(req,res)=>{
//     res.setHeader('Content-Type','text/plain');
//     res.status(200).send('OK');
// })

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home',{
        estilos:'styles.css'
    });
})

const heroes=[]
app.post('/heroes',(req,res)=>{
    let heroe=req.body;
    if(!heroe.nombre){
        return res.status(404).json({
            message:'ingrese al menos el nombre en el body'
        })
    }

    heroes.push(heroe);
    serverSockets.emit('nuevoHeroe',{
        emisor:'Server',
        heroe
    })

    res.status(201).json({
        heroes
    })

})

const serverHttp=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const mensajes=[];

const serverSockets=new Server(serverHttp);

serverSockets.on('connection',(socket)=>{
    // console.log(socket.handshake);
    console.log(`Se han conectado, socket id ${socket.id}`)

    socket.emit('hola',{
        emisor:'Servidor',
        mensaje:`Hola, desde el server...!!!`,
        mensajes
    })

    socket.on('respuestaAlSaludo',(mensaje)=>{
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

        socket.broadcast.emit('nuevoUsuario',mensaje.emisor)
    })

    socket.on('mensaje',(mensaje)=>{
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

        // todo el codigo que quiera...
        mensajes.push(mensaje);
        console.log(mensajes);

        // socket.broadcast.emit('nuevoMensaje',mensaje)
        serverSockets.emit('nuevoMensaje',mensaje)

    })


}) // fin de server.on connection


serverHttp.on('error',(error)=>console.log(error));