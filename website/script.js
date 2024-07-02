document.addEventListener('DOMContentLoaded', () => {
    const curriculoForm = document.getElementById('curriculoForm');
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const perfilContent = document.getElementById('perfilContent');
    const user = JSON.parse(localStorage.getItem('user'));

    if (curriculoForm) {
        curriculoForm.addEventListener('submit', handleCurriculoSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroSubmit);
    }

    const vagasPerPage = 6;
    let currentPage = 1;
    let vagas = [];

    const vagasList = document.getElementById('vagas-list');
    const pagination = document.getElementById('pagination');
    const searchTitle = document.getElementById('searchTitle');
    const searchLocation = document.getElementById('searchLocation');
    const searchType = document.getElementById('searchType');

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

    // Função para exibir vagas
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

    // Função para exibir paginação
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

    // Event listeners para filtros
    searchTitle.addEventListener('input', displayVagas);
    searchLocation.addEventListener('input', displayVagas);
    searchType.addEventListener('change', displayVagas);

    // Carregar vagas ao iniciar
    loadVagas();

    // Carregar perfil se usuário estiver autenticado
    if (user) {
        loadPerfil(user.id);
    } else {
        // Redirecionar para página de login se não estiver autenticado
        window.location.href = 'login.html';
    }

    async function loadPerfil(userId) {
        try {
            // Simulando carregamento de dados do perfil e do currículo da API
            const perfilResponse = await fetch(`http://localhost:3000/users/${userId}`);
            const perfilData = await perfilResponse.json();

            const curriculoResponse = await fetch(`http://localhost:3000/resumes/${userId}`);
            const curriculoData = await curriculoResponse.json();

            // Construir o HTML para exibir os dados do perfil e do currículo
            const perfilHTML = `
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nome" value="${perfilData.nome || ''}" disabled>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" value="${perfilData.email || ''}" disabled>
                </div>
                <div class="mb-3">
                    <label for="telefone" class="form-label">Telefone</label>
                    <input type="text" class="form-control" id="telefone" value="${perfilData.telefone || ''}" disabled>
                </div>
                <div class="mb-3">
                    <label for="endereco" class="form-label">Endereço</label>
                    <input type="text" class="form-control" id="endereco" value="${perfilData.endereco || ''}" disabled>
                </div>
                <div class="mb-3">
                    <label for="experiencia" class="form-label">Experiência Profissional</label>
                    <textarea class="form-control" id="experiencia" rows="4" disabled>${curriculoData.experienciaProfissional || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label for="formacao" class="form-label">Formação Acadêmica</label>
                    <textarea class="form-control" id="formacao" rows="4" disabled>${curriculoData.formacaoAcademica || ''}</textarea>
                </div>
            `;

            perfilContent.innerHTML = perfilHTML;
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            alert('Ocorreu um erro ao carregar o perfil.');
        }
    }

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

    async function handleCurriculoSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('http://localhost:3000/resumes', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar os dados do currículo.');
            }

            const result = await response.json();
            console.log('Currículo enviado com sucesso:', result);
            alert('Currículo enviado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao enviar o currículo.');
        }
    }

    const app = {
        tipoUsuario: async function handleLoginSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
    
            const email = formData.get('email');
            const senha = formData.get('senha');
    
            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    body: JSON.stringify({ email, senha }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Credenciais inválidas.');
                }
    
                const user = await response.json();
                localStorage.setItem('user', JSON.stringify(user));
                alert('Login bem-sucedido!');
                window.location.href = 'http://127.0.0.1:5500/website/vagas.html';
            } catch (error) {
                console.error(error);
                alert('Email ou senha incorretos.');
            }
        }
    };

    async function handleCadastroSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('http://localhost:3000/cadastros', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar os dados do cadastro.');
            }

            const result = await response.json();
            console.log('Cadastro realizado com sucesso:', result);
            alert('Cadastro realizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao realizar o cadastro.');
        }
    }
});
