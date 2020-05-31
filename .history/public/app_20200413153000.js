document.querySelector('./price').forEach(node => {
    node.textContent = new Intl.NumberFormat('he-Il', {
        currency: 'ils',
        style: 'currency'
    });
});