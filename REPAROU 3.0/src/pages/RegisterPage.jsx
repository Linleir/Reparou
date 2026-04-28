import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { registerCliente } from "../features/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!cpf || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirm) {
      alert("Senhas não conferem");
      return;
    }

    try {
      await dispatch(
        registerCliente({
          cpf,
          senha,
        })
      ).unwrap();

      setSuccess(true);

      // opcional: limpar campos
      setCpf("");
      setSenha("");
      setConfirm("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar conta");
    }
  };

  return (
    <Layout>
      <div className="card p-4">
        <h3 className="mb-3">Cadastro de cliente</h3>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Confirmar senha"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          className="btn btn-custom w-100 mb-3"
          onClick={handleRegister}
        >
          Criar conta
        </button>

        {success && (
          <div className="alert alert-success">
            Conta criada com sucesso!
          </div>
        )}

        <Link
          to="/cadastro-lojista"
          className="btn btn-outline-secondary w-100 mb-2"
        >
          Cadastrar lojista
        </Link>

        <Link to="/" className="btn btn-outline-dark w-100">
          Voltar
        </Link>
      </div>
    </Layout>
  );
}