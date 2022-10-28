const c = function(el){
    return document.querySelector(el);
}

const cs = function(el){
    return document.querySelectorAll(el);
}

let modalqt = 1;
let cart = [];
let modalkey = 0;

pizzaJson.map(function(item, index){
   let pizzaitem = c('.models .pizza-item').cloneNode(true);

   pizzaitem.setAttribute('data-key', index);
   pizzaitem.querySelector('.pizza-item .pizza-item--img img').src = item.img;
   pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
   pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
   pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;
   pizzaitem.querySelector('a').addEventListener('click', function(e){
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalqt = 1;
        modalkey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach(function(size, sizeIndex){
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

            ;
        });

        c('.pizzaInfo--qt').innerHTML = modalqt;  

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(function(){
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
   });



   c('.pizza-area').append( pizzaitem );
});

function closeModal(){
    
        c('.pizzaWindowArea').style.opacity = 0;
        
        setTimeout(function(){
            c('.pizzaWindowArea').style.display = 'none';
        }, 500);
}
    

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', function(){
    modalqt--;
    if(modalqt <= 1){
        modalqt = 1;
        c('.pizzaInfo--qt').innerHTML = modalqt;       
    }
    else{
        c('.pizzaInfo--qt').innerHTML = modalqt;
    }
    
})

c('.pizzaInfo--qtmais').addEventListener('click', function(){
    modalqt++;
    c('.pizzaInfo--qt').innerHTML = modalqt;
})

cs('.pizzaInfo--size').forEach(function(size, sizeIndex){
    size.addEventListener('click', function(e){
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        
    })
});

c('.pizzaInfo--addButton').addEventListener('click', function(){
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identidficador = pizzaJson[modalkey].id + '@' + size;

    let key = cart.findIndex(function(item){
        return item.identidficador == identidficador;
    });

    if(key > -1){
        cart[key].qt += modalqt;
    }
    else{
        cart.push({
            identidficador,
            id: pizzaJson[modalkey].id,
            sizess: size,
            qt: modalqt
        });
    }

    updateCart();
    closeModal();
});

function updateCart(){
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){

            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id;
            });

            subtotal = subtotal + pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].sizess){
                case 0: 
                    pizzaSizeName = 'P';
                break;

                case 1: 
                    pizzaSizeName = 'M';
                break;

                case 2: 
                    pizzaSizeName = 'G';
                break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', function(){
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }
                else{
                    cart.splice(i, 1);
                }   
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', function(){
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    }
    else{
        c('aside').classList.remove('show');
    }
}