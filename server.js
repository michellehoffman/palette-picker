const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`${ app.locals.title } is listening on port ${ app.get('port') }`)
})