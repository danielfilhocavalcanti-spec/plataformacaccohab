const SUPABASE_URL = "https://joggbpbkiywfecptykzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_-uwJJwgF-mY-QxYgUFNmWA_-cqCYXgw";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('formularioRedefinir').addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita recarregar a página antes da hora

    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaNovaSenha = document.getElementById('confirmaNovaSenha').value;

    // 1. Validação local se as duas senhas são iguais
    if (novaSenha !== confirmaNovaSenha) {
        alert("As senhas digitadas não coincidem. Por favor, tente novamente!");
        return;
    }

    // 2. Integração com o Supabase
    // O Supabase sabe qual usuário está acessando porque ele valida o token invisível que está na URL da página
    const { data, error } = await supabaseClient.auth.updateUser({
        password: novaSenha
    });

    if (error) {
        alert("Erro ao atualizar a senha: " + error.message);
        console.error("Erro técnico:", error);
    } else {
        alert("Sua senha foi redefinida com sucesso! Você será redirecionado para a tela de login.");
        
        // Entendendo o print: Direciona o morador de volta para a página inicial (Login)
        window.location.href = "index.html"; 
    }
});