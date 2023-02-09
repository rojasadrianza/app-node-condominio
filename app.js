

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var api = require('./routes/usuario');




app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req, res, next)=>{
    res.header('Access-Control-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //res.header('Allow', 'GET, POST, OPTIONS, , DELETE');

    next();
});




app.use('/api',api);


                              //function(req, res)
/*app.get('/prueba2/:nombre2?', (req, res) =>{ 

    if (req.params.nombre2){
		var nombre2 = req.params.nombre2;    
	}else{
        var nombre2 = "SIN NOMBRE"; 
    }		
	
	res.status(200).send({
		                  data: [2,3,4],
						  texto: "Hola Mundo - " + nombre2});

});	*/

module.exports = app;