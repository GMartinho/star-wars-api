const mongoose = require('mongoose');
const Planet = require('../../src/app/models/Planet');

const app = require('../../src/app');
const request = require('supertest');


describe("TEST API - Planet interactions - B2W Challenge", () => {

    afterAll(async () => {
        await Planet.deleteMany({});
        mongoose.disconnect();
    });

    // T E S T S
    it("POST PLANET should fails to insert empty fields", async () => {
        const planet = {
            name: '',
            climate: '',
            terrain: '',
            appearences: ''
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("POST PLANET should disregard spaces before and after parameters", async () => {
        const planet = {
            name: ' Dantooine',
            climate: 'temperate    ',
            terrain: ' oceans, savannas, mountains, grasslands  ',
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain,
        });


        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.response.planet.name).toBe('Dantooine');
    });

    it("POST PLANET should NOT insert planets with same name", async () => {
        const planet = {
            name: 'Dantooine',
            climate: 'temperate',
            terrain: 'cityscape, mountains',
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });


    it("POST PLANET should insert new planet with its number of appearences in movies, if its exists in SWAPI and 'appearences' was not filled", async () => {
        const planet = {
            name: 'Tatooine',
            climate: 'arid',
            terrain: 'desert',
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain
        });

        expect(response.status).toBe(201);
        expect(response.body.response.planet.appearences).toBeGreaterThanOrEqual(5);

    });

    it("POST PLANET should reject strings that cannot be parse to number in 'appearences' parameter", async () => {
        const planet = {
            name: 'Mars',
            climate: 'arid',
            terrain: 'desert',
            appearences: 'aaa'
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain,
            appearences: planet.appearences
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);

    });

    it("POST PLANET should reject negative values to 'appearences' parameter", async () => {
        const planet = {
            name: 'Mars',
            climate: 'arid',
            terrain: 'desert',
            appearences: -1
        };

        const response = await request(app)
        .post('/planets/add')
        .send({
            name: planet.name,
            climate: planet.climate,
            terrain: planet.terrain,
            appearences: planet.appearences
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);

    });

    it("LIST PLANETS shouldn't accept a value <= 0 in 'page' parameter", async () => {
        const search = {
            page: -1
        };

        const response = await request(app)
        .get('/planets/list').query({
            page: search.page,
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
    });

    it("LIST PLANETS shouldn't accept a value <= 0 in 'per_page' parameter", async () => {
        const search = {
            per_page: -1
        };

        const response = await request(app)
        .get('/planets/list').query({
            per_page: search.per_page,
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
    });

    it("LIST PLANETS should only accept 'name', 'climate', 'terrain' or 'appearances' in 'sort' parameter", async () => {
        const search = {
            sort: 'aaa'
        };

        const response = await request(app)
        .get('/planets/list').query({
            sort: search.sort,
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
    });

    it("LIST PLANETS should be case-insensitive and disregard spaces before and after 'sort' parameter", async () => {
        const search = {
            sort: '    CLiMaTe'
        };

        const response = await request(app)
        .get('/planets/list').query({
            sort: search.sort,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        
    });

    it("GET PLANETS BY NAME should be case-insensitive and disregard spaces before and after 'name' parameter", async () => {
        const search = {
            name: '    TaTooInE'
        };

        const response = await request(app)
        .get(`/planets/getbyname/${search}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        
    });

    it("GET PLANETS BY NAME should be capable of get similar names depending on what was type in 'name' parameter", async () => {
        const search = {
            name: '    ooInE'
        };

        const response = await request(app)
        .get(`/planets/getbyname/${search.name}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.response.planets).toHaveLength(2);
        
    });

    it("GET PLANETS BY ID should accept only valid id info in 'id' parameter", async () => {
        const search = {
            id: 1
        };

        const response = await request(app)
        .get(`/planets/getbyid/${search.id}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
    });

    it("GET PLANETS BY ID should return 404 in case of a valid 'id' parameter but a nonexistent register", async () => {
        const search = {
            id: '60bdb674eb302602b0a60887',
        };

        const response = await request(app)
        .get(`/planets/getbyid/${search.id}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        
    });

    it("DELETE PLANET BY ID should remove only existent planets", async () => {
        const search = {
            id: '60bdb674eb302602b0a60887',
        };

        const response = await request(app)
        .get(`/planets/deletebyid/${search.id}`);

        expect(response.status).toBe(404);
        
    });

    it("DELETE PLANET BY ID should accept only valid id info in 'id' parameter", async () => {
        const search = {
            id: 1
        };

        const response = await request(app)
        .get(`/planets/deletebyid/${search.id}`);

        expect(response.status).toBe(404);
        
    });

    
});

