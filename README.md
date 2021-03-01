# PokultureGo

## Requirements
- NodeJS
- MongoDB
- Python
- Visual Studio C++ integration

(Python and C++ integration are required for TensorFlow machine learning compilation)
## Installation
- Clone repository
- Download OpenStreetMap Normandy export (https://download.geofabrik.de/europe/france/basse-normandie-latest.osm.pbf) under `assets/` directory
- Run node modules installation
```
npm i
```
- Start MongoDB database
- Open a MongoDB client and run the following commands
```
db.createCollection("pois");
db.pois.createIndex({ location: "2dsphere" };)
```

- Run server
```
npm run start
```
The first server start-up can take a while as it will import thousands of POIs and then parse and import descriptions/synonyms for each point
## Test suite
- Create test context (only the first time)
```
npm run test:context
```
- Run tests
```
npm run test
```
