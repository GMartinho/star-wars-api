const axios = require('axios');

const swapi = axios.create({ baseURL: 'https://swapi.dev/api' });


class SwapiService extends Error{

    async getMovieAppearences(planetName){

        let appearenceTimes = 0;

        const swapiResponse = await swapi.get(`/planets/?search=${planetName}`);

        if(swapiResponse.data.results){
            swapiResponse.data.results.find(
                (planet) => {
                    if(planet.name === planetName){
                        appearenceTimes = planet.films.length;
                    }
                }
            );
        }else{
            console.error(`The response from ${swapi.baseURL} was inconsistent. The number of appearances in movies was set to default.`);
        }

        return appearenceTimes;
    }
}

module.exports = new SwapiService();