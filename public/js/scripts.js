window.onload = displayColors;
$('.generate-button').on('click', displayColors)
$('.lock-button').on('click', lockColor);

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