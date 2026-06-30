const { body, validationResult } = require('express-validator');

function validarCPF(cpf) {
  const cpfLimpo = String(cpf).replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

function validarCNPJ(cnpj) {
  const cnpjLimpo = String(cnpj).replace(/\D/g, '');
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    pos++;
    soma += numeros.charAt(i) * pos;
    if (pos === 9) pos = 2;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    pos++;
    soma += numeros.charAt(i) * pos;
    if (pos === 9) pos = 2;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

function validarSenhaForte(senha) {
  if (senha.length < 8) return false;
  if (!/[A-Z]/.test(senha)) return false;
  if (!/[a-z]/.test(senha)) return false;
  if (!/[0-9]/.test(senha)) return false;
  return true;
}

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const validateLogin = [
  body('documento')
    .notEmpty()
    .withMessage('Documento é obrigatório')
    .trim(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array(),
      });
    }
    next();
  },
];

const validateRegisterCliente = [
  body('cpf')
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .custom((cpf) => {
      if (!validarCPF(cpf)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),
  
  body('email')
    .if((value) => value)
    .custom((email) => {
      if (!validarEmail(email)) {
        throw new Error('Email inválido');
      }
      return true;
    })
    .trim(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .custom((senha) => {
      if (!validarSenhaForte(senha)) {
        throw new Error('Senha fraca. Mínimo 8 caracteres, com maiúscula, minúscula e número');
      }
      return true;
    }),
  (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("\n========== CADASTRO REJEITADO ==========");
    console.log("Body recebido:");
    console.log(JSON.stringify(req.body, null, 2));

    console.log("\nErros:");

    errors.array().forEach((erro, index) => {
      console.log(`\nErro ${index + 1}`);
      console.log("Campo :", erro.path);
      console.log("Mensagem :", erro.msg);
      console.log(JSON.stringify(erro, null, 2));
    });

    console.log("\n========================================\n");

    return res.status(400).json({
      error: 'Validação falhou',
      details: errors.array(),
    });
  }

  next();
},
];

const validateRegisterLojista = [
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .custom((cnpj) => {
      if (!validarCNPJ(cnpj)) {
        throw new Error('CNPJ inválido');
      }
      return true;
    }),
  body('responsavel')
    .notEmpty()
    .withMessage('Responsável é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome do responsável deve ter pelo menos 3 caracteres')
    .trim(),
  body('nomeLojaPrincipal')
    .notEmpty()
    .withMessage('Nome da loja é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome da loja deve ter pelo menos 3 caracteres')
    .trim(),
  body('email')
    .if((value) => value)
    .custom((email) => {
      if (!validarEmail(email)) {
        throw new Error('Email inválido');
      }
      return true;
    })
    .trim(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .custom((senha) => {
      if (!validarSenhaForte(senha)) {
        throw new Error('Senha fraca. Mínimo 8 caracteres, com maiúscula, minúscula e número');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array(),
      });
    }
    next();
  },
];

const validateRegisterLojistaInicial = [
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .custom((cnpj) => {
      if (!validarCNPJ(cnpj)) {
        throw new Error('CNPJ inválido');
      }
      return true;
    }),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .custom((senha) => {
      if (!validarSenhaForte(senha)) {
        throw new Error('Senha fraca. Mínimo 8 caracteres, com maiúscula, minúscula e número');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateLogin,
  validateRegisterCliente,
  validateRegisterLojista,
  validateRegisterLojistaInicial,
  validarCPF,
  validarCNPJ,
  validarSenhaForte,
  validarEmail,
};
