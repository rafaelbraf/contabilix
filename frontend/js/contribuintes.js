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

const tokenName = 'token';
const tbodyContribuintes = document.getElementById('tbody-contribuintes');
const inputFileContribuinte = document.getElementById('file-upload');
const alertDanger = 'danger';
const alertErro = document.getElementById('alert-erro');
const contribuintes = [];
const modalVerContribuinte = new bootstrap.Modal(document.getElementById('verContribuinteModal'));
const bodyModalVerContribuinte = document.getElementById('verContribuinteModalBody');

preencheContribuintesNaTabela();

async function getContribuintes() {
    const usuario = await getUsuario()

    let mensagemErro;
    const url = 'http://' + HOST_BACKEND + ':8081/api/contribuintes/usuario/' + usuario.id;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem(tokenName)
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                mensagemErro = 'Erro ao buscar Contribuintes: Falha ao verificar token!';
                appendAlert(mensagemErro, alertDanger);
                throw new Error(mensagemErro);
            }
            
            mensagemErro = 'Erro ao buscar Contribuintes.';
            appendAlert(mensagemErro, alertDanger);
            throw new Error(mensagemErro);
        }

        const data = await response.json();

        return data.sort((a, b) => a.nome > b.nome ? 1 : -1);
    } catch (error) {
        mensagemErro = 'Erro ao buscar Contribuintes: ' + error;
        console.error(mensagemErro);
    }
}

async function preencheContribuintesNaTabela() {
    try {
        const contribuintes = await getContribuintes();
        if (!contribuintes) {
            throw new Error('Erro ao buscar Contribuintes');
        }

        for (const contribuinte of contribuintes) {
            const newRow = document.createElement('tr');
            newRow.setAttribute('id', `contribuinte-${contribuinte.id}`);

            const cpfCell = document.createElement('td');
            cpfCell.textContent = contribuinte.cpf;
            newRow.appendChild(cpfCell);

            const nomeCell = document.createElement('td');
            nomeCell.textContent = contribuinte.nome;
            newRow.appendChild(nomeCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = contribuinte.email;
            newRow.appendChild(emailCell);

            const celularCell = document.createElement('td');
            celularCell.textContent = contribuinte.celular;
            newRow.appendChild(celularCell);

            newRow.addEventListener('click', () => {
                exibirDetalhesDoContribuinte(contribuinte);
            });

            tbodyContribuintes.appendChild(newRow);
        }
    } catch (error) {
        appendAlert(error, alertDanger);
    }    
}

inputFileContribuinte.onchange = async function() {
    const usuario = await getUsuario()

    var files = this.files;
    const apenasArquivosXML = Array.from(files).filter(file => file.name.toLowerCase().endsWith('.xml') && file.name.includes('0000000000'));
    
    const dataTransfer = new DataTransfer();
    apenasArquivosXML.forEach(file => dataTransfer.items.add(file));

    this.files = dataTransfer.files;

    for (const file of apenasArquivosXML) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const xmlString = e.target.result;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            const copiaIdentificadorElement = xmlDoc.querySelector('copiaIdentificador');
            const cpf = copiaIdentificadorElement.getAttribute('cpf');
            const nome = copiaIdentificadorElement.getAttribute('nome');

            const contribuinteElement = xmlDoc.querySelector('contribuinte');
            const dataNascimento = contribuinteElement.getAttribute('dataNascimento');
            const email = contribuinteElement.getAttribute('email');
            const celular = contribuinteElement.getAttribute('celular');
            const naturezaOcupacao = contribuinteElement.getAttribute('naturezaOcupacao');
            const ocupacaoPrincipal = contribuinteElement.getAttribute('ocupacaoPrincipal');

            const contribuinte = new Contribuinte(removerMascaraDoCpf(cpf), nome, dataNascimento, email, celular, '', naturezaOcupacao, ocupacaoPrincipal, usuario.id);

            contribuintes.push(contribuinte);
        };

        reader.readAsText(file);
    }
}

function Contribuinte(cpf, nome, dataNascimento, email, celular, endereco, naturezaOcupacao, ocupacaoPrincipal, usuarioId) {
    this.cpf = cpf;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.email = email;
    this.celular = celular;
    this.endereco = endereco;
    this.naturezaOcupacao = naturezaOcupacao;
    this.ocupacaoPrincipal = ocupacaoPrincipal;
    this.usuarioId = usuarioId;
}

async function inserirContribuintes(contribuintes) {
    let mensagemErro;
    const url = 'http://' + HOST_BACKEND + ':8081/api/contribuintes/lista';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem(tokenName)
            },
            body: JSON.stringify(contribuintes)
        }).catch(error => console.error(error));

        if (response.status != 201) {
            console.log(response.body.getReader);
            mensagemErro = 'Não foi possível inserir Contribuintes.';
            appendAlert(mensagemErro, alertDanger);
            throw new Error(mensagemErro);
        }

        location.reload();
    } catch (error) {
        mensagemErro = `Erro ao inserir Contribuintes: ${error}.`;
        appendAlert(mensagemErro, alertDanger);
        console.error(mensagemErro);
    }
}

const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');    
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertErro.append(wrapper);
};

function importarContribuintes() {
    inserirContribuintes(contribuintes);
}

function removerMascaraDoCpf(cpfComMascara) {
    return cpfComMascara.replace(/\D/g, '');
}

async function exibirDetalhesDoContribuinte(contribuinte) {
    const naoInformado = 'Não informado';

    if (!contribuinte.cpf) {
        contribuinte.cpf = naoInformado;
    }

    if (!contribuinte.nome) {
        contribuinte.nome = naoInformado;
    }

    if (!contribuinte.email) {
        contribuinte.email = naoInformado;
    }

    if (!contribuinte.celular) {
        contribuinte.celular = naoInformado;
    }

    bodyModalVerContribuinte.innerHTML = `
        <p><strong>CPF:</strong> ${contribuinte.cpf}</p>
        <p><strong>Nome:</strong> ${contribuinte.nome}</p>
        <p><strong>Email:</strong> ${contribuinte.email}</p>
        <p><strong>Celular:</strong> ${contribuinte.celular}</p>
    `;

    console.log(contribuinte.id);

    const impostosDeRendas = await getImpostosDeRendasDoContribuinte(contribuinte);
    for (const impostoDeRenda of impostosDeRendas) {
        bodyModalVerContribuinte.innerHTML += `
            <p><strong>Impostos de Rendas</strong></p>
            <div class="divider"></div>
            <p><strong>ID: </strong>${impostoDeRenda.id}</p>
            <p><strong>Ano referência: </strong>${impostoDeRenda.ano_referencia}</p>
            <p><strong>Situacao atual: </strong>${impostoDeRenda.situacao_atual}</p>
        `;
    }

    modalVerContribuinte.show();
}

async function getImpostosDeRendasDoContribuinte(contribuinte)  {
    const contribuinteId = contribuinte.id;
    const url = 'http://' + HOST_BACKEND + ':8081/api/impostorenda/contribuinte/' + contribuinteId;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem(tokenName)
            }
        });
        
        if (!response.ok) {
            mensagemErro = 'Erro ao buscar Impostos de Rendas do Contribuinte: ' + contribuinteId;
            appendAlert(mensagemErro, alertDanger);
            throw new Error(mensagemErro);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        mensagemErro = `Erro ao buscar Impostos de Rendas do Contribuinte ${contribuinteId}: ${error}`;
        appendAlert(mensagemErro, alertDanger);
    }
}

async function getUsuario() {
    const url = 'http://' + HOST_BACKEND + ':8081/api/usuarios';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem(tokenName)
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                mensagemErro = 'Erro ao buscar Usuário: Falha ao verificar token!';
                appendAlert(mensagemErro, alertDanger);
                throw new Error(mensagemErro);
            }

            if (response.status === 404) {
                mensagemErro = 'Erro ao buscar Usuário: Usuário não encontrado!';
                appendAlert(mensagemErro, alertDanger);
                throw new Error(mensagemErro);
            }
            
            mensagemErro = 'Erro ao buscar Usuários.';
            appendAlert(mensagemErro, alertDanger);
            throw new Error(mensagemErro);
        }

        const data = await response.json()

        return data
    } catch (error) {
        mensagemErro = 'Erro ao buscar Usuários: ' + error;
        console.error(mensagemErro);
    }
}
