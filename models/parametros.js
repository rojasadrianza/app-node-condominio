var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParametrosSchema =  Schema ({
    nombreParametro: String,
	valorParametro: String,
    nemonico: String,
    fecha: Date
}); 

module.exports = mongoose.model('Parametros', ParametrosSchema);