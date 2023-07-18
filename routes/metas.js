var express = require('express');
const { pedirTodas, pedir, Crear, Actualizar, borrar } = require('../db/pedidos');
var router = express.Router();
const { body, validationResult } = require('express-validator');

let metas = [
{
  "id": "1",
  "detalles": "Correr por 30 minutos",
  "plazo": "dia",
  "frecuencia": 1,
  "icono": "🏃🏽‍♂️",
  "meta": 365,
  "fecha_limite": "2030-01-01",
  "completado": 5
},
{
  "id": "2",
  "detalles": "Leer libros",
  "plazo": "año",
  "frecuencia": 6,
  "icono": "📚",
  "meta": 12,
  "fecha_limite": "2030-01-01",
  "completado": 0
},
{
  "id": "3",
  "detalles": "Viajar a parques nacionales",
  "plazo": "mes",
  "frecuencia": 1,
  "icono": "🛫",
  "meta": 60,
  "fecha_limite": "2030-01-01",
  "completado": 40
},
];

/* GET Lista de metas */
router.get('/', function (req, res, next) {
  pedirTodas('metas', (err, metas) => {
    if (err) {
      return next(err);
    }
    console.log(metas)
    res.send(metas);
  });
});

/* GET Meta con id */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  pedir('metas', id, (err, meta) => {
    if (err) {
      return next(err);
    }
   if (!meta.length) {
     return res.sendStatus(404);
   }
   res.send(meta[0]);
   });
});

/* POST Crear meta */
router.post('/', 
body('detalles').isLength({ min: 5 }),
body('periodo').not().isEmpty(),
function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const nuevaMeta = req.body;
  Crear('metas', nuevaMeta, (err, meta) => {
    if (err) {
      return next(err);
    }
    res.send(meta);
  });
});

/* PUT Actualizar meta */
router.put('/:id', 
  body('detalles').isLength({ min: 5}),
  body('periodo').not().isEmpty(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const id = req.params.id;
    if (body.id !== +id) {
      return res.sendStatus(400);
    }
    pedir('metas', id, (err, meta) => {
      if (err) {
        return next(err);
      }
      if (!meta.length) {
        return res.sendStatus(400);
      }
      Actualizar('metas', id, body, (err, Actualizada) => {
        if (err) {
          return next(err);
        }
        res.send(Actualizada);
      });
    });  
  });

/* DELETE Borrar meta */
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  pedir('metas', id, (err, meta) => {
    if (err) {
      return next(err);
    }
    if (!meta.length) {
      return res.sendStatus(404);
    }
    borrar('metas', id, (err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
    });
  });
});


module.exports = router;


