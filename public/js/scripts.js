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
const getProjects = async() => {
  try {
    const url = `${ root }/api/v1/projects`;
    const response = await fetch(url);
    const results = await response.json();
    
    return results;
  } catch(error) {
    return error;
  }
}

const displayProjectOptions = async() => {
  const projects = await getProjects();
  
  projects.map(project => {
    return $(`<option id=${ project.id } value=${ project.name }>${ project.name }</option>`).appendTo('#select-project');
  });
}

const setup = () => {
  displayColors();
  displayProjectOptions();
}

const lockColor = () => {
  const hexCode = $(this).next().text();
  const color = palette.find(section => section.color === hexCode);

  color.locked = !color.locked;
  $(this).attr('src', lockImage[color.locked]);
}

// API CALL
const createPalette = async(info) => {
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
const createProject = async(name) => {
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

const showProject = ({ id, name }) => {
  $('.project-form-validation').empty();
  $('.project-display').append(
    `
      <div id="${ id }">
        <h3>${ name }</h3>
      </div>
    `
  );
}

const validation = (message) => {
  $('.project-form-validation').prepend(message)
}

const submitPalette = async(event) => {
  event.preventDefault();

  const options = event.target.elements[0].options;
  const projectID = options[options.selectedIndex].id;
  const name = event.target.elements[1].value || 'My Project';
  const colors = palette.map(div => div.color);
  const info = { name, colors, projectID };
  
  const results = await createPalette(info);
}

const submitProject = async(event) => {
  event.preventDefault();

  const name = event.target.elements[0].value;
  const results = await createProject(name);
  const { message } = results;

  message ? validation(message) : showProject(results)
  event.target.reset();
}

window.onload = setup;
$('.generate-button').on('click', displayColors);
$('.lock-button').on('click', lockColor);
$('.save-palette').on('submit', submitPalette);
$('.save-project').on('submit', submitProject);