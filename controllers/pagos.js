'use strict'

const XLSX = require('xlsx');
const jwt = require('jsonwebtoken');
var Pagos = require('../models/pagos');
var Usuario = require('../models/usuario');
var Parametros = require('../models/parametros');
var Cuentas = require('../models/condominio');
const { enviarMailPago } = require('../helpers/nodeMailer');

require('dotenv').config();

const savePago =  async (req, res) => {

    const { authorization } = req.headers;  
    if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
    try {
        const jwtData   = await jwt.verify(authorization,process.env.SECRET); 

        var pago = new Pagos(); 
        var params = req.body;
        
        pago.fecha = params.fecha
        pago.monto =params.monto,
        pago.banco = params.banco,
        pago.referencia = params.referencia
        pago.idUsuario = params.idUsuario,
        pago.estatus = params.estatus  
    
        //Valido que exista el usuario
        Usuario.findById(pago.idUsuario).exec((err, usuarios) => { 
            if (err){
              res.status(500).send({message: 'Usuario no Existe'});
            }else{                 
                    //Guardo el 
                    pago.save((err, pagoStored) => {
                        if (err){
                            res.status(500).send({message: 'Error al guardar el marcador'});
                        }else{
                            res.status(200).send({pagoGuardado: pagoStored});
                            const userId = pagoStored._id; 

                            enviarMailPago(process.env.SUJETOPAGO,
                            pago.referencia,
                            usuarios.correo,'Registrado');

                        }
                    });  
            }
        });
  
  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
  
  }


  const getPagos =  async (req, res) => {  
       
    const { authorization } = req.headers;  
    if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
    try {     
      const jwtData   = await jwt.verify(authorization,process.env.SECRET);       
      var pagoIdUser = req.params.id;
      const query = { idUsuario: pagoIdUser };
       Pagos.find(query).sort({ fecha : -1  }).limit(12).exec((err, pagos) => {         
       if (err){
         res.status(500).send({message: 'Error al ejecutar la consulta'});
       }else{
             if (!pagos){
                 res.status(404).send({message: 'Pago no existe'});
             }else{
              
               res.status(200).send({pagos});  
             }        
       }
       
     });

    }catch(err){   
      return res.status(401).send({message: 'Authorization No Valido'});
    }
}


const getBancos =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);       
    
    const query = { "nemonico": /.*BANCO_*/ };
    Parametros.find(query).exec((err, bancos) => {         
     if (err){
       res.status(500).send({message: 'Error al ejecutar la consulta'});
     }else{
           if (!bancos){
               res.status(404).send({message: 'Pago no existe'});
           }else{              
             res.status(200).send({bancos});  
           }        
     }
     
   });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}



const getDatosInfo =  async (req, res) => {  
       
  var pagoIdUser = req.params.id;
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);   
    
    Usuario.findById(pagoIdUser).exec((err, usuarios) => { 
      if (err){
        res.status(500).send({message: 'Usuario no Existe'});
      }else{                 
            const apartamento = usuarios.apartamento;   
            const piso = usuarios.piso;
            const query = { piso: piso, apartamento: apartamento};
 
            Cuentas.findOne(query).exec((err, cuentas) => { 
              if (err){
                res.status(500).send({message: 'Error al ejecutar la consulta'});
              }else{
                    if (!cuentas){
                        //res.status(404).send({message: 'No se encontraron registros'});                        
                        const cuentas = {piso:0,apartamento:0,monto:0,fecha:'01/01/2000'};                        
                        res.status(200).send({cuentas});  
                    }else{
                      res.status(200).send({cuentas});  
                    }        
              }
            });


      }
    });    

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}

const getDolar =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET); 
    
    const query = { "nemonico": process.env.DOLAR};
    const dolar = 
    Parametros.findOne(query).exec((err, parametro) => { 
     if (err){
       res.status(500).send({message: 'Error al ejecutar la consulta'});
     }else{
           if (!parametro){
               res.status(404).send({message: 'Parametro no existe'});
           }else{
             res.status(200).send({parametro});  
           }        
     }
     
   });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}

  

  module.exports = {	
	savePago,
    getPagos,
    getBancos,
    getDatosInfo,
    getDolar
};