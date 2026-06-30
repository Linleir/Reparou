import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import { useDispatch } from "react-redux";

import { registerLojista } from "../features/authSlice";

export default function RegisterLojistaPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // -------------------------
  // STATES
  // -------------------------
  const [cnpj, setCnpj] = useState("");

  const [senha, setSenha] = useState("");

  const [confirm, setConfirm] = useState("");

  // -------------------------
  // MÁSCARA CNPJ
  // -------------------------
  const formatarCnpj = (valor) => {

    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 14);

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    return valor;
  };

  // -------------------------
  // CADASTRO
  // -------------------------
  const handleRegister = async () => {

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    if (cnpjLimpo.length !== 14) {
      alert("Digite um CNPJ válido.");
      return;
    }

    if (!senha) {
      alert("Preencha a senha.");
      return;
    }

    if (senha !== confirm) {
      alert("Senhas não conferem.");
      return;
    }

    const senhaForte =
      senha.length >= 8 &&
      /[A-Z]/.test(senha) &&
      /[a-z]/.test(senha) &&
      /[0-9]/.test(senha);

    if (!senhaForte) {
      alert("Senha fraca. Use no mínimo 8 caracteres com maiúscula, minúscula e número.");
      return;
    }

    try {
      await dispatch(
        registerLojista({
          cnpj: cnpjLimpo,
          senha,
        })
      ).unwrap();

      navigate("/lojista/perfil");

    } catch (err) {
      const mensagem =
        err?.details?.[0]?.msg ||
        err?.serverError ||
        "Erro ao cadastrar. Tente novamente.";
      alert(mensagem);
    }
  };

  return (

    <Layout>

      <div className="card p-4">

        <h3 className="mb-3">
          Cadastro de lojista
        </h3>

        {/* CNPJ */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) =>
              setCnpj(formatarCnpj(e.target.value))
            }
          />
        </div>

        {/* SENHA */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <small className="text-muted">
            Mínimo 8 caracteres, com maiúscula, minúscula e número.
          </small>
        </div>

        {/* CONFIRMAR SENHA */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Confirmar senha"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
        <button
          className="btn btn-custom w-100 mb-2"
          onClick={handleRegister}
        >
          Criar conta
        </button>

        {/* VOLTAR */}
        <Link
          to="/"
          className="btn btn-outline-dark w-100"
        >
          Voltar
        </Link>

      </div>

    </Layout>
  );
}
