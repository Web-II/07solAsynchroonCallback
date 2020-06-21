const alfabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const alfabetLower = 'abcdefghijklmnopqrstuvwxyz'.split('');
const caesar = function(event){
  document.getElementById('encryption').innerText = event.target.value.split('')
    .map(value => 
      alfabetUpper.includes(value) 
        ? alfabetUpper[(alfabetUpper.indexOf(value) + 3) % alfabetUpper.length]
        : alfabetLower.includes(value) 
          ? alfabetLower[(alfabetLower.indexOf(value) + 3) % alfabetLower.length]
          : value)
    .join('');
}

function init() {
  document.getElementById('text').addEventListener('keyup', caesar);  
}

window.onload = init;
