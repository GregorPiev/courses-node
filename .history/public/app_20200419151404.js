document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('he-Il', {
        currency: 'ils',
        style: 'currency'
    }).format(node.textContent);
});

const $card = document.querySelector('#card');
$card.addEventListener('click', event => {
   if(event.target.classList.contains('js-remove') {
       
   }
  
});