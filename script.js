document.addEventListener('DOMContentLoaded', () => {
  const tipoLogin = document.getElementById('tipoLogin');
  const senha = document.getElementById('senha');
  const entrarBtn = document.getElementById('entrarBtn');
  const cadastroBtn = document.getElementById('cadastroBtn');

  // Quando muda o tipo de login
  tipoLogin.addEventListener('change', () => {
    const tipo = tipoLogin.value;

    if (tipo === 'usuario') {
      senha.style.display = 'none';
      entrarBtn.textContent = 'Continuar';
    } else {
      senha.style.display = 'block';
      entrarBtn.textContent = 'Entrar';
    }
  });

  // Botão entrar / continuar
  entrarBtn.addEventListener('click', () => {
    const tipo = tipoLogin.value;
    if (tipo === 'usuario') {
      window.location.href = 'index.html'; // libera site direto
    } else if (tipo === 'membro') {
      // Verifica login de membro
      window.location.href = 'membros.html';
    } else if (tipo === 'equipe') {
      // Login da equipe vai para área completa
      window.location.href = 'camps.html'; // nova página com tabela + confrontos
    }
  });

  // Botão de cadastro
  cadastroBtn.addEventListener('click', () => {
    const tipo = tipoLogin.value;

    if (tipo === 'usuario') {
      window.location.href = 'cadastro-usuario.html';
    } else if (tipo === 'membro') {
      window.location.href = 'cadastro-membro.html';
    } else if (tipo === 'equipe') {
      window.location.href = 'cadastro-equipe.html';
    }
  });
});