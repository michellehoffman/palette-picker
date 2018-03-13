const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  // read all projects
})

app.get('/api/v1/palettes', (request, response) => {
  // read all pallets
})

app.get('/api/v1/palettes/:id', (request, response) => {
  // get a certain palette to display on the page
})

app.post('/api/v1/projects', (request, response) => {
  // create a new project
})

app.post('/api/v1/palettes', (request, response) => {
  // create a new palette
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  // delete a certain palette
})

app.listen(app.get('port'), () => {
  console.log(`${ app.locals.title } is listening on port ${ app.get('port') }`)
})