// Configuração de acesso ao Supabase para a tela de cadastro
const SUPABASE_URL = "https://joggbpbkiywfecptykzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_-uwJJwgF-mY-QxYgUFNmWA_-cqCYXgw";

// Cria a conexão oficial
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dadosUsuarioTemporario = null;
let nomeUsuarioGeral = "";

// LIGAÇÃO DIRETA: Controla o clique do botão pelo ID do HTML
document.getElementById('btnValidar').addEventListener('click', () => {
  console.log("Botão Validar foi clicado com sucesso!");
  
  const formulario = document.getElementById('formularioCadastro');
  if (!formulario) {
    alert("Erro crítico: O JavaScript não encontrou o formulário no HTML. Verifique o ID!");
    return;
  }

  if (!formulario.reportValidity()) {
    return;
  }

  let campoNome = document.getElementById('nome');
  let campoCpf = document.getElementById('cpf');
  let campoEmail = document.getElementById('email');
  let campoAno = document.getElementById('ano');
  let radiosGenero = document.getElementsByName('radgen');
  let campoSenha = document.getElementById('senha');
  let campoConfirmaSenha = document.getElementById('confirmaSenha');

  let nome = campoNome.value.trim().toUpperCase().replace(/\s+/g, ' ');
  let cpfNumeros = campoCpf.value.replace(/\D/g, '');
  let email = campoEmail.value.trim();
  let anoNascimento = Number(campoAno.value);
  let senha = campoSenha.value;
  let confirmaSenha = campoConfirmaSenha.value;

  // 1. Validação do Nome
  if (nome === "") {
    alert('Por favor, digite seu nome!');
    campoNome.value = "";
    campoNome.focus();
    return;
  }
  campoNome.value = nome;

  // 2. Validação do CPF
  if (!validarCPF(cpfNumeros)) {
    alert("Por favor, digite um CPF válido!");
    campoCpf.value = "";
    campoCpf.focus();
    return;
  }
  let cpfFormatado = cpfNumeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  campoCpf.value = cpfFormatado;

  // 3. Validação do E-mail
  let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert('Por favor, digite um e-mail válido!');
    campoEmail.value = "";
    campoEmail.focus();
    return;
  }

  // 4. Validação do Ano de Nascimento
  let anoAtual = new Date().getFullYear();
  if (campoAno.value.length === 0 || anoNascimento < 1900 || anoNascimento > anoAtual) {
    alert(`Por favor, digite um ano de nascimento válido (entre 1900 e ${anoAtual})!`);
    campoAno.value = "";
    campoAno.focus();
    return;
  }

  // 5. Validação do Gênero
  let generoSelecionado = "";
  for (let i = 0; i < radiosGenero.length; i++) {
    if (radiosGenero[i].checked) {
      generoSelecionado = radiosGenero[i].value;
      break;
    }
  }
  if (generoSelecionado === "") {
    alert('Por favor, selecione seu gênero!');
    return;
  }

  // 6. Validação do Tamanho da Senha
  if (senha.length < 8 || senha.length > 72) {
    alert('A senha deve conter entre 8 e 72 caracteres!');
    campoSenha.value = "";
    campoConfirmaSenha.value = "";
    campoSenha.focus();
    return;
  }

  // 7. Validação da Confirmação de Senha
  if (senha !== confirmaSenha) {
    alert('As senhas digitadas não coincidem. Por favor, tente novamente!');
    campoSenha.value = "";
    campoConfirmaSenha.value = "";
    campoConfirmaSenha.focus();
    return;
  }

  nomeUsuarioGeral = nome;
  let idade = anoAtual - anoNascimento;

  // Prepara e Exibe a Tela de Confirmação
  document.getElementById('resumo-dados').innerHTML = `
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>CPF:</strong> ${cpfFormatado}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Idade:</strong> ${idade} anos (${anoNascimento})</p>
    <p><strong>Gênero:</strong> ${generoSelecionado}</p>
    <p><strong>Senha:</strong> ******</p>
  `;

  // Oculta o formulário e exibe a tela de revisão
  document.getElementById('secao-formulario').style.display = 'none';
  document.getElementById('secao-confirmacao').style.display = 'block';

  // Guarda os dados organizados no objeto temporário
  dadosUsuarioTemporario = {
    nome: nome,
    cpf: cpfFormatado,
    email: email,
    anoNascimento: anoNascimento,
    genero: generoSelecionado,
    senha: senha
  };
});

// Botão "Refazer Cadastro"
window.corrigirCadastro = function() {
  document.getElementById('nome').value = "";
  document.getElementById('cpf').value = "";
  document.getElementById('email').value = "";
  document.getElementById('ano').value = "";
  document.getElementById('senha').value = "";
  document.getElementById('confirmaSenha').value = "";

  let radiosGenero = document.getElementsByName('radgen');
  for (let i = 0; i < radiosGenero.length; i++) {
    radiosGenero[i].checked = false;
  }

  document.getElementById('secao-confirmacao').style.display = 'none';
  document.getElementById('secao-formulario').style.display = 'block';
  document.getElementById('nome').focus();
}

// Botão "Confirmar Cadastro Final" no Supabase
window.confirmarCadastroFinal = function() {
  if (dadosUsuarioTemporario === null) {
    alert("Nenhum dado encontrado para cadastrar.");
    return;
  }

  // Usamos a janela de confirmação de forma assíncrona com Promises do próprio Supabase
  supabase.auth.signUp({
    email: dadosUsuarioTemporario.email,
    password: dadosUsuarioTemporario.senha,
    options: {
      data: {
        nome_completo: dadosUsuarioTemporario.nome,
        cpf: dadosUsuarioTemporario.cpf,
        ano_nascimento: dadosUsuarioTemporario.anoNascimento,
        genero: dadosUsuarioTemporario.genero
      }
    }
  }).then(({ data, error }) => {
    if (error) {
      alert(`Erro ao realizar cadastro: ${error.message}`);
      console.error("Erro detalhado:", error);
    } else {
      alert(`Cadastro de ${nomeUsuarioGeral} realizado com sucesso! Você será redirecionado para a tela de login.`);
      dadosUsuarioTemporario = null;
      window.location.href = "index.html";
    }
  });
}
 
// Função auxiliar do CPF
function validarCPF(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  return true;
}

// Função para o botão do Olho (Disponibilizada globalmente)
window.alternarVisibilidade = function(idCampo, botao) {
  let campo = document.getElementById(idCampo);
  if (campo.type === "password") {
    campo.type = "text";
    botao.textContent = "🙈";
  } else {
    campo.type = "password";
    botao.textContent = "👁️";
  }
}