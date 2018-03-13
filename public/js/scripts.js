window.onload = displayColors;

$('.generate-button').on('click', displayColors)

function generateColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color;
}

function displayColors() {
  const palette = ['.color-1', '.color-2', '.color-3', '.color-4', '.color-5'];

  palette.forEach( div => {
    const color = generateColor();

    $(div).css('background-color', color)
  })
}