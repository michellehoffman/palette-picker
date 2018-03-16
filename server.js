const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));
app.locals.title = 'Palette Picker';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where('project_id', id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find palettes for project ${ id }`
        });
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  if (!project.name) {
    return response.status(422).send({ 
      error: `Expected format: { name: <String> }. You're missing a name property.`
    });
  }

  database('projects').insert(project, 'id')
    .then(projects => response.status(201).json({ id: projects[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes[0]);
      } else {
        response.status(404).json({ 
          error: `Could not find palette with an id of ${ id }`
        });
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParams of ['name', 'colors', 'project_id']) {
    if(!palette[requiredParams]) {
      return response.status(422).send({ 
        error: `Expected format: { name: <String>, colors: <Array>, project_id: <Number> }. You're missing a ${ requiredParams } property.`
      });
    }
  };

  database('palettes').insert(palette, 'id')
    .then(palettes => response.status(201).json({ id: palettes[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
    .then(palettes => response.status(204))
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${ app.locals.title } is listening on port ${ app.get('port') }`);
});

module.exports = app;