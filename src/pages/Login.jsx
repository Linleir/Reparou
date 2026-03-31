import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [documento, setDocumento] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (documento && senha) {
      navigate('/home');
    } else {
      alert("Por favor, preencha o CPF e a senha.");
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center bg-dark text-white">
      <div className="row justify-content-center w-100 m-0">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="text-center mb-4">
            <h1 className="fw-bold display-5">REPAROU</h1>
            <p className="text-muted">Busca inteligente de assistência técnica</p>
          </div>

          <div className="card shadow-lg p-4 text-dark rounded-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold small">CPF / CNPJ</label>
                <input 
                  type="text" 
                  className="form-control rounded-3" 
                  placeholder="000.000.000-00"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold small">Senha</label>
                <input 
                  type="password" 
                  className="form-control rounded-3" 
                  placeholder="******"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-dark w-100 rounded-pill py-2 fw-bold">
                ENTRAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}