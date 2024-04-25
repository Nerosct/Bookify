function menuShow() { /* função para mostrar ou esconder o menu móvel */
    let menuMobile = document.querySelector('.mobile-menu');
    let menuIcon = document.querySelector('.mobile-menu-icon img');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        menuIcon.src = "assets/img/menu_white_36dp.svg";
    } else {
        menuMobile.classList.add('open');
        menuIcon.src = "assets/img/x-thin-svgrepo-com.svg";
    }
}

function toggleMode() { // função que ativa ou desativa o darkmode
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    body.classList.toggle('dark-mode'); // altera a classe dark mode no corpo do documento
    
    // verifica se o modo escuro está ativado e ajusta os ícones correspondentes
    if (body.classList.contains('dark-mode')) {
        sunIcon.classList.add('hidden'); 
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// função que carrega o estado do modo escuro ao carregar a página
function loadDarkMode() { 
    // verifica se o modo escuro estava ativado anteriormente
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    // aplica o modo escuro se estava ativado anteriormente
    if (isDarkMode) {
        body.classList.add('dark-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

window.onload = loadDarkMode; // carrega o modo escuro ao carregar a página

// arranjo contendo informações sobre os livros em destaque na página inicial
const homepagefeatured = [ // função que exibe os 3 livros "mais lidos"
    {
        id: 1,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        description: "Essencial para desenvolvedores que aspiram à excelência, oferece princípios práticos para escrever códigos limpos e sustentáveis.",
        imageUrl: "assets/img/CleanCode.jpg"
    },
    {
        id: 2,
        title: "The Pragmatic Programmer: Your Journey To Mastery",
        description: "Um guia clássico com dicas práticas para melhorar a eficiência no desenvolvimento e criar código mais compreensível.",
        imageUrl: "assets/img/ThePragmaticProgrammer.jpg"
    },
    {
        id: 3,
        title: "Refactoring: Improving the Design of Existing Code",
        description: "Fundamental para entender como melhorar o design de um código existente, tornando-o mais limpo e sustentável.",
        imageUrl: "assets/img/Refactoring.jpg"
    }
];
// evento que é acionado quando o DOM é carregado
document.addEventListener("DOMContentLoaded", function() { 

    const homepageFeaturedContainer = document.getElementById('homepage-featured');

    if (homepageFeaturedContainer) {
        // adiciona os livros em destaque à página inicial
        const booksContainer = homepageFeaturedContainer.querySelector('.row');
        homepagefeatured.forEach(book => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            colDiv.innerHTML = `
                <div class="card">
                    <img src="${book.imageUrl}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.description}</p>
                        <button type="button" class="btn btn-dark btn-block view-details" data-id="${book.id}" data-title="${book.title}" data-description="${book.description}">Ver detalhes</button>
                    </div>
                </div>
            `;
            booksContainer.appendChild(colDiv);
        });

        const detailButtons = booksContainer.querySelectorAll('.view-details');
        detailButtons.forEach(button => {
            // adiciona um ouvinte de evento para mostrar os detalhes do livro quando o botão é clicado
            button.addEventListener('click', function() {
                const bookTitle = this.getAttribute('data-title');
                const bookDescription = this.getAttribute('data-description');
                const modalTitle = document.querySelector('#bookDetailModal .modal-title');
                const modalDescription = document.querySelector('#bookDetailModal .modal-body p');

                modalTitle.textContent = bookTitle;
                modalDescription.textContent = bookDescription;

                $('#bookDetailModal').modal('show'); // mostra o modal com os detalhes do livro
            });
        });
    }
});
// função para adicionar um livro ao armazenamento local
function addBookToStorage(book) {
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    livros.push(book);
    localStorage.setItem('livros', JSON.stringify(livros));
}
// função para redefinir um formulário e notificar o usuário
function resetFormAndNotify(formId, message) {
    document.getElementById(formId).reset(); // Redefine o formulário com o ID especificado
    alert(message); // exibe uma mensagem de alerta ao usuário
}

document.addEventListener('DOMContentLoaded', function() {
    const booksContainer = document.querySelector('.featured-books .container .row');
    const bookList = document.querySelector('.book-list');
    const livros = JSON.parse(localStorage.getItem('livros')) || [];
    // Para cada livro na lista, cria o html correspondente e adiciona ao contêiner de livros ou à lista de livros
    livros.forEach((livro, index) => {
        const bookHtml = `
            <div class="card" data-index="${index}">
                <div class="card-body">
                    <h5 class="card-title">${livro.titulo}</h5>
                    <p class="card-text">${livro.autor} - ${livro.genero}</p>
                    <p class="status ${livro.emprestado ? 'status-unavailable' : 'status-available'}">${livro.emprestado ? 'Emprestado' : 'Disponível'}</p>
                    <button class="btn btn-dark view-details">Ver Detalhes</button>
                    ${livro.emprestado ? '<button class="btn btn-warning return-book">Devolver</button>' : ''}
                    <button class="btn btn-danger delete-book">Excluir</button>
                </div>
            </div>
        `;
        if (booksContainer) booksContainer.innerHTML += bookHtml;
        if (bookList) bookList.innerHTML += bookHtml;
    });
    // adiciona os ouvintes de evento para os botões de "Devolver, "Excluir" e "Ver Detalhes" de cada livro
        document.querySelectorAll('.return-book').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.closest('.card').getAttribute('data-index');
                returnBook(index);
            });
        });
    
        function returnBook(index) {
            let livros = JSON.parse(localStorage.getItem('livros')) || [];
            livros[index].emprestado = false;
            localStorage.setItem('livros', JSON.stringify(livros));
            location.reload();
        }
    

    document.querySelectorAll('.delete-book').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.closest('.card').getAttribute('data-index');
            removeBook(index);
        });
    });
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.closest('.card').getAttribute('data-index');
            viewDetails(index);
        });
    });
});
// função para remover um livro do armazenamento local
function removeBook(index) {
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    livros.splice(index, 1);
    localStorage.setItem('livros', JSON.stringify(livros));
    location.reload();
} 
// função para exibir os detalhes de um livro
function viewDetails(index) {
    const livro = JSON.parse(localStorage.getItem('livros'))[index];
    alert(`Título: ${livro.titulo}\nAutor: ${livro.autor}\nGênero: ${livro.genero}\nStatus: ${livro.emprestado ? 'Emprestado' : 'Disponível'}`);
}
// Evento que é acionado quando o formulário de cadastro de livro é enviado
document.getElementById('cadastroLivroForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    let titulo = document.getElementById('titulo').value;
    let autor = document.getElementById('autor').value;
    let genero = document.getElementById('genero').value;

    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    livros.push({ titulo, autor, genero, emprestado: false });
    localStorage.setItem('livros', JSON.stringify(livros));

    alert('Cadastro realizado com sucesso!');
    this.reset();
});
// Evento que é acionado quando o formulário de empréstimo de livro é enviado
document.getElementById('emprestimoLivroForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    let tituloSolicitado = document.getElementById('titulo').value;
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    // procura o livro solicitado
    let livroEncontrado = livros.find(livro => livro.titulo.toLowerCase() === tituloSolicitado.toLowerCase());
    // verifica se o livro foi encontrado e não está emprestado
    if (livroEncontrado && !livroEncontrado.emprestado) {
        livroEncontrado.emprestado = true;
        localStorage.setItem('livros', JSON.stringify(livros));
        alert('Empréstimo realizado com sucesso!');
    } else {
        alert('Livro não disponível para empréstimo!');
    }
});

var link = document.createElement('link');
link.type = 'image/svg+xml';
link.rel = 'icon';
link.href = 'data:image/svg+xml,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<style type="text/css">text{font-family: "Courier New", monospace;}</style>' +
    '<text y=".9em" font-size="90">B</text></svg>');
document.getElementsByTagName('head')[0].appendChild(link);
