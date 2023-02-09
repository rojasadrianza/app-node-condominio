'use strict'

//var port = process.end.PORT || 3678; //Esto en el caso que creemos una variable de entorno llamada PORT que contenga el puerto
var mongoose = require('mongoose');
var app = require('./app');
var port = 3678;	

mongoose.connect('mongodb://127.0.0.1:27017/condominio',(err,res) =>   {

    if (err){
    	throw err;
    }else{
    	console.log('Conexion a MongoDB Correcta');
    	app.listen(port,() =>{
		console.log("API REST CONDOMINIO funcionando en http://localhost:"+port);		
	    }); 

    }	

});

