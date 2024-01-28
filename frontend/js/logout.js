const botaoSair = document.getElementById('btnSair');
const botaoConfirmarSair = document.getElementById('btnConfirmarSair');
const modalConfirmacaoSair = new bootstrap.Modal(document.getElementById('confirmacaoSairModal'));

botaoSair.addEventListener('click', () => {
   modalConfirmacaoSair.show();
});

botaoConfirmarSair.addEventListener('click', () => {
   localStorage.clear();
   location.reload();
});