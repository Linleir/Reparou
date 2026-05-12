import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { loginSuccess, loginGuest } from "../features/authSlice";

export default function LoginPage() {
  // -------------------------
  // STATES
  // -------------------------
  const [documento, setDocumento] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ⚠️ SEMPRE AQUI EM CIMA ANTES DE USAR
  const clientes = useSelector((state) => state.data.clientes);
  const lojistas = useSelector((state) => state.data.lojistas);
  const admins = useSelector((state) => state.data.admins);






  

const handleGuestLogin = () => {
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




  const handleSubmit = (event) => {
    event.preventDefault();

    const doc = documento.replace(/\D/g, "");

    // -------------------------
    // ADMIN
    // -------------------------
    const admin = admins?.find(
      (item) => item.id === doc && item.senha === senha
    );

    if (admin) {
      dispatch(loginSuccess({ user: admin, role: "admin" }));
      navigate("/admin");
      return;
    }

    // -------------------------
    // LOJISTA
    // -------------------------
    const lojista = lojistas?.find((item) => {
      const documentoLojista =
        item.cnpjNumeros ||
        item.cnpj ||
        item.id;

      return documentoLojista === doc && item.senha === senha;
    });

    if (lojista) {
      dispatch(loginSuccess({ user: lojista, role: "lojista" }));
      navigate("/lojista/perfil");
      return;
    }

    // -------------------------
    // CLIENTE (CORRIGIDO 100%)
    // -------------------------
    const cliente = clientes?.find((item) => {
      const documentoCliente =
        item.cpf ||
        item.documento ||
        String(item.id);

      return documentoCliente === doc && item.senha === senha;
    });

    if (cliente) {
      dispatch(loginSuccess({ user: cliente, role: "cliente" }));
      navigate("/inicio");
      return;
    }

    setErro("Credenciais inválidas. Verifique CPF/CNPJ e senha.");
  };

  return (
    <Layout>
      <div className="container min-vh-100 d-flex align-items-center">
        <div className="row justify-content-center w-100">
          <div className="col-12">

            <div className="text-center mb-4">
              <h1 className="fw-bold">REPAROU</h1>
              <p className="text-muted">
                Seu app de busca para<br />
                conserto de PCs e notebooks
              </p>
            </div>

            <div className="card p-4">

              <form onSubmit={handleSubmit}>

                <input
                  className="form-control mb-2"
                  placeholder="CPF ou CNPJ"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />

                {erro && (
                  <p className="text-danger small">{erro}</p>
                )}

                <button className="btn btn-custom w-100">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-custom w-100"
                   onClick={handleGuestLogin}
                      >
                      Entrar Como Convidado
                    </button>

              </form>

              <Link to="/cadastro" className="btn btn-custom w-100">
                Criar conta
              </Link>

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}