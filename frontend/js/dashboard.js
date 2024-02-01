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

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const totalContribuintes = await getTotalContribuintes();
        const totalImpostosRenda = await getTotalImpostosRenda();

        document.getElementById('totalContribuintes').textContent = totalContribuintes;
        document.getElementById('totalImpostosRenda').textContent = totalImpostosRenda;
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
});

async function getTotalContribuintes() {
    const url = 'http://' + HOST_BACKEND + ':8081/api/contribuintes';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    return data.length;
}

async function getTotalImpostosRenda() {    
    const url = 'http://' + HOST_BACKEND + ':8081/api/impostorenda';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    return data.length;
}
