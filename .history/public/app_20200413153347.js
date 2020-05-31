document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('he-Il', {
        currency: 'ils',
        style: 'currency'
    }).format(node.textContent);
});