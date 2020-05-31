const toCurrency = price => {
    return new Intl.NumberFormat('he-Il', {
        currency: 'ils',
        style: 'currency'
    }).format(price);
};

const toDate => date => {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

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
                  `;                  
                    }).join(' ');
                    $card.querySelector('tbody').innerHTML = html;
                    $card.querySelector('.price').textContent = toCurrency(card.price);
                } else {
                    $card.innerHTML = `<p>Cart is empty</p>`;
                }

            })
            ;
    }

});