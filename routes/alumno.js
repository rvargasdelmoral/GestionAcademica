var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/create', function(req, res, next) {
    res.render('alumnoCreate');
});

router.get('/read', function(req, res, next) {
    var alumnos = mongoose.model('Alumno');
    alumnos.find(function(err, data) {
        if (!err) 
            res.render('alumnoRead', {"listaAlumnos" : data});
        else
            res.render('error', {
                "mensaje" : "ERROR: alumnoRead",
                "error" : {
                    "status" : "Imposible acceder a la base de datos",
                    "stack" : err
                }
            });
    });
});

router.post('/create', function(req, res, next) {
    if (req.body.idCreate && req.body.nombreCreate && req.body.apellidosCreate && req.body.emailCreate) {
        var Alumno = mongoose.model('Alumno');
        var alumnoInsert = new Alumno({
            "id" : req.body.idCreate,
            "nombre" : req.body.nombreCreate,
            "apellidos" : req.body.apellidosCreate,
            "email" : req.body.emailCreate
        });
        alumnoInsert.save(function(err, doc) {
            if (!err)
                res.redirect('/alumno/read');
            else
                console.log('Error al insertar datos');
        })
    }
    else
        res.redirect('/alumno/create');
});   

router.post("/read", function(req, res, next) {
    var Alumno = mongoose.model('Alumno');
    if (!(req.body._idUpdate === undefined)) {
        if (req.body._idUpdate && req.body.idUpdate && req.body.nombreUpdate && req.body.apellidosUpdate && req.body.emailUpdate) {
            Alumno.update({"_id" : req.body._idUpdate}, {
                "id" : req.body.idUpdate,
                "nombre" : req.body.nombreUpdate,
                "apellidos" : req.body.apellidosUpdate,
                "email" : req.body.emailUpdate                
            }, function(err, doc) {
                if (!err)
                    res.redirect('/alumno/read');
            });
        }
        else    
            res.redirect("/alumno/read");
    }
    else if (!(req.body.id === undefined)) {
        var id = [];
        if (typeof req.body.id === "object") 
            id = req.body.id;              
        else 
            id[0] = req.body.id;

        for (var i = 0; i < id.length; i++) {
            Alumno.remove({"_id" : id[i]}, function(err) {
                if (err)
                    res.redirect('/');
            });
        }   
        res.redirect("/alumno/read");
    }
    else
        res.redirect("/");
});

module.exports = router;