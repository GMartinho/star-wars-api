const Planet = require('../models/Planet');
const SwapiService = require('../../services/SwapiService');
const yup = require('yup');

class PlanetController {

    async addPlanet(req, res){

        try {

            let schema = yup.object().shape({
                name: yup.string().required().trim(),
                climate: yup.string().required().trim(),
                terrain: yup.string().required().trim(),
                appearences: yup.number().positive().integer(),
            });

            const isValid = await schema.isValid(req.body);

            if(!isValid){
                return res.status(400).json({
                    success: false,
                    description: 'Inserted data is invalid',
                });
            }

            const name = req.body.name.trim();
            const climate = req.body.climate.trim();
            const terrain = req.body.terrain.trim();
            let appearences = Number(req.body.appearences);

            if(!appearences){
                appearences = await SwapiService.getMovieAppearences(name);
            } 

            const data = {
                name,
                climate,
                terrain,
                appearences
            }

            await Planet.create(data, 
                (error) => {
                    if(error){
                        return res.status(400).json({
                            success: false,
                            description: 'Planet insertion has failed',
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        description: 'Planet inserted sucessfully',
                        response: {
                            planet: data,
                        }
                             
                    });

                }
            );
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                description: error.message
            });
        }
        
    }

    async listPlanets(req, res){

        try {

            // DEFAULT VALUES
            // per_page = 10;
            // page = 0;
            // sort = 'name';
            let per_page = req.query.per_page ? Number(req.query.per_page) : 10;
            let page = req.query.page ? per_page * (Number(req.query.page) - 1) : 0;
            let sort = req.query.sort ? req.query.sort.toLowerCase().trim() : 'name';

            const cleanData = {
                per_page: per_page,
                page: page,
                sort: sort,
            }

            let possibleSortAnswers = ['name', 'climate', 'terrain', 'appearences']

            let schema = yup.object().shape({
                per_page: yup.number().positive().integer(),
                page: yup.number().integer(),
                sort: yup.string().trim(),
            });

            const isValid = await schema.isValid(cleanData);

            if(!isValid || !possibleSortAnswers.includes(cleanData.sort)){
                return res.status(400).json({
                    success: false,
                    description: 'Filter parameters are invalid',
                });
            }
           

            const planets = await Planet.find({}).limit(cleanData.per_page).skip(cleanData.page).sort(cleanData.sort);
            return res.status(200).json({
                success: true,
                response: { 
                    planets 
                } 
            });

        }
        catch(error) {
            return res.status(400).json({
                success: false,
                description: error.message
            });
        }

    }

    async getPlanetByName(req, res){

        try {

            if(req.params.name){
                const { name } = req.params;

                const planets = await Planet.find({name: {$regex: name, $options: 'ig'}});

                if(planets){
                    return res.status(200).json({
                        success: true, 
                        response: {
                            planets: planets
                        }
                    });
                }else{
                    return res.status(404).json({
                        success: false,
                        description: 'Planet not found.'
                    });
                }

            }else{
                return res.status(400).json({
                    success: false,
                    description: 'Name parameter not found.'
                });
            }

        }
        catch(error) {
            return res.status(400).json({
                success: false,
                description: error.message
            });
        }
    }

    async getPlanetById(req, res){

        try {

            if(req.params.id){
                const { id } = req.params;

                const planet = await Planet.findById(id);

                if(planet){
                    return res.status(200).json({
                        success: true, 
                        response: { 
                            planet: planet
                        }
                    });
                }else{
                    return res.status(404).json({
                        success: false,
                        description: 'Planet not found.'
                    });
                }

            }else{
                return res.status(400).json({
                    success: false,
                    description: 'Id parameter not found.'
                });
            }

        }
        catch(error) {
            return res.status(400).json({
                success: false,
                description: error.message
            });
        }
    }

    async deletePlanetById(req, res){

        try {

            if(req.params.id){
                const { id } = req.params;

                const planet = await Planet.findByIdAndDelete(id);

                if (!planet) {
                    return res.status(404).json({
                        success: false,
                        description: 'Planet not found.',
                    });
                }
                
                return res.status(200).json({
                    success: true, 
                    description: 'Planet was successfully deleted'
                });
                
            }else{
                return res.status(400).json({
                    success: false,
                    description: 'id parameter not found.'
                });
            }

        }
        catch(error) {
            return res.status(400).json({
                success: false,
                description: error.message
            });
        }

    }
}

module.exports = new PlanetController();