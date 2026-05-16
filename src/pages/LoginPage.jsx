import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Layout from "../components/Layout";

import {
  loginSuccess,
} from "../features/authSlice";

export default function LoginPage() {

  // -------------------------
  // STATES
  // -------------------------
  const [documento, setDocumento] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [erro, setErro] =
    useState("");

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  // -------------------------
  // DADOS REDUX
  // -------------------------
  const clientes =
    useSelector(
      (state) =>
        state.data.clientes
    );

  const lojistas =
    useSelector(
      (state) =>
        state.data.lojistas
    );

  const admins =
    useSelector(
      (state) =>
        state.data.admins
    );

  // -------------------------
  // MÁSCARA CPF/CNPJ
  // -------------------------
  const formatarDocumento = (
    valor
  ) => {

    valor = valor.replace(
      /\D/g,
      ""
    );

    valor = valor.slice(0, 14);

    // CPF
    if (valor.length <= 11) {

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

    }

    // CNPJ
    else {

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
    }

    return valor;
  };

  // -------------------------
  // LOGIN CONVIDADO
  // -------------------------
  const handleGuestLogin =
    () => {

      dispatch(
        loginSuccess({
          user: {
            id: "guest",
            nome: "Convidado",
            role: "cliente",
          },
          role: "cliente",
        })
      );

      navigate("/inicio");
    };

  // -------------------------
  // LOGIN ADMIN RÁPIDO
  // -------------------------
  const handleAdminLogin =
    () => {

      const admin =
        admins?.find(
          (item) =>
            item.id === "31415" &&
            item.senha === "123"
        );

      if (!admin) {

        alert(
          "Admin não encontrado."
        );

        return;
      }

      dispatch(
        loginSuccess({
          user: admin,
          role: "admin",
        })
      );

      navigate("/admin");
    };

  // -------------------------
  // SUBMIT LOGIN
  // -------------------------
  const handleSubmit = (
    event
  ) => {

    event.preventDefault();

    const doc =
      documento.replace(
        /\D/g,
        ""
      );

    // -------------------------
    // VALIDAÇÃO
    // -------------------------
    if (
      doc.length !== 11 &&
      doc.length !== 14
    ) {

      setErro(
        "CPF deve ter 11 números e CNPJ 14 números."
      );

      return;
    }

    // -------------------------
    // ADMIN
    // -------------------------
    const admin =
      admins?.find(
        (item) =>
          item.id === doc &&
          item.senha === senha
      );

    if (admin) {

      dispatch(
        loginSuccess({
          user: admin,
          role: "admin",
        })
      );

      navigate("/admin");

      return;
    }

    // -------------------------
    // LOJISTA
    // -------------------------
    const lojista =
      lojistas?.find(
        (item) => {

          const documentoLojista =
            item.cnpjNumeros ||
            item.cnpj ||
            item.id;

          return (
            documentoLojista ===
              doc &&
            item.senha === senha
          );
        }
      );

    if (lojista) {

      dispatch(
        loginSuccess({
          user: lojista,
          role: "lojista",
        })
      );

      navigate(
        "/lojista/perfil"
      );

      return;
    }

    // -------------------------
    // CLIENTE
    // -------------------------
    const cliente =
      clientes?.find(
        (item) => {

          const documentoCliente =
            item.cpf ||
            item.documento ||
            String(item.id);

          return (
            documentoCliente ===
              doc &&
            item.senha === senha
          );
        }
      );

    if (cliente) {

      dispatch(
        loginSuccess({
          user: cliente,
          role: "cliente",
        })
      );

      navigate("/inicio");

      return;
    }

    // erro
    setErro(
      "Credenciais inválidas."
    );
  };

  return (

    <Layout>

      <div className="container min-vh-100 d-flex align-items-center">

        <div className="row justify-content-center w-100">

          <div className="col-12">

            {/* LOGO */}
            <div className="text-center mb-4">

              <h1 className="fw-bold">
                REPAROU
              </h1>

              <p className="text-muted">

                Seu app de busca para
                <br />
                conserto de PCs e notebooks

              </p>

            </div>

            {/* CARD */}
            <div className="card p-4">

              <form
                onSubmit={
                  handleSubmit
                }
              >

                {/* CPF/CNPJ */}
                <input
                  className="form-control mb-2"

                  placeholder="CPF ou CNPJ"

                  value={documento}

                  onChange={(e) =>
                    setDocumento(
                      formatarDocumento(
                        e.target.value
                      )
                    )
                  }
                />

                {/* SENHA */}
                <input
                  className="form-control mb-2"

                  placeholder="Senha"

                  type="password"

                  value={senha}

                  onChange={(e) =>
                    setSenha(
                      e.target.value
                    )
                  }
                />

                {/* ERRO */}
                {erro && (

                  <p className="text-danger small">

                    {erro}

                  </p>

                )}

                {/* LOGIN */}
                <button className="btn btn-custom w-100 mb-2">

                  Login

                </button>

                {/* CONVIDADO */}
                <button
                  type="button"
                  className="btn btn-secondary w-100 mb-2"

                  onClick={
                    handleGuestLogin
                  }
                >
                  Entrar como convidado
                </button>

                {/* ADMIN */}
                <button
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={
                    handleAdminLogin
                  }
                >
                  Entrar como admin
                </button>

              </form>

              {/* CADASTRO */}
              <Link
                to="/cadastro"
                className="btn btn-outline-dark w-100 mt-3"
              >
                Criar conta
              </Link>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}