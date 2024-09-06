$(document).ready(function () {
    let allProducts = []; // Variável global para armazenar os produtos

    // Função para obter o ID do usuário logado
    function getUserId() {
        return localStorage.getItem('userId');
    }

    const userId = getUserId();
    if (!userId) {
        alert('Você precisa estar logado para adicionar produtos ao carrinho.');
        window.location.href = 'http://192.168.0.123:3001/logar/login.html'; // Redireciona para a página de login se o usuário não estiver logado
        return;
    }

    // Toggle do menu para mobile
    $('.menu-toggle').on('click', function () {
        $('.nav ul').toggleClass('active');
    });

    // Função para carregar os produtos a partir do arquivo Excel
    function loadProducts() {
        $.ajax({
            url: './produtos/Papelaria_produto.xlsx',
            method: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const products = XLSX.utils.sheet_to_json(firstSheet);

                    console.log(products); // Debug: Exibir produtos no console

                    allProducts = products; // Armazenar produtos na variável global
                    renderProducts('all', products); // Renderiza os produtos
                };
                reader.readAsArrayBuffer(data); // Lê o arquivo Excel
            },
            error: function (error) {
                console.error('Erro ao carregar os produtos:', error);
            }
        });
    }

    // Função para renderizar os produtos no HTML
    function renderProducts(filter, products) {
        const container = $('#productContainer');
        container.empty(); // Limpa o container
        const filteredProducts = products.filter(product => filter === 'all' || product.Categoria === filter);
        
        if (filteredProducts.length === 0) {
            container.append('<p>Produto não encontrado</p>');
        } else {
            filteredProducts.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="default.jpg" alt="${product.Produto}">
                        <h3>${product.Produto}</h3>
                        <p>${product.Categoria}</p>
                        <button class="add-to-cart" data-id="${product.Produto}" data-category="${product.Categoria}">Adicionar ao Carrinho</button>
                    </div>
                `;
                container.append(productCard);
            });
        }
    }

    // Carregar produtos assim que a página é carregada
    loadProducts();

    // Filtro de produtos por categoria
    $('.filter-item').on('click', function () {
        const filter = $(this).data('filter');
        renderProducts(filter, allProducts); // Usar a lista global de produtos
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    });

    // Pesquisa de produtos
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        const searchTerm = $('#searchInput').val().toLowerCase();
        const filteredProducts = allProducts.filter(product => product.Produto.toLowerCase().includes(searchTerm));
        renderProducts('all', filteredProducts); // Renderiza os produtos filtrados
    });

    // Adicionar produto ao carrinho
    $(document).on('click', '.add-to-cart', function () {
        const id = $(this).data('id');
        const category = $(this).data('category');
        const product = allProducts.find(p => p.Produto === id);

        // Faz requisição para adicionar o produto ao carrinho
        $.ajax({
            url: '/order/add-to-cart',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                userId: userId,
                produto: product.Produto,
                categoria: product.Categoria,
                quantidade: 1
            }),
            success: function (response) {
                if (response.success) {
                    console.log('Produto adicionado ao carrinho:', { Produto: product.Produto, Categoria: category, quantidade: 1 });
                    showPopup('Adicionado ao carrinho');
                } else {
                    alert('Erro ao adicionar o produto ao carrinho.');
                }
            },
            error: function (error) {
                console.error('Erro ao adicionar o produto ao carrinho:', error);
            }
        });
    });

    // Função para mostrar o popup de confirmação
    function showPopup(message) {
        const popup = $('<div class="popup"></div>').text(message);
        $('body').append(popup);
        popup.fadeIn(400).delay(1500).fadeOut(400, function() {
            $(this).remove();
        });
    }
});
