var express = require ('express');
var app = express();

var cont=0;
exports.count_mw = (function(req, res, next) {

if (req.url == '/' && req.client.parser.incoming.secret == undefined){

cont++;
req.number = cont;
console.log("Visitas: " + req.number);
}

next();

});

// exports.getCount= function(){

// return cont;
// }