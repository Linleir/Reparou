import React, { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

import { useDispatch } from "react-redux";

import { registerCliente } from "../features/authSlice";

export default function RegisterPage() {

  const dispatch = useDispatch();

  // -------------------------
  // STATES
  // -------------------------
  const [cpf, setCpf] = useState("");

  const [senha, setSenha] = useState("");

  const [confirm, setConfirm] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // -------------------------
  // MÁSCARA CPF
  // -------------------------
  const formatarCpf = (valor) => {

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");

    // limita em 11 números
    valor = valor.slice(0, 11);

    // aplica máscara
    valor = valor.replace(
      /(\d{3})(\d)/,
      "$1.$2"
    );

    valor = valor.replace(
      /(\d{3})(\d)/,
      "$1.$2"
    );

    valor = valor.replace(
      /(\d{3})(\d{1,2})$/,
      "$1-$2"
    );

    return valor;
  };

  // -------------------------
  // CADASTRO
  // -------------------------
  const handleRegister = async () => {

    // remove máscara
    const cpfLimpo =
      cpf.replace(/\D/g, "");

    // valida campos
    if (!cpfLimpo || !senha) {

      alert(
        "Preencha todos os campos"
      );

      return;
    }

    // valida CPF
    if (cpfLimpo.length !== 11) {

      alert(
        "Digite um CPF válido."
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

    try {

      await dispatch(
        registerCliente({

          cpf: cpfLimpo,

          senha,
        })
      ).unwrap();

      setSuccess(true);

      // limpa campos
      setCpf("");

      setSenha("");

      setConfirm("");

    } catch (err) {
  console.error("ERRO COMPLETO:", err);

  alert(
    JSON.stringify(err)
  );
}
  };

  return (

    <Layout>

      <div className="card p-4">

        <h3 className="mb-3">
          Cadastro de cliente
        </h3>

        {/* CPF */}
        <div className="mb-3">

          <input
            className="form-control"

            placeholder="CPF"

            value={cpf}

            onChange={(e) =>
              setCpf(
                formatarCpf(
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
          className="btn btn-custom w-100 mb-3"
          onClick={handleRegister}
        >
          Criar conta
        </button>

        {/* SUCESSO */}
        {success && (

          <div className="alert alert-success">

            Conta criada com sucesso!

          </div>
        )}

        {/* CADASTRAR LOJISTA */}
        <Link
          to="/cadastro-lojista"
          className="btn btn-outline-secondary w-100 mb-2"
        >
          Cadastrar lojista
        </Link>

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