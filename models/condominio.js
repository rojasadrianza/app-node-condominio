'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CuentasSchema = Schema ({
    piso: Number,
	apartamento: Number,
	monto: Number,
	fecha: Date
});	


module.exports = mongoose.model('Cuentas', CuentasSchema);

