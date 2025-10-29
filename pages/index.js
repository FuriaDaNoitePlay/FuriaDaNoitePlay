export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🔥 Bem-vindo à Fúria Da Noite Play</h1>
      <p>Comunidade de jogadores — campeonatos, regras e área de membros.</p>
      <nav>
        <a href="membros.html">Membros</a> |{" "}
        <a href="campeonato.html">Campeonato</a> |{" "}
        <a href="regras.html">Regras</a> |{" "}
        <a href="admin.html">Admin</a>
      </nav>
      <h2>Chat Geral</h2>
      <textarea rows="8" cols="40" placeholder="Digite sua mensagem"></textarea><br/>
      <button>Enviar</button>
    </div>
  );
}
