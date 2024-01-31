const alertDanger = 'danger';

function eventEnter(event) {
    if (event.key === 'Enter') {
        const senha = document.getElementById('senha').value;
        if (senha)  {
            login();
        }
    }
}

async function login() {
    let mensagemErro;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        mensagemErro = 'Para fazer login é necessário que email e senha estejam preenchidos.';
        appendAlert(mensagemErro, alertDanger);
        throw new Error(mensagemErro);
    }

    if (!email.includes('@') || !email.includes('.com')) {
        mensagemErro = 'Por favor, informe um email válido!';
        appendAlert(mensagemErro, alertDanger);
        throw new Error(mensagemErro);
    }

    try {
        const response = await fetch('http://3.83.150.252:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            if (response.status == 401) {
                mensagemErro = 'Email ou senha incorretos';
                appendAlert(mensagemErro, alertDanger);
                throw new Error(mensagemErro);                
            } else {
                mensagemErro = 'Erro ao fazer login!';
                appendAlert(mensagemErro, alertDanger);
                throw new Error(mensagemErro);
            }
        }

        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        
        window.location.href = './pages/home.html';
    } catch (error) {
        mensagemErro = `Erro ao fazer login: ${error}.`;
        appendAlert(mensagemErro, alertDanger);
        console.error(mensagemErro);
    }
}

const alertEmailOuSenhaIncorretos = document.getElementById('alert-erro');
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');    
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertEmailOuSenhaIncorretos.append(wrapper);
};
