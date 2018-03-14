const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));

app.locals.title = 'Palette Picker';
app.locals.projects = [
  { 
    id: 1,
    name: 'Project 1'
  }
];
app.locals.palettes = [
  {
    id: 1,
    name: 'Fire',
    colors: ['#000000', '#FFFFFF', '#FCF015', '#EF4AB7', '#3AD784'],
    projectID: 1
  }
]

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.status(200).json(projects);
})

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.find(project => project.id === parseInt(id));

  response.status(200).json(project);
})

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id === parseInt(id));

  response.status(200).json(palette);
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;
  const palettes = app.locals.palettes.filter(palette => palette.projectID === parseInt(id));

  response.status(200).json(palettes);
})

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { name } = request.body;

  if(!name) {
    return response.status(422).json({ message: 'Please enter a project name' });
  }
  
  const match = app.locals.projects.find(project => project.name === name);
  
  if(match) {
    return response.status(400).json({ 
      message: `Project ${ name } already exists` 
    });
  }

  const newProject = { 
    id,
    name
  };

  app.locals.projects.push(newProject);
  response.status(201).json(newProject);
})

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  const { name, colors, projectID } = request.body;
  const newPalette = {
    id,
    name,
    colors,
    projectID
  }
  const project = app.locals.projects.find(project => project.id === parseInt(projectID));

  app.locals.palettes.push(newPalette);
  response.status(201).json(newPalette);
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const { projectID } = request.body;
  const remainingPalettes = app.locals.palettes.filter(palette => palette.id !== parseInt(id));
 
  app.locals.palettes = remainingPalettes;
  response.json({ message: 'Palette sucessfully deleted' });
})

app.listen(app.get('port'), () => {
  console.log(`${ app.locals.title } is listening on port ${ app.get('port') }`)
})