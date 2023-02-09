'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var PagosSchema = Schema ({
    fecha: Date,
    monto: String,
    banco: String,
    referencia: String,
    idUsuario: mongoose.Types.ObjectId,
    estatus: String
});	


module.exports = mongoose.model('Pagos', PagosSchema);