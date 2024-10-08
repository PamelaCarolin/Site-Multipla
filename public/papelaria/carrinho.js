$(document).ready(function () {
    // Como o login não é mais obrigatório, removemos a verificação de login
    // Função para obter o ID do usuário (caso precise implementar lógica de admin mais tarde)
    function getUserId() {
        // Pode adicionar lógica para verificar se é administrador, se necessário
        return localStorage.getItem('userId');
    }

    const userId = getUserId();
    // Excluímos o redirecionamento de login aqui

    renderCart();

    function renderCart() {
        // Fazendo requisição para buscar os produtos no carrinho a partir do banco de dados
        $.ajax({
            url: `/order/cart/${userId}`,
            method: 'GET',
            success: function (cart) {
                console.log('Carrinho renderizado:', cart);
                const cartContainer = $('#cartItems');
                cartContainer.empty();

                if (cart.length === 0) {
                    cartContainer.append('<p>Seu carrinho está vazio.</p>');
                    return;
                }

                cart.forEach(product => {
                    const cartItem = `
                        <div class="cart-item">
                            <h3>${product.produto}</h3>
                            <p>${product.categoria}</p>
                            <div class="quantity-wrapper">
                                <p>Quantidade: <input type="number" class="quantity" data-id="${product.id}" value="${product.quantidade}" min="1" max="3"></p>
                            </div>
                            <button class="remove-from-cart" data-id="${product.id}">Remover</button>
                        </div>
                    `;
                    cartContainer.append(cartItem);
                });

                // Atualizar quantidade
                $('.quantity').on('change', function () {
                    const id = $(this).data('id');
                    let newQuantity = parseInt($(this).val());

                    if (newQuantity > 3) {
                        alert('Você não pode adicionar mais de 3 unidades deste produto.');
                        newQuantity = 3;
                        $(this).val(3);
                    } else if (newQuantity < 1) {
                        newQuantity = 1;
                        $(this).val(1);
                    }

                    updateCartItemQuantity(id, newQuantity);
                });

                // Remover item
                $('.remove-from-cart').on('click', function () {
                    const id = $(this).data('id');
                    removeCartItem(id);
                });
            },
            error: function (error) {
                console.error('Erro ao carregar o carrinho:', error);
            }
        });
    }

    function updateCartItemQuantity(id, quantity) {
        $.ajax({
            url: '/order/update-quantity',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id, quantity }),
            success: function () {
                renderCart();
            },
            error: function (error) {
                console.error('Erro ao atualizar a quantidade do item:', error);
            }
        });
    }

    function removeCartItem(id) {
        $.ajax({
            url: '/order/remove-item',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
            success: function () {
                renderCart();
            },
            error: function (error) {
                console.error('Erro ao remover o item do carrinho:', error);
            }
        });
    }

    $('#confirmOrderBtn').on('click', function () {
        $.ajax({
            url: '/order/confirm',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userId }), // O userId pode ser opcional
            success: function () {
                alert('Pedido confirmado! Será enviado para sua conta.');
                renderCart();
            },
            error: function (error) {
                console.error('Erro ao confirmar o pedido:', error);
            }
        });
    });
});
