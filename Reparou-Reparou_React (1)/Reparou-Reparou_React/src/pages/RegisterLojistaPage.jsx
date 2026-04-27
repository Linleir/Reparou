import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { registerLojista } from "../features/authSlice";

export default function RegisterLojistaPage() {
  const dispatch = useDispatch();

  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (senha !== confirm) {
      alert("Senhas não conferem");
      return;
    }

    await dispatch(
      registerLojista({
        cnpj,
        senha,
      })
    );

    alert("Lojista cadastrado com sucesso!");
  };

  return (
    <Layout>
      <div className="card p-4">
        <h3 className="mb-3">Cadastro de lojista</h3>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
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

        <button className="btn btn-custom w-100 mb-2" onClick={handleRegister}>
          Criar conta
        </button>

        <div className="alert alert-secondary">
          Tela mantida para o fluxo original.
        </div>

        <Link to="/" className="btn btn-outline-dark w-100">
          Voltar
        </Link>
      </div>
    </Layout>
  );
}