window.onload = displayColors;
$('.generate-button').on('click', displayColors)
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', submitProject);

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

function generateColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color;
}

function displayColors() {
  palette.forEach( section => {
    if(!section.locked) {
      section.color = generateColor();

      $(section.div).css('background-color', section.color)
    }
    $(section.div).find('h2').text(section.color);
  })
}

function lockColor() {
  const hexCode = $(this).next().text();
  const color = palette.find(section => section.color === hexCode);

  color.locked = !color.locked;
  $(this).attr('src', lockImage[color.locked]);
}

async function submitProject(e) {
  e.preventDefault();
  
  const name = e.target.elements[0].value;
  const url = 'http://localhost:3000/api/v1/projects';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  const results = await response.json();

  if (results.message) {
    return $('.project-form-validation').prepend(`<p>${results.message}</p>`)
  }

  $('.project-display').append(
    `
      <div id="${ results.id }">
        <h3>${ results.name }</h3>
      </div>
    `
  );
  $('.project-form-validation').empty();
}