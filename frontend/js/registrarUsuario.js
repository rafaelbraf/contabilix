const loadEnv = async () => {
    const response = await fetch('.env');
    const envText = await response.text();
    const envLines = envText.split('\n');

    for (const line in envLines) {
        const [key, value] = line.split('=');
        if (key && value) {
            window[key.trim()] = value.trim();
        }
    }
};

loadEnv();

const alertDanger = 'danger';
const alertSuccess = 'success';

async function cadastrar() {
    let mensagemErro;

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        mensagemErro = 'Para se cadastrar é necessário que email e senha estejam preenchidos.';
        appendAlert(mensagemErro, alertDanger);
        throw new Error(mensagemErro);
    }

    if (!email.includes('@') || !email.includes('.com')) {
        mensagemErro = 'Por favor, informe um email válido!';
        appendAlert(mensagemErro, alertDanger);
        throw new Error(mensagemErro);
    }

    if (senha.length < 6) {
        mensagemErro = 'Senha precisa ter mais que 6 caracteres';
        appendAlert(mensagemErro, alertDanger);
        throw new Error(mensagemErro);
    }

    try {
        const response = await fetch('http://' + HOST_BACKEND + ':8081/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.status != 201) {
            mensagemErro = 'Erro ao cadastrar usuário!';
            appendAlert(mensagemErro, alertDanger);
            throw new Error(mensagemErro);
        }

        const mensagemSucesso = 'Usuário cadastrado com sucesso!';
        appendAlert(mensagemSucesso, alertSuccess);

        window.location.href = '../index.html';
    } catch (error) {
        mensagemErro = `Erro ao cadastrar usuário: ${error}.`;
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