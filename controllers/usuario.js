'use strict'

const { generate } = require('rxjs');
var Usuario = require('../models/usuario'); 
const jwt = require('jsonwebtoken');
const { encrypt, compare } = require('../helpers/handleBcrypt');
const { enviarMail } = require('../helpers/nodeMailer');
const { enviarMailPassword } = require('../helpers/nodeMailer');
const { json } = require('body-parser');
require('dotenv').config();


const getUsuarioValida =  async (req, res) => {         
  
  try {     
    var email = req.params.email;
    const query = { correo: email };
  
    Usuario.findOne(query).exec((err, usuarios) => { 
      if (err){
        res.status(500).send({message: 'Error al devolver el marcador'});
      }else{
            if (!usuarios){
                res.status(404).send({message: 'No hay Usuario'});
            }else{
                res.status(200).send({message: 'Usuario existe'});  
            }        
      }
    });

  }catch(err){   
    return res.status(401).send(err);
  }
}

const getUsuarioPassword =  async (req, res) => {         
  
  try {     
    var email = req.params.email;
    const query = { correo: email };
  
    Usuario.findOne(query).exec((err, usuarios) => { 
      if (err){
        res.status(500).send({message: 'Error al devolver el marcador'});
      }else{
            if (!usuarios){
                res.status(404).send({message: 'No hay Usuario'});
            }else{
                res.status(200).send({usuarioGuardado: usuarios}); 
                const userId = usuarios._id;  
                //console.log('USUARIO ID ' + userId);
                
                enviarMailPassword(process.env.SUJETOPASSWORD,
                           process.env.SERVERAPPPASSWORD+generateAccessToken({userId}),
                           usuarios.correo);
            }        
      }
    });

  }catch(err){   
    return res.status(401).send(err);
  }
}




function getApartamentoValida(req, res){      
 
 
  
  var piso = req.params.piso;
  var apartamento = req.params.apartamento;

  const query = { apartamento: apartamento, piso:piso };

  Usuario.findOne(query).exec((err, usuarios) => { 
    if (err){
      res.status(500).send({message: 'Error al devolver el marcador'});
    }else{
          if (!usuarios){
              res.status(404).send({message: 'Apartamento no registrado'});
          }else{
              res.status(200).send({message: 'Apartamento registrado'});  
          }        
    }
});

}


const getUsuario =  async (req, res) => {  
       
       const { authorization } = req.headers;  
       if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
       try {     
         const jwtData   = await jwt.verify(authorization,process.env.SECRET);        
         const query = { _id: jwtData.userId };
         Usuario.findOne(query).exec((err, usuarios) => { 
          if (err){
            res.status(500).send({message: 'Error al ejecutar la consulta'});
          }else{
                if (!usuarios){
                    res.status(404).send({message: 'Usuario no existe'});
                }else{
                  res.status(200).send({usuarios});  
                }        
          }
        });

       }catch(err){   
         return res.status(401).send({message: 'Authorization No Valido'});
       }
}



const saveUsuario =  async (req, res) => {

  var usuario = new Usuario(); 
  var params = req.body;
  
  usuario.nombre = params.nombre,
  usuario.correo = params.correo,
  usuario.piso = params.piso,
  usuario.apartamento = params.apartamento,
  usuario.estatus = params.estatus,
  usuario.tipo = params.tipo,  
  usuario.password = await  encrypt(params.password)
  
  usuario.save((err, usuarioStored) => {
            if (err){
                res.status(500).send({message: 'Error al guardar el marcador'});
            }else{
                res.status(200).send({usuarioGuardado: usuarioStored});
                const userId = usuarioStored._id;     
                
                enviarMail(process.env.SUJETOREGISTER,
                           //process.env.TEXTREGISTER + process.env.SERVERAPP+usuarioStored._id,
                           //process.env.TEXTREGISTER + process.env.SERVERAPP+ generateAccessToken({userId}),
                           process.env.SERVERAPP+ generateAccessToken({userId}),
                           usuarioStored.correo);
            }
  });

}



function deleteUsuario(req, res){ 

  //validaToken(req, res);

	var usuarioId = req.params.id;

    Usuario.findById(usuarioId, function(err,usuario){

    if (err){

       res.status(500).send({message: 'error al devolver el registro'})
    }

	    if (!usuario){
	       res.status(404).send({message: 'no hay marcador'})
	    }else{
        usuario.remove(err => {
	           if(err){
	             res.status(500).send({message: 'error al borrar'});
	           }else{
	             res.status(200).send({message: 'el registro se ha borrado'});
	           }
	        });

	    }

    });
	}

  
 
  const getUsuarios =  async (req, res) => {
     
      //Validacion token
      const { authorization } = req.headers;  
      if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
      try {     
        const jwtData   = await jwt.verify(authorization,process.env.SECRET);
        console.log(jwtData.userId);
        return res.status(200).send({message: 'Authorization Valido '});   
      }catch(err){   
        return res.status(401).send({message: 'Authorization No Valido'});
      }     
      
}


const updatetUsuarioValida =  async (req, res) => {  
       
  const authorization  = req.params.id; 
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {   
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);        
    const usuarioId = { _id: jwtData.userId  };    
    var update = req.body;  
    
    
    Usuario.findByIdAndUpdate(usuarioId, update, (err, usuarioUpdate) => {
      if(err){
        res.status(401).send({message: 'Error al actualizar el marcador'});
      }else{
        res.status(200).send({usuario: usuarioUpdate});
      }
      
    });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}

const updatetUsuarioPassword =  async (req, res) => {  
       
  const authorization  = req.params.id; 
  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {   
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);        
    const usuarioId = { _id: jwtData.userId  };

    /********ESTA FORMA Y COMO SE HACE EN SAVEUSUARIO PARA EXTRAER LA DATA DEL BODY ************* */
    var update = JSON.stringify(req.body);  //Recibo el objeto JSON y lo convierto a STRING  
    var updateParse = JSON.parse(update); //Parseo el STRING para extraer el valor que necesito  
    var encryptar = await  encrypt(updateParse.password); //Estraigo el password del parse y luego lo encripto 
    var query = {password : encryptar}; //Vuelvo a agregar el password encriptado en formato JSON para actualizarlo    
    
    Usuario.findByIdAndUpdate(usuarioId, query, (err, usuarioUpdate) => {
      if(err){
        res.status(401).send({message: 'Error al actualizar el marcador'});
      }else{
        res.status(200).send({usuario: usuarioUpdate});
      }
      
    });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}







function updateUsuario(req, res){ 

  //validaToken(req, res);

	  var usuarioId = req.params.id;
    var update = req.body;
 
    console.log(update);

    Usuario.findByIdAndUpdate(usuarioId, update, (err, usuarioUpdate) => {
         if(err){
           res.status(200).send({message: 'Error al actualizar el marcador'});
         }else{
           res.status(200).send({usuario: usuarioUpdate});
         }
         
     });	
	}

  

     const authUsuario =  async (req, res) => {      
    
        const {username, password} = req.body;

        const user  = await Usuario.findOne({ correo: username });

        if (!user || user.estatus==0) { //Se validad que el usuario alla validado su correo 
          res.status(404);              //para que tenga el estatus 1 "ACTIVO"
          res.send({error: 'Usuario No Existe o El correo no ha sido validado'});
        }else{
          const checkPassword = await compare(password,user.password);
      
          if (checkPassword){

            const userId = user._id;  
            const tipo = user.tipo; //2 - usuario / 1 - administrador
            const accessToken = generateAccessToken({userId});         

            res.header('authorization',accessToken).json({
              message: 'Usuario Autenticado',
              token: accessToken,
              user: userId,
              tipo: tipo 
            }) 

          }else{
            res.status(404).send({message: 'Password Incorrecto'});
          }  
        }

        
           
}

//Funcion para generar el token
function generateAccessToken(user){   
  return jwt.sign(user,process.env.SECRET, {expiresIn: process.env.MINUTE});
}


//**************ESTA FUNCION SE INTEGRO COMO PRIMERA INSTRUCCION EN CADA UNO DE LOS REQUEST */
  /*const validaToken =  async (authorization) => {
  try {     
    const jwtData  = await jwt.verify(authorization,process.env.SECRET);   
  }catch(err){   
   return 401;
  }
   return;
}*/



module.exports = {	
	getUsuario,
	getUsuarios,
	saveUsuario,
	updateUsuario,
	deleteUsuario,
  authUsuario,
  getUsuarioValida,
  getApartamentoValida,
  updatetUsuarioValida,
  getUsuarioPassword,
  updatetUsuarioPassword
};