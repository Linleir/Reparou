import React, { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

import { useDispatch } from "react-redux";

import { registerLojista } from "../features/authSlice";

export default function RegisterLojistaPage() {

  const dispatch = useDispatch();

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

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");

    // limita em 14 números
    valor = valor.slice(0, 14);

    // máscara CNPJ
    valor = valor.replace(
      /^(\d{2})(\d)/,
      "$1.$2"
    );

    valor = valor.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );

    valor = valor.replace(
      /\.(\d{3})(\d)/,
      ".$1/$2"
    );

    valor = valor.replace(
      /(\d{4})(\d)/,
      "$1-$2"
    );

    return valor;
  };

  // -------------------------
  // CADASTRO
  // -------------------------
  const handleRegister = async () => {

    // remove máscara
    const cnpjLimpo =
      cnpj.replace(/\D/g, "");

    // valida CNPJ
    if (cnpjLimpo.length !== 14) {

      alert(
        "Digite um CNPJ válido."
      );

      return;
    }

    // valida senha
    if (senha !== confirm) {

      alert(
        "Senhas não conferem"
      );

      return;
    }

    await dispatch(
      registerLojista({

        cnpj: cnpjLimpo,

        senha,
      })
    );

    alert(
      "Lojista cadastrado com sucesso!"
    );
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
              setCnpj(
                formatarCnpj(
                  e.target.value
                )
              )
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

            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
          />

        </div>

        {/* CONFIRMAR SENHA */}
        <div className="mb-3">

          <input
            className="form-control"

            placeholder="Confirmar senha"

            type="password"

            value={confirm}

            onChange={(e) =>
              setConfirm(
                e.target.value
              )
            }
          />

        </div>

        {/* BOTÃO */}
        <button
          className="btn btn-custom w-100 mb-2"
          onClick={handleRegister}
        >
          Criar conta
        </button>

        {/* ALERTA */}
        <div className="alert alert-secondary">

          Tela mantida para o fluxo
          original.

        </div>

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