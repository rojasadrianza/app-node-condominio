'use strict'

const XLSX = require('xlsx');
const jwt = require('jsonwebtoken');
var Cuentas = require('../models/condominio');
var Parametros = require('../models/parametros');
var Pagos = require('../models/pagos');
const { enviarMailPago } = require('../helpers/nodeMailer');
var Usuario = require('../models/usuario'); 
//const { Usuarios } = require('../models/usuario');
require('dotenv').config();

const cargarDatos =  async (req, res) => {

    //Borrar tabla
    Cuentas.deleteMany(err => {
        if(err){
          res.status(500).send({message: 'error al borrar'});
        }else{
            //Leer excel
            const workbook = XLSX.readFile(process.env.RUTAEXCEL);
            const workbookSheets = workbook.SheetNames;    
            const sheet = workbookSheets[0];
            const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);  
            var i = 0;
            var resultado = 0;

            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            // current year
            let year = date_ob.getFullYear();
            // current hours
            let hours = date_ob.getHours();
            // current minutes
            let minutes = date_ob.getMinutes();
            // current seconds
            let seconds = date_ob.getSeconds();
            var fecha = year + "-" + month + "-" + date;
            //var fecha = date + "-" + month + "-" + year ;
            
            //Insertar datos
            for (const item of  dataExcel){           
                var cuentas = new Cuentas({ piso: item['PISO'], apartamento: item['APARTAMENTO'], monto: item['MONTO'], fecha: fecha }); 
                cuentas.save((err) => {
                    if (err){
                        res.status(500).send({message: 'Incorrecto'}); 
                    }
                });
                i = i + 1;
            }  
            res.status(200).send({message: 'Correcto ' + i});          
        }
     });
}

const getCuentas =  async (req, res) => {  
       
    const { authorization } = req.headers;  
    if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
    try {     
      const jwtData   = await jwt.verify(authorization,process.env.SECRET);        
      //const query = { _id: jwtData.userId };
      var sort = { apartamento: 1 };
      Cuentas.find().sort(sort).exec((err, cuentas) => { 
       if (err){
         res.status(500).send({message: 'Error al ejecutar la consulta'});
       }else{
             if (!cuentas){
                 res.status(404).send({message: 'No se encontraron registros'});
             }else{
               res.status(200).send({cuentas});  
             }        
       }
     });

    }catch(err){   
      return res.status(401).send({message: 'Authorization No Valido'});
    }
}


const saveParametro =  async (req, res) => {

  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {

      var parametro = new Parametros(); 
      var params = req.body;
      
      parametro.nombreParametro = params.nombre,
      parametro.valorParametro = params.valor,
      parametro.nemonico = params.nemonico,
      parametro.fecha = params.fecha
      
      parametro.save((err, parametroStored) => {
                if (err){
                    res.status(500).send({message: 'Error al guardar el marcador'});
                }else{
                    res.status(200).send({parametroGuardado: parametroStored});
                    const userId = parametroStored._id;  
                }
      });

}catch(err){   
  return res.status(401).send({message: 'Authorization No Valido'});
}

}


const getParametros =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);        
    //const query = { _id: jwtData.userId };
    var sort = { apartamento: 1 };
    Parametros.find().sort(sort).exec((err, parametros) => { 
     if (err){
       res.status(500).send({message: 'Error al ejecutar la consulta'});
     }else{
           if (!parametros){
               res.status(404).send({message: 'No se encontraron registros'});
           }else{
             res.status(200).send({parametros});  
           }        
     }
   });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}


const deleteParametro =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try { 

    //var params = req.body;    
    //var parametroId = params.id;
    var parametroId = req.params.id;
    //console.log("ID " + parametroId);
    Parametros.findById(parametroId, function(err,parametro){
    if (err){
       res.status(500).send({message: 'error al devolver el registro'})
    }
	    if (!parametro){
	       res.status(404).send({message: 'no hay marcador'})
	    }else{
        parametro.remove(err => {
	           if(err){
	             res.status(500).send({message: 'error al borrar'});
	           }else{
	             res.status(200).send({message: 'el registro se ha borrado'});
	           }
	        });
	    }

    });

  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }

	}

  const getParametro =  async (req, res) => {  
       
    const { authorization } = req.headers;  
    if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
    try {     
      const jwtData   = await jwt.verify(authorization,process.env.SECRET); 
      //var params = req.body;    
      //var parametroId = params.id;
      //console.log("ID " + parametroId);
      var parametroId = req.params.id;
      Parametros.findById(parametroId).exec((err, parametro) => { 
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

const putParametro =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);     
    var params = req.body;  
    Parametros.findByIdAndUpdate(req.body.id, params, (err, parametroUpdate) => {
      if(err){
        res.status(401).send({message: 'Error al actualizar el marcador'});
      }else{
        res.status(200).send({usuario: parametroUpdate});
      }
      
    });
  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}


const getPagosClientes =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);
        const pagos = await Pagos.aggregate([
          {

                  $lookup:
                  {
                      from: "usuarios",
                      localField: "idUsuario",
                      foreignField: "_id",
                      as: "usuarios"
                  }
          },/*,
          { $unwind: "$pagos" }*/
          { $match: { estatus: "PENDIENTE"}}
      
        ]).sort({ fecha : -1  })
        
        res.status(200).send({pagos});
  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }

  
}


const putPago =  async (req, res) => {  
       
  const { authorization } = req.headers;  
  if (!authorization) return res.status(401).send({message: 'Error authorization null'}); 
  try {     
    const jwtData   = await jwt.verify(authorization,process.env.SECRET);     
    var params = req.body;  
    Pagos.findByIdAndUpdate(req.body.id, params, (err, parametroUpdate) => {
      if(err){
        res.status(401).send({message: 'Error al actualizar el marcador'});
      }else{
        res.status(200).send({usuario: parametroUpdate});

          var correo = '';
          const query = { _id: parametroUpdate.idUsuario };          
          Usuario.findOne(query).exec((err, usuarios) => { 
            if (err){
              console.log(err);
            }else{     
                const datosUsuarios = JSON.stringify(usuarios);
                const datosParse = JSON.parse(datosUsuarios);
               
                correo = datosParse.correo;  
                
                enviarMailPago(process.env.SUJETOPAGOCONFIRMADO,
                parametroUpdate.referencia,correo,'Confirmado');
            }     
          });
             

      }
      
    });
  }catch(err){   
    return res.status(401).send({message: 'Authorization No Valido'});
  }
}



function cargarDatosTest(req, res){ 
    var cuentas = new Cuentas({ piso:0, apartamento:1, monto:20 });
    cuentas.save();
}

function deleteDatosTest(req, res){    
    var cuentas = new Cuentas();
    cuentas.remove({});
}


module.exports = {	
	cargarDatos,
    getCuentas,
    saveParametro,
    getParametros,
    deleteParametro,
    getParametro,
    putParametro,
    getPagosClientes,
    putPago
};

