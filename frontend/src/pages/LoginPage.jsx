import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { loginComCredenciais, loginSuccess } from "../features/authSlice";

export default function LoginPage() {
  const [documento, setDocumento] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formatarDocumento = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 14);

    // Mantém IDs curtos sem máscara para permitir login legítimo do administrador.
    if (valor.length <= 5) {
      return valor;
    }

    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return valor;
  };

  const handleGuestLogin = async () => {
    dispatch(
      loginSuccess({
        usuario: {
          id: "guest",
          nome: "Convidado",
          role: "guest",
        },
        accessToken: null,
        refreshToken: null,
      })
    );

    navigate("/inicio");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const doc = documento.replace(/\D/g, "");

    if (!doc || !senha.trim()) {
      setErro("Informe CPF, CNPJ ou ID de administrador e senha.");
      return;
    }

    try {
  const auth = await dispatch(
    loginComCredenciais({
      documento: doc,
      senha,
    })
  ).unwrap();

  const role = auth.usuario?.role; // ✅ role está dentro de usuario

  if (role === "admin") {
    navigate("/admin");
    return;
  }

  if (role === "lojista") {
    navigate("/lojista/perfil");
    return;
  }

  navigate("/inicio");
} catch (error) {
  if (error?.status === 401) {
    setErro("Credenciais inválidas.");
  } else if (error?.status === 429) {
    setErro("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
  } else {
    setErro(error?.serverError || error?.message || "Erro ao fazer login. Tente novamente.");
  }
}
  };

  return (
    <Layout>
      <div className="container min-vh-100 d-flex align-items-center">
        <div className="row justify-content-center w-100">
          <div className="col-12">
            <div className="text-center mb-4">
              <h1 className="fw-bold">REPAROU</h1>
              <p className="text-muted">
                Seu app de busca para
                <br />
                conserto de PCs e notebooks
              </p>
            </div>

            <div className="card p-4">
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="CPF, CNPJ ou ID de administrador"
                  value={documento}
                  onChange={(e) => setDocumento(formatarDocumento(e.target.value))}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />

                {erro && <p className="text-danger small">{erro}</p>}

                <button className="btn btn-custom w-100 mb-2">Login</button>

                <button
                  type="button"
                  className="btn btn-secondary w-100 mb-2"
                  onClick={handleGuestLogin}
                >
                  Entrar como convidado
                </button>

              </form>

              <Link to="/cadastro" className="btn btn-outline-dark w-100 mt-3">
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
