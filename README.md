# 
<h1 align="center">
STAR WARS API - B2W Challenge
</h1>
<h2 align="center">
<img src="https://user-images.githubusercontent.com/85261032/120999516-95901380-c75f-11eb-8e70-1a6a900a0c7a.png" width="600px" />
</h2>

<h4 align="center">
  <p>This REST API was developed to fetch information regarding planets from Star Wars movies.</p>
  <p>Planets informations was obtained from the Star Wars public API: https://swapi.dev/api</p>
</h4>
<h2 align="center">
  <h3 align="center">Some of the technologies used:</h3>
<h4 align="center"> Node.js
- Yarn
- Express
- nodemon
- axios
- MongoDB
- Mongoose
- Yup
- DotEnv
- Supertest
  - Jest</h4>
</h2>

## How to use:

With mongoDB and Node.js properly working...

It's recommended to use Yarn as your package manager, if so:
```bash
# To install Yarn:
$ npm install -g yarn

# To clone the repository:
$ git clone https://github.com/GMartinho/star-wars-api-desafio-b2w.git

# Go to project root:
$ cd star-wars-api-desafio-b2w

# To execute the API in dev:
$ yarn dev

# To execute the API equivalent to what would be production:
$ yarn start

# To execute the integration tests:

# If you're using Windows:
$ yarn test-windows

# If you're using Linux or Mac:
$ yarn test-linux-mac
  
```

# PRESET BASE URL
* http://localhost:8080/

## API Endpoints

#### To add a new Planet 
* **POST** to http://localhost:8080/planets/add
```
# Examples:

{
    "name": "Tatooine",
    "climate": "arid",
    "terrain": "desert"
}

{
    "name": "Naboo",
    "climate": "temperate",
    "terrain": "grassy hills, swamps, forests, mountains"
    "appearences": 4
}
```


#### To list and filter all planets
* **GET** to http://localhost:8080/planets/list

```
# Examples:

{
    "per_page": "4",
    "page": "2",
    "sort": "climate"
}

# The final URL should be http://localhost:8080/planets/list?per_page=4&page=2&sort=climate
# This call will bring up page 2, with 4 planets per page, sorting them by their climate

# If no parameters are passed, per_page: 10, page: 1, sort: 'name' will be the default values.
```

#### To get planet by name
* **GET** to http://localhost:8080/planets/getByName/:name

```
# Examples:

{
    "name": "Naboo"
}

# The final URL should be http://localhost:8080/planets/getByName/Naboo
# This call will bring up all planets that have Naboo as a substring, including Naboo itself

```

#### To get planet by id
* **GET** to http://localhost:8080/planets/getById/:id

```
# Examples:

{
    "id": "60bda3fc002c0d57c8b0c20a"
}

# The final URL should be http://localhost:8080/planets/getById/60bda3fc002c0d57c8b0c20a
# This call will bring up only one planet with this respective Id

```

#### To delete planet by id
* **DELETE** http://localhost:8080/planets/deleteById/:id

```
# Examples:

{
    "id": "60bda3fc002c0d57c8b0c20a"
}

# The final URL should be http://localhost:8080/planets/deleteById/60bda3fc002c0d57c8b0c20a
# This call will delete only one planet with this respective Id

```

-------
> Developed by Gabriel Martinho  - [Linkedin](https://www.linkedin.com/in/gabriel-martinho-074710b0/)
