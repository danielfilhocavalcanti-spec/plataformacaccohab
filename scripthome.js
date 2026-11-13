// Configuração de acesso ao Supabase para a tela Home
const SUPABASE_URL = "https://joggbpbkiywfecptykzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_-uwJJwgF-mY-QxYgUFNmWA_-cqCYXgw";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Monitora o envio do formulário de problemas
document.getElementById('formularioProblema').addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Impede que a página recarregue antes da hora

    // Captura os valores digitados pelo morador nos inputs
    const tipo = document.getElementById('tipoProblema').value;
    const rua = document.getElementById('ruaProblema').value.trim();
    const descricao = document.getElementById('descricaoProblema').value.trim();

    // 2. Envia os dados para a tabela 'reclamar' que criamos no Supabase
    const { data, error } = await supabaseClient
        .from('reclamar') // Nome ajustado para bater com o banco de dados
        .insert([
            { 
                tipo_problema: tipo, 
                rua_referencia: rua, 
                descricao: descricao 
            }
        ]);

    // 3. Resposta ao morador
    if (error) {
        alert("Erro ao enviar o seu relato: " + error.message);
        console.error("Detalhes do erro:", error);
    } else {
        alert("Sua ocorrência foi enviada com sucesso ao conselho do bairro!");
        
        // Limpa os campos do formulário para o próximo registro
        document.getElementById('formularioProblema').reset();
    }
});

// 4. Comportamento do botão "Sair do sistema"
document.getElementById('btnSair').addEventListener('click', async (evento) => {
    evento.preventDefault();
    
    // Encerra a sessão de login do usuário no Supabase
    await supabaseClient.auth.signOut();
    
    // Redireciona o morador de volta para a tela inicial (Login)
    window.location.href = "index.html";
});