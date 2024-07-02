// Função para enviar dados do formulário de currículo
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

// Função para processar login
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const senha = formData.get('senha'); // Nome do campo mudado para "senha"

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify({ email, senha }), // Enviando email e senha
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

// Adicionar event listeners após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    const curriculoForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');

    if (curriculoForm) {
        curriculoForm.addEventListener('submit', handleCurriculoSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
});
