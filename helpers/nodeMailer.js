const nodemailer = require('nodemailer')

require('dotenv').config();

enviarMail = async (sujeto, texto, mailTo) => {

    //enlaceApp = texto;
    //const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';

    //console.log(p.replace('dog', 'monkey'));

    const config = {
          host: process.env.host,
          port: process.env.port,
          auth:{
              user: process.env.user,
              pass: process.env.password
          }

    }

   const mensaje = {
         from: process.env.user,
         to: mailTo,
         subject: sujeto,         
         html: process.env.html.replace('ENLACEAPP',texto)
   }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    //console.log(info);

}

enviarMailPassword = async (sujeto, texto, mailTo) => {

   
    const config = {
          host: process.env.host,
          port: process.env.port,
          auth:{
              user: process.env.user,
              pass: process.env.password
          }

    }

   const mensaje = {
         from: process.env.user,
         to: mailTo,
         subject: sujeto,         
         html: process.env.HTMLPASSWORD.replace('ENLACEAPP',texto)
   }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    //console.log(info);

}

enviarMailPago = async (sujeto, texto, mailTo, titulo) => {

   //Pago Registrado Satisfactoriamente
    const config = {
          host: process.env.host,
          port: process.env.port,
          auth:{
              user: process.env.user,
              pass: process.env.password
          }

    }

   const mensaje = {
         from: process.env.user,
         to: mailTo,
         subject: sujeto,         
         html: process.env.HTMLPAGO.replace('ENLACEPAGO',texto).replace('#TITULOPAGO',titulo)
   }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    

}

module.exports = {enviarMail,enviarMailPassword,enviarMailPago}