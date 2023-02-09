'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema ({
	nombre: String,
	correo: String,
	piso: Number,
	apartamento: Number,
	estatus: Number,
	tipo: Number,
	password: String
});

 	

//module.exports = mongoose.model('Usuario', UsuarioSchema);
module.exports = mongoose.model('usuarios', UsuarioSchema);