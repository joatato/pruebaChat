// console.log("hola");
// let nombre=prompt("Ingrese su nombre:");
let nombre='';

Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(resultado=>{
    nombre=resultado.value;

    let divMensajes=document.querySelector('#mensajes');
    let textMensaje=document.querySelector('#mensaje');
    
    textMensaje.focus();
    
    
    textMensaje.addEventListener('keyup',(evento)=>{
        // console.log(evento.key, evento.keyCode, evento.target.value);
        if(evento.keyCode==13){
            if(evento.target.value.trim()!=''){
                socket.emit('mensaje',{
                    emisor:nombre,
                    mensaje:evento.target.value
                })
                textMensaje.value='';
                textMensaje.focus();
            }
    
        }
    })
    
    socket=io();
    
    socket.on('hola',(objeto)=>{
        console.log(`${objeto.emisor} dice ${objeto.mensaje}`)
    
        objeto.mensajes.forEach(el=>{
            divMensajes.innerHTML+=`<br><div class='mensaje'><strong>${el.emisor}</strong> dice <i>${el.mensaje}</i></div>`
        });
    
        divMensajes.scrollTop=divMensajes.scrollHeight;

        socket.emit('respuestaAlSaludo',{
            emisor:nombre,
            mensaje:`Hola, desde el Frontend`
        })
    })
    
    socket.on('nuevoUsuario',(usuario)=>{
        Swal.fire({
            text:`${usuario} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
        
    })


    socket.on('nuevoMensaje',(mensaje)=>{
        divMensajes.innerHTML+=`<br><div class='mensaje'><strong>${mensaje.emisor}</strong> dice <i>${mensaje.mensaje}</i></div>`
    
        divMensajes.scrollTop=divMensajes.scrollHeight;
    
    })
    
    
    socket.on('nuevoHeroe',(objeto)=>{
        divMensajes.innerHTML+=`<br>Se ha creado el heroe<strong> ${objeto.heroe.nombre}</strong>`
    })

});

