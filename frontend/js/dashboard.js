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
    const url = 'http://localhost:8081/api/contribuintes';

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
    const url = 'http://localhost:8081/api/impostorenda';

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
