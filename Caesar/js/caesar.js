const alfabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const caesar = function(){
  document.getElementById('encryption').innerText = this.value.split('')
    .map(value => 
      alfabet.includes(value) 
        ? alfabet[(alfabet.indexOf(value) + 3) % alfabet.length]
        : alfabet.includes(value.toUpperCase()) 
          ? alfabet[(alfabet.indexOf(value.toUpperCase()) + 3) % alfabet.length].toLowerCase()
          : value)
    .join('');
}

function init() {
  document.getElementById('text').addEventListener('keyup', caesar);  
}

window.onload = init;
