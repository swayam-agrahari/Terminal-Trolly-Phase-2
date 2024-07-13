const terminalOutput = document.querySelector('.terminal-output');
const terminalInput = document.querySelector('input[type="text"]');
const productList = document.getElementById('product-list');

const cart = [];
let products = [];

// Fetch products from Fake Store API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        products = data;
        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        terminalOutput.innerHTML = 'Error fetching products. Please try again later.';
    }
}

function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach((product, index) => {
        // Determine which class to apply based on index
        const colorClass = `article-color-${(index % 3) + 1}`; // Adjust '3' based on the number of colors/classes defined
        const truncatedTitle = product.title.length > 50 ? `${product.title.substring(0, 50)}...` : product.title;

        const productCard = `
        <article class="card ${colorClass}">
            <div class="card__img" id="img${index + 1}">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="card__name" id="title${index + 1}">
                <p>${truncatedTitle}</p>
            </div>
            <div class="card__precis">
                <a href="" class="card__icon"><ion-icon name="heart-outline"></ion-icon></a>
                <div>
                    <span class="card__preci card__preci--before">$${(product.price * 1.2).toFixed(2)}</span>
                    <span class="card__preci card__preci--now">$${product.price.toFixed(2)}</span>
                </div>
                <a href="" class="card__icon"><ion-icon name="cart-outline"></ion-icon></a>
            </div>
        </article>`;

        productList.innerHTML += productCard;
    });
}

function handleInput(command) {
    const words = command.trim().split(' ');
    const action = words[0];
    terminalOutput.innerHTML = `<div id="terminal__prompt">            
                                    <span id="terminal__prompt--user">user@ubuntu:</span>            
                                    <span id="terminal__prompt--location">~</span>            
                                    <span id="terminal__prompt--bling">$</span>  
                                    <span> ${command}</span>          
                                </div>`;

    switch (action) {
        case 'list':
            listProducts();
            break;
        case 'details':
            const pId = parseInt(words[1]);
            detailsPage(pId);
            break;
        case 'add':
            const productId = parseInt(words[1]);
            addToCart(productId);
            break;
        case 'remove':
            const removeId = parseInt(words[1]);
            removeFromCart(removeId);
            break;
        case 'cart':
            viewCart();
            break;
        case 'buy':
            buyCart();
            break;
        case 'search':
            const query = words.slice(1).join(' ');
            searchProducts(query);
            break;
        case 'sort':
            const sortBy = words[1];
            sortProducts(sortBy);
            break;
        case 'help':
            viewCommand();
            break;
        case 'clear':
            clearScreen();
            break;
        default:
            terminalOutput.innerHTML += `Invalid command: ${command}\nType help to see all commands.`;
            break;
    }

    terminalInput.value = '';
}

function viewCommand() {
    terminalOutput.innerHTML += "Available Commands:<br>" +
        "- list: List all products<br>" +
        "- details [product_id]: View product details<br>" +
        "- add [product_id]: Add a product to cart<br>" +
        "- remove [product_id]: Remove a product from cart<br>" +
        "- cart: View your cart<br>" +
        "- buy: Buy all products in the cart<br>" +
        "- search [query]: Search products by name<br>" +
        "- sort [price|name]: Sort products by price or name<br>" +
        "- clear: Clear the screen";
}

function listProducts() {
    if (products.length === 0) {
        terminalOutput.innerHTML += 'No products found.\n';
    } else {
        terminalOutput.innerHTML += 'Available Products:\n';
        products.forEach((product, index) => {
            terminalOutput.innerHTML += `${index + 1}. ${product.title} - $${product.price.toFixed(2)}\n`;
        });
    }
}

function detailsPage(productId) {
    const product = products[productId - 1];
    if (product) {
        terminalOutput.innerHTML += `Product Details:\n` +
            `Name: ${product.title}\n` +
            `Price: $${product.price.toFixed(2)}\n` +
            `Description: ${product.description}\n`;
    } else {
        terminalOutput.innerHTML += `Product not found with ID: ${productId}\n`;
    }
}

function addToCart(productId) {
    const product = products[productId - 1];
    if (product) {
        cart.push(product);
        terminalOutput.innerHTML += `${product.title} added to cart.\n`;
    } else {
        terminalOutput.innerHTML += `Product not found with ID: ${productId}\n`;
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex((item, index) => index + 1 === productId);
    if (index !== -1) {
        const removedProduct = cart.splice(index, 1)[0];
        terminalOutput.innerHTML += `${removedProduct.title} removed from cart.\n`;
    } else {
        terminalOutput.innerHTML += `Product not found in cart with ID: ${productId}\n`;
    }
}

function viewCart() {
    if (cart.length === 0) {
        terminalOutput.innerHTML += 'Your cart is empty.\n';
    } else {
        terminalOutput.innerHTML += 'Your Cart:\n';
        cart.forEach((product, index) => {
            terminalOutput.innerHTML += `${index + 1}. ${product.title} - $${product.price.toFixed(2)}\n`;
        });
    }
}

function buyCart() {
    if (cart.length === 0) {
        terminalOutput.innerHTML += 'Your cart is empty.\n';
    } else {
        const total = cart.reduce((sum, product) => sum + product.price, 0);
        terminalOutput.innerHTML += `Purchased ${cart.length} items for $${total.toFixed(2)}.\n`;
        cart.length = 0; // Clear the cart
    }
}

function searchProducts(query) {
    const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
        terminalOutput.innerHTML += 'No products found matching your search.\n';
    } else {
        terminalOutput.innerHTML += 'Search Results:\n';
        results.forEach((product, index) => {
            terminalOutput.innerHTML += `${index + 1}. ${product.title} - $${product.price.toFixed(2)}\n`;
        });
    }
}

function sortProducts(sortBy) {
    let sortedProducts;
    switch (sortBy) {
        case 'price':
            sortedProducts = products.slice().sort((a, b) => a.price - b.price);
            displaySortedProducts(sortedProducts);
            break;
        case 'name':
            sortedProducts = products.slice().sort((a, b) => a.title.localeCompare(b.title));
            displaySortedProducts(sortedProducts);
            break;
        default:
            terminalOutput.innerHTML += 'Invalid sort command. Use "price" or "name".\n';
            break;
    }
}

function displaySortedProducts(sortedProducts) {
    productList.innerHTML = '';
    sortedProducts.forEach((product, index) => {
        // Determine which class to apply based on index
        const colorClass = `article-color-${(index % 3) + 1}`; // Adjust '3' based on the number of colors/classes defined
        const truncatedTitle = product.title.length > 50 ? `${product.title.substring(0, 50)}...` : product.title;

        const productCard = `
        <article class="card ${colorClass}">
            <div class="card__img" id="img${index + 1}">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="card__name" id="title${index + 1}">
                <p>${truncatedTitle}</p>
            </div>
            <div class="card__precis">
                <a href="" class="card__icon"><ion-icon name="heart-outline"></ion-icon></a>
                <div>
                    <span class="card__preci card__preci--before">$${(product.price * 1.2).toFixed(2)}</span>
                    <span class="card__preci card__preci--now">$${product.price.toFixed(2)}</span>
                </div>
                <a href="" class="card__icon"><ion-icon name="cart-outline"></ion-icon></a>
            </div>
        </article>`;

        productList.innerHTML += productCard;
    });
}

function clearScreen() {
    terminalOutput.innerHTML = '';
}

terminalInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const command = terminalInput.value;
        handleInput(command);
    }
});

fetchProducts();
