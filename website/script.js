document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM que serão utilizados
    const cadastroForm = document.getElementById('cadastroForm');
    const vagasList = document.getElementById('vagas-list');
    const pagination = document.getElementById('pagination');
    const searchTitle = document.getElementById('searchTitle');
    const searchLocation = document.getElementById('searchLocation');
    const searchType = document.getElementById('searchType');

    // Variáveis para controle de paginação de vagas
    const vagasPerPage = 6;
    let currentPage = 1;
    let vagas = [];

    // Função para carregar vagas da API fake
    async function loadVagas() {
        try {
            const response = await fetch('http://localhost:3000/vagas');
            if (!response.ok) {
                throw new Error('Erro ao carregar vagas.');
            }

            vagas = await response.json();
            displayVagas();
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao carregar as vagas.');
        }
    }

    // Função para exibir vagas de acordo com os filtros aplicados
    function displayVagas() {
        const filteredVagas = vagas.filter(vaga => {
            const titleMatch = vaga.title.toLowerCase().includes(searchTitle.value.toLowerCase());
            const locationMatch = vaga.location?.toLowerCase().includes(searchLocation.value.toLowerCase());
            const typeMatch = vaga.type?.toLowerCase().includes(searchType.value.toLowerCase()) || searchType.value === '';

            return titleMatch && locationMatch && typeMatch;
        });

        const start = (currentPage - 1) * vagasPerPage;
        const end = start + vagasPerPage;
        const paginatedVagas = filteredVagas.slice(start, end);

        vagasList.innerHTML = '';
        paginatedVagas.forEach(vaga => {
            const vagaCard = document.createElement('div');
            vagaCard.className = 'vaga-card';
            vagaCard.innerHTML = `
                <div class="vaga-header">
                    <img src="path/to/company/logo.png" alt="${vaga.company} logo" class="company-logo">
                    <div class="vaga-info">
                        <h5 class="vaga-title">${vaga.title}</h5>
                        <p class="vaga-company">${vaga.company}</p>
                        <p class="vaga-location">${vaga.location || ''}</p>
                    </div>
                </div>
                <div class="vaga-footer">
                    <p class="vaga-type">${vaga.type || ''}</p>
                    <p class="vaga-postedAt">${timeAgo(vaga.postedAt)}</p>
                </div>
            `;
            vagasList.appendChild(vagaCard);
        });

        displayPagination(filteredVagas.length);
    }

    // Função para exibir a paginação das vagas
    function displayPagination(totalVagas) {
        const totalPages = Math.ceil(totalVagas / vagasPerPage);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                displayVagas();
            });
            pagination.appendChild(pageItem);
        }
    }

    // Event listeners para os campos de filtro
    searchTitle.addEventListener('input', displayVagas);
    searchLocation.addEventListener('input', displayVagas);
    searchType.addEventListener('change', displayVagas);

    // Carregar vagas ao iniciar a página
    loadVagas();

    // Função para calcular o tempo passado desde a postagem
    function timeAgo(date) {
        const now = new Date();
        const postedDate = new Date(date);
        const seconds = Math.floor((now - postedDate) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
        return Math.floor(seconds) + " seconds ago";
    }

   // Adicionar event listener após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroSubmit);
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('blur', handleCepBlur);
        }
    }
});

// Função para lidar com o envio do formulário de cadastro
async function handleCadastroSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const senha = formData.get('senha'); // Obter a senha do formulário

    // Verificar se a senha atende ao regex
    if (!senhaRegex.test(senha)) {
        const senhaHelp = document.getElementById('senhaHelp');
        senhaHelp.textContent = "A senha deve ter pelo menos 3 caracteres e incluir letras e números";
        senhaHelp.classList.add('text-danger');
        return; // Abortar o envio do formulário se a senha não for válida
    }

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar os dados do cadastro.');
        }

        const user = await response.json();
        console.log('Cadastro realizado com sucesso:', user);
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao realizar o cadastro.');
    }
}

    // Adicionar event listeners aos formulários

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroSubmit);
    }
});

