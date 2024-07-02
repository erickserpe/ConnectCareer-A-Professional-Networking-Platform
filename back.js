
// função para cadastro

async function handleCadastroSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const senha = formData.get('senha'); 
    const nomeCivil = formData.get('nomeCivil');
    const dataNascimento = formData.get('dataNascimento');
    const cep = formData.get('cep');
    const logradouro = formData.get('logradouro');
    const numero = formData.get('numero');
    const complemento = formData.get('complemento');
    const bairro = formData.get('bairro');
    const cidade = formData.get('cidade');
    const estado = formData.get('estado');
    const tipoUsuario = formData.get('tipoUsuario');
    

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify({ email, senha, nomeCivil, dataNascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, tipoUsuario }), 
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas.');
        }

        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        alert('Cadastro bem-sucedido!');
        window.location.href = 'http://127.0.0.1:5500/website/vagas.html'; // Redireciona para página de vagas
    } catch (error) {
        console.error(error);
        alert('Erro');
    }
}


// Adicionar event listeners após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm')  

    if (cadastroForm) {
        cadastroForm.addEventListener('submit',handleCadastroSubmit);
    }
})
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', function() {
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cep.length !== 8) {
            alert('CEP deve ter exatamente 8 dígitos numéricos');
            return; // CEP deve ter exatamente 8 dígitos numéricos
        }

        const url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar CEP');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                } else {
                    console.log(data); // Adicionado para depuração
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP');
            });
    });
});
