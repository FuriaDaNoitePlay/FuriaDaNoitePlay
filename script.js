// Alternar entre seções
function mostrarSecao(id) {
  document.querySelectorAll('.secao').forEach(secao => secao.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

// Alternar abas dentro do campeonato
function mostrarAba(aba) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  document.getElementById(aba).classList.add('ativa');
}
