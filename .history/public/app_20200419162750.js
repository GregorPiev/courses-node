document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

const toCurrency = price => {
    return new Intl.NumberFormat('he-Il', {
        currency: 'ils',
        style: 'currency'
    }).format(price);
};

const $card = document.querySelector('#card');
$card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id;
        console.log(id);
        fetch('/card/remove/' + id, {
            method: 'delete'
        })
            .then(res => res.json())
            .then(card => {
                console.log('Card:', card);
                if (card.courses.length) {
                    const html = card.courses.map(c => {
                        return `
                   <tr>
                     <td>${c.title}</td>
                     <td>${c.count}</td>
                     <td><button class="btn btn-small js-remove" data-id="${ c.id }">Remove</button></td>
                    </tr>
                  `                  
                    }).join(' ');
                    $card.querySelector('tbody').innerHTML = html;
                    $card.querySelector('.price').textContent = card.price;
                } else {
                    $card.innerHTML = `<p>Cart is empty</p>`;
                }

            })
            ;
    }

});