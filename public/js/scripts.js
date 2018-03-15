const root = 'http://localhost:3000';
const palette = [
  { div: '.color-1', color: null, locked: false },
  { div: '.color-2', color: null, locked: false },
  { div: '.color-3', color: null, locked: false },
  { div: '.color-4', color: null, locked: false },
  { div: '.color-5', color: null, locked: false }
]
const lockImage = {
  true: './assets/002-lock-1.svg',
  false: './assets/003-lock.svg'
}

const generateColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color;
}

const displayColors = () => {
  palette.forEach( section => {
    if(!section.locked) {
      section.color = generateColor();

      $(section.div).css('background-color', section.color)
    }
    $(section.div).find('.hexCode').text(section.color);
  })
}

// API CALL
const getProjects = async () => {
  try {
    const url = `${ root }/api/v1/projects`;
    const response = await fetch(url);
    const results = await response.json();
    
    return results;
  } catch(error) {
    return error;
  }
}

// API CALL
const getPalettes = async (id) => {
  try {
    const url = `${ root }/api/v1/projects/${ id }/palettes`;
    const response = await fetch(url);
    const results = await response.json();

    return results;
  } catch(error) {
    return error;
  }
}

// API CALL
const getSavedPalette = async (id) => {
  try {
    const url = `${ root }/api/v1/palettes/${ id }`;
    const response = await fetch(url);
    const results = await response.json();

    return results;
  } catch(error) {
    return error;
  }
}

const getProjectInfo = async (project) => {
  showProject(project);

  const palettes = await getPalettes(project.id);

  if (palettes.length) {
    palettes.map(palette => showPalette(palette));
  }
} 

const displayProjects = async () => {
  const projects = await getProjects();
  
  projects.forEach(project => getProjectInfo(project));
}

const displayProjectOption = (id, name) => {
  $(`<option id=${ id } value=${ name }>${ name }</option>`).appendTo('#select-project');
}

const setup = () => {
  displayColors();
  displayProjects();
}

const lockColor = (event) => {
  const div = event.target.parentNode;
  const hexCode = $(div).find('.hexCode').text()
  const color = palette.find(div => div.color === hexCode)

  color.locked = !color.locked;
  $(event.target).attr('src', lockImage[color.locked]);
}

// API CALL
const createPalette = async (info) => {
  try {
    const url = `${ root }/api/v1/palettes`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    })
    const results = await response.json();

    return results;
  } catch (error) {
    return error;
  }
}

// API CALL
const createProject = async (name) => {
  try {
    const url = `${ root }/api/v1/projects`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const results = await response.json();
    
    return results;
  } catch(error) {
    return error;
  }
}

const showPalette = ({ name, colors, project_id, id }) => {
  const paletteDisplay = `
    <div class="${ id }">
      <h4>${ name }</h4>
      <div class="saved-palette">
        <div class="color" style="background-color: ${ colors[0] }"></div>
        <div class="color" style="background-color: ${ colors[1] }"></div>
        <div class="color" style="background-color: ${ colors[2] }"></div>
        <div class="color" style="background-color: ${ colors[3] }"></div>
        <div class="color" style="background-color: ${ colors[4] }"></div>
      </div>
    </div>
  `
  $(`.${ project_id }`).append(paletteDisplay);
}

const showProject = ({ id, name }) => {
  $('.project-form-validation').empty();
  $('.project-display').append(
    `
      <div class="${ id }">
        <h3>${ name }</h3>
      </div>
    `
  );
  displayProjectOption(id, name);
}

const validation = (message) => {
  $('.project-form-validation').prepend(message);
}

const getPaletteFormDetails = (elements) => {
  const options = event.target.elements[0].options;
  const project_id = options[options.selectedIndex].id;
  const name = event.target.elements[1].value || 'My Project';

  return { project_id, name }
}

const submitPalette = async (event) => {
  event.preventDefault();

  const { project_id, name } = getPaletteFormDetails();
  const colors = palette.map(div => div.color);
  const results = await createPalette({ name, colors, project_id });
  const paletteInfo = { name, colors, project_id, id: results.id };

  showPalette(paletteInfo);
  event.target.reset();
}

const submitProject = async (event) => {
  event.preventDefault();

  const name = event.target.elements[0].value;
  const results = await createProject(name);
  const { error } = results;

  error ? validation(error) : showProject({ id: results.id, name })
  event.target.reset();
}

const changeColorDisplay = (colors) => {
  colors.forEach((color, index) => {
    palette[index].color = color
    const div = palette[index].div

    $(div).css('background-color', color);
    $(div).find('.hexCode').text(color);
  });
}

const displayPalette = async (event) => {
  const div = event.target.parentNode;
  const id = div.className;
  const { colors } = await getSavedPalette(id);
  
  changeColorDisplay(colors);
}

window.onload = setup;
$('.generate-button').on('click', displayColors);
$('.lock-button').on('click', lockColor);
$('.save-palette').on('submit', submitPalette);
$('.save-project').on('submit', submitProject);
$('.project-display').on('click', '.saved-palette', displayPalette);
