// import express library
const express = require('express');
// import body-parser module
const bodyParser = require('body-parser');
// instantiate express
const app = express();

// set the port of for the app to run on upon start
app.set('port', process.env.PORT || 3000);
// tell app to utilize body-parser
app.use(bodyParser.json());
// tell app to serve static files from public directory
app.use(express.static('public'));
// give app a title in the express local variables
app.locals.title = 'Palette Picker';

// determine the environment of app
const environment = process.env.NODE_ENV || 'development';
// get specifications outlined in knexfile for that environment
const configuration = require('./knexfile')[environment];
// configure database
const database = require('knex')(configuration);

app.get('*', (request, response) => {
  response.redirect('https://' + request.headers.host + request.url)
});

// create api endpoint for /projects with GET method
app.get('/api/v1/projects', (request, response) => {
  // get projects table from database
  database('projects').select()
    // return response with an array of projects in json format
    .then(projects => response.status(200).json(projects))
    // if there is an error return the error with a status of 500
    .catch(error => response.status(500).json({ error }));
});

// create api endpoint to get palettes with a certain project id
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // get id from request uri
  const { id } = request.params;

  // get palettes from database that have the project_id of id
  database('palettes').where('project_id', id).select()
    // then, for these palettes...
    .then(palettes => {
      // if there are palettes...
      if (palettes.length) {
        // send response with an array of palettes in json format
        response.status(200).json(palettes);
      // if there are no palettes...
      } else {
        // send response with 404 status...
        response.status(404).json({
          // and an object with a key of error and a value of an error message
          error: `Could not find palettes for project ${ id }`
        });
      }
    })
    // if there is an error return the error with a status of 500
    .catch(error => response.status(500).json({ error }));
});

// create api endpoint to post projects
app.post('/api/v1/projects', (request, response) => {
  // declare variable of project and assign the request body to it 
  const project = request.body;

  // if the request body does not have a key of name...
  if (!project.name) {
    // return a response with a code of 422...
    return response.status(422).send({ 
      // and an object with a key of error and a value of an error message
      error: `Expected format: { name: <String> }. You're missing a name property.`
    });
  }

  // create new project row in projects table and return id
  database('projects').insert(project, 'id')
    // then return a response with a status of 201 and an obj with a key of id and the project id
    .then(projects => response.status(201).json({ id: projects[0] }))
    // if there is an error return the error with a status of 500
    .catch(error => response.status(500).json({ error }));
});

// create api endpoint to retrieve a certain palette based on the given id
app.get('/api/v1/palettes/:id', (request, response) => {
  // get id from request uri
  const { id } = request.params;

  // get palette that has the id of the id in the uri
  database('palettes').where('id', id).select()
    // then...
    .then(palettes => {
      // if there are palettes...
      if (palettes.length) {
        // return a response with a status of 200 and the first element in the array, since only one palette should have any single id
        response.status(200).json(palettes[0]);
      // if there are no palettes...
      } else {
        // return a response with a status of 404...
        response.status(404).json({ 
          // and an object with the key of error and value of an error message
          error: `Could not find palette with an id of ${ id }`
        });
      }
    })
    // if there is an error return the error with a status of 500
    .catch(error => response.status(500).json({ error }));
});

// create api endpoint to post a palette
app.post('/api/v1/palettes', (request, response) => {
  // declare variable of palette and assign the request body to it 
  const palette = request.body;

  // for the array of required parameters...
  for (let requiredParams of ['name', 'colors', 'project_id']) {
    // if the request body does NOT have that required parameter...
    if(!palette[requiredParams]) {
      // return a response with a status of 422...
      return response.status(422).send({ 
        // and an object with a key of error and a value of an error message
        error: `Expected format: { name: <String>, colors: <Array>, project_id: <Number> }. You're missing a ${ requiredParams } property.`
      });
    }
  };

  // in the palettes table, insert a new row and return the id
  database('palettes').insert(palette, 'id')
    // then return a response with a status of 201 and an object with the key of id and the id of the palette at index 1, since only one should have a single id
    .then(palettes => response.status(201).json({ id: palettes[0] }))
    // if there is an error return the error with a status of 500
    .catch(error => response.status(500).json({ error }));
});

// create api endpoint to delete a palette with the given id
app.delete('/api/v1/palettes/:id', (request, response) => {
  // get id from request URI
  const { id } = request.params;

  // delete palettes where the id matched the id from the request URI
  database('palettes').where('id', id).del()
    // then return a response with a status of 204
    .then(palettes => response.status(204))
    // if there is an error return the error with a status of 500    
    .catch(error => response.status(500).json({ error }));
});

// tell app to listen on the appropriate port when run
app.listen(app.get('port'), () => {
  // console.log app title and current port to the terminal
  console.log(`${ app.locals.title } is listening on port ${ app.get('port') }`);
});

// export app 
module.exports = app;