document.addEventListener("DOMContentLoaded", function () {
  inicializarMascaraDocumento();
  inicializarLogin();
});

function inicializarMascaraDocumento() {
  const campoLogin = document.getElementById("login-documento");
  const campoCadastroCliente = document.getElementById("cadastro-documento-cliente");
  const campoCadastroLojista = document.getElementById("cadastro-documento-lojista");

  if (campoLogin) {
    campoLogin.addEventListener("input", function () {
      campoLogin.value = aplicarMascaraCpfOuCnpj(campoLogin.value);
    });
  }

  if (campoCadastroCliente) {
    campoCadastroCliente.addEventListener("input", function () {
      campoCadastroCliente.value = aplicarMascaraCPF(campoCadastroCliente.value);
    });
  }

  if (campoCadastroLojista) {
    campoCadastroLojista.addEventListener("input", function () {
      campoCadastroLojista.value = aplicarMascaraCNPJ(campoCadastroLojista.value);
    });
  }
}

function inicializarLogin() {
  const form = document.getElementById("login-form");

  if (!form) return;

  const campoDocumento = document.getElementById("login-documento");
  const campoSenha = document.getElementById("login-senha");
  const erro = document.getElementById("login-erro");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const documentoDigitado = campoDocumento.value.trim();
    const senhaDigitada = campoSenha.value.trim();

    erro.textContent = "";

    if (documentoDigitado === "111.222.333-44" && senhaDigitada === "123") {
      localStorage.setItem("tipoUsuarioLogado", "cliente");
      localStorage.removeItem("lojistaLogado");
      window.location.href = "inicio_cliente.html";
      return;
    }

    const documentoNumeros = documentoDigitado.replace(/\D/g, "");

    const lojistaEncontrado = lojistas.find(function (lojista) {
      return lojista.cnpjNumeros === documentoNumeros && lojista.senha === senhaDigitada;
    });

    if (lojistaEncontrado) {
      localStorage.setItem("tipoUsuarioLogado", "lojista");
      localStorage.setItem("lojistaLogado", lojistaEncontrado.id);
      window.location.href = "perfil_lojista.html";
      return;
    }

    erro.textContent = "Login ou senha inválidos.";
  });
}

function aplicarMascaraCpfOuCnpj(valor) {
  let numeros = valor.replace(/\D/g, "");

  if (numeros.length > 14) {
    numeros = numeros.slice(0, 14);
  }

  if (numeros.length <= 11) {
    return aplicarMascaraCPF(numeros);
  }

  return aplicarMascaraCNPJ(numeros);
}

function aplicarMascaraCPF(valor) {
  let numeros = valor.replace(/\D/g, "");

  if (numeros.length > 11) {
    numeros = numeros.slice(0, 11);
  }

  numeros = numeros.replace(/^(\d{3})(\d)/, "$1.$2");
  numeros = numeros.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  numeros = numeros.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  return numeros;
}

function aplicarMascaraCNPJ(valor) {
  let numeros = valor.replace(/\D/g, "");

  if (numeros.length > 14) {
    numeros = numeros.slice(0, 14);
  }

  numeros = numeros.replace(/^(\d{2})(\d)/, "$1.$2");
  numeros = numeros.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  numeros = numeros.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
  numeros = numeros.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");

  return numeros;
}