const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('card-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart= []


// Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.classList.remove('visually-hidden')
})

// Fechar o modal quando clicar fora
cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal) {
        cartModal.classList.add('visually-hidden')
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.classList.add('visually-hidden')
})

menu.addEventListener('click', (event) => {
    // console.log(event.target)

    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        //Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('d-flex', 'justify-content-between', 'mb-2', 'flex-column')

        cartItemElement.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <p class="fw-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="fw-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="btn remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity
        
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerHTML = cart.length
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains('remove-from-cart-btn')){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value;

    if(inputValue !== ''){
        addressInput.classList.remove('border-danger')
        addressWarn.classList.add('visually-hidden')
    }
})

//Finalizar pedido
checkoutBtn.addEventListener('click', () => {

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === '') {
        addressWarn.classList.remove('visually-hidden')
        addressInput.classList.add('border-danger')
        return;
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join('')
    
    const message = encodeURIComponent(cartItems)
    const phone = '+5521981859528'

    window.open(`https://wa.me/${phone}?text=${message} Valor total do pedido: ${cartTotal.textContent} | Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0;
    updateCartModal();
    addressInput.value = '';
})

// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 || hora < 2; 
    // true = restaurante está aberto
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove('bg-danger');
    spanItem.classList.add('bg-success')
} else {
    spanItem.classList.remove('bg-success')
    spanItem.classList.add('bg-danger')
}