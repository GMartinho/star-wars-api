const routes = require('express').Router();
const PlanetController = require('./app/controllers/PlanetController');

routes.post('/planets/add', PlanetController.addPlanet);

routes.get('/planets/list', PlanetController.listPlanets);

routes.get('/planets/getByName/:name', PlanetController.getPlanetByName);

routes.get('/planets/getById/:id', PlanetController.getPlanetById);

routes.delete('/planets/deleteById/:id', PlanetController.deletePlanetById);


module.exports = routes;