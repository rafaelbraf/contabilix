const tabelaImpostosDeRendas = document.getElementById('tbody-impostos-renda');
const buttonInserirImpostoDeRenda = document.getElementById('btnIniciarImpostoDeRenda');
const modalInserirImpostoDeRenda = new bootstrap.Modal(document.getElementById('iniciarImpostoDeRendaModal'));
const selectContribuinte = document.getElementById('selectContribuinte');
const alertErro = document.getElementById('alert-erro');
const alertSuccessImpostoDeRenda = document.getElementById('alert-sucess-imposto-renda');
const alertDanger = 'danger';
const alertSucess = 'success';

preencheTabelaDeImpostosDeRendas();

buttonInserirImpostoDeRenda.addEventListener('click', () => {
    modalInserirImpostoDeRenda.show();

    getContribuintes();
});

async function getContribuintes() {
    const url = 'http://54.160.250.66:8081/api/contribuintes';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }

        return response.json();
    }).then(data => {
        selectContribuinte.innerHTML = '';

        const opcaoPadrao = document.createElement('option');
        opcaoPadrao.text = '--';
        selectContribuinte.add(opcaoPadrao);

        // Ordena os Contribuintes pelo Nome
        data.sort((a, b) => (a.nome > b.nome) ? 1 : -1);

        data.forEach(item => {
            const opcao = document.createElement('option');
            opcao.value = item.id;
            opcao.text = item.cpf + ' - ' + item.nome;

            selectContribuinte.add(opcao);
        });
    }).catch(error => {
        console.error(`Erro na requisição: ${error.message}`);
    });
}

async function iniciarImpostoDeRenda() {
    const contribuinteSelecionado = selectContribuinte.value;
    const anoReferencia = document.getElementById('anoReferenciaImpostoDeRenda').value;

    if (contribuinteSelecionado === '--') {
        appendAlert('Para continuar selecione um Contribuinte.', alertDanger);
    } else if (anoReferencia.length != 4) {
        appendAlert('Informe um ano de referência válido.', alertDanger);
    } else {
        modalInserirImpostoDeRenda.hide();

        const url = 'http://54.160.250.66:8081/api/impostorenda';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(new ImpostoDeRenda(contribuinteSelecionado, anoReferencia))
        }).then(response => {
            if (response.status != 201) {
                throw new Error(`Erro ao tentar iniciar Imposto de Renda: ${response.status} - ${response.statusText}`);
            }

            location.reload();

            return response.json();
        }).catch(error => {
            appendAlert(`Erro ao iniciar Imposto de Renda ${error}`, alertDanger);
            console.error(`Erro ao inicar Imposto de Renda: ${error}`);
        });
    }
}

async function getImpostosDeRendas() {
    const url = 'http://18.208.190.47:8081/api/impostorenda';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
}

async function preencheTabelaDeImpostosDeRendas() {
    try {
        const impostosDeRendas = await getImpostosDeRendas();
        if (!impostosDeRendas) {
            throw new Error('Erro ao buscar Contribuintes');
        }

        for (const impostoDeRenda of impostosDeRendas) {
            const newRow = document.createElement('tr');
            newRow.setAttribute('id', `imposto-renda-${impostoDeRenda.id}`);

            const impostoDeRendaIdCell = document.createElement('td');
            impostoDeRendaIdCell.textContent = impostoDeRenda.id;
            newRow.appendChild(impostoDeRendaIdCell);

            const situacaoAtualCell = document.createElement('td');
            situacaoAtualCell.textContent = impostoDeRenda.situacaoAtual;
            newRow.appendChild(situacaoAtualCell);

            const anoReferenciaCell = document.createElement('td');
            anoReferenciaCell.textContent = impostoDeRenda.anoReferencia;
            newRow.appendChild(anoReferenciaCell);

            const contribuinteIdCell = document.createElement('td');
            contribuinteIdCell.textContent = impostoDeRenda.contribuinteId;
            newRow.appendChild(contribuinteIdCell);

            tabelaImpostosDeRendas.appendChild(newRow);
        }
    } catch (error) {
        appendAlert(error, alertDanger);
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

const appendAlertSuccess = (message, type) => {
    const wrapper = document.createElement('div');    
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertSuccessImpostoDeRenda.append(wrapper);
};

function ImpostoDeRenda(contribuinteId, anoReferencia) {
    this.contribuinteId = contribuinteId;
    this.anoReferencia = anoReferencia;
}