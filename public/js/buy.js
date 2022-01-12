const buyButton = document.querySelector('#buyBTN');
const prodQty = document.querySelector('#prod-qty');

buyButton.addEventListener('click', handleBuy);

function handleBuy(event) {
    console.log('Buy! Buy! Buy!');
    if (prodQty.innerText > 0){
        prodQty.innerText -= 1;
    }
}

