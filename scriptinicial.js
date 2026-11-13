const SUPABASE_URL = "https://joggbpbkiywfecptykzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_-uwJJwgF-mY-QxYgUFNmWA_-cqCYXgw";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// 1. Seleciona o formulário de login do HTML
const formularioLogin = document.querySelector('.login-form');

// 2. Fica escutando quando o usuário tentar enviar (fazer o submit)
if (formularioLogin){

    formularioLogin.addEventListener('submit', async (evento) => {
        // Evita que a página recarregue e limpe os campos antes da hora
    evento.preventDefault();
    // 3. Pega os dados digitados nos inputs de Texto e Senha
    const loginDigitado = document.getElementById('username').value.trim();
    const senhaDigitada = document.getElementById('password').value;
      // 4. Pede para o Supabase validar o e-mail e a senha na "cozinha" dele
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: loginDigitado, // Por enquanto, o Supabase Auth padrão usa e-mail!
        password: senhaDigitada
    }); 
    // 5. Se o garçom trouxer um erro da cozinha...
    if (error) {
        alert("Usuário ou senha inválidos, tente novamente. Caso não seja cadastrado, cadastre-se!");
        console.error("Erro no login:", error.message);
    } 
    // 6. Se der tudo certo e o usuário existir...
    else {
        alert("Login realizado com sucesso! Bem-vindo.");
        // Redireciona o usuário para a página home.html
        window.location.href = "home.html";
    }

    });
}
// CÓDIGO DA RECUPERAÇÃO DE SENHA:
const btnEsqueciSenha = document.getElementById('btnEsqueciSenha');

if (btnEsqueciSenha) {
    btnEsqueciSenha.addEventListener('click', async (evento) => {
        // Evita que a página recarregue ao clicar no link
        evento.preventDefault();

        // Pega o e-mail digitado no campo de usuário
        const emailDigitado = document.getElementById('username').value.trim();

        // Valida se o usuário digitou o e-mail antes de clicar
        if (emailDigitado === "") {
            alert("Por favor, digite o seu e-mail no campo 'e-mail' antes de clicar em 'Esqueci minha senha'.");
            document.getElementById('username').focus();
            return;
        }

        // Pede para o Supabase enviar o e-mail de redefinição
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(emailDigitado, {
            redirectTo: 'http://127.0.0.1:5500/redefinirsenha.html'
        });

        if (error) {
            alert("Erro ao enviar e-mail de recuperação: " + error.message);
            console.error("Erro no reset:", error);
        } else {
            alert(`Um e-mail de redefinição foi enviado para: ${emailDigitado}. Verifique sua caixa de entrada e lixo eletrônico (Spam)!`);
        }
    });
}
