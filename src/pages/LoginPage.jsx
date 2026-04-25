import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { loginSuccess } from '../features/authSlice';

export default function LoginPage() {
  const [documento, setDocumento] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientes, lojistas, admins } = useSelector((state) => state.data);

  const handleSubmit = (event) => {
    event.preventDefault();
    const doc = documento.replace(/\D/g, '');
    const admin = admins.find((item) => item.id === doc && item.senha === senha);
    if (admin) { dispatch(loginSuccess({ user: admin, role: 'admin' })); navigate('/admin'); return; }
    const lojista = lojistas.find((item) => item.cnpjNumeros === doc && item.senha === senha);
    if (lojista) { dispatch(loginSuccess({ user: lojista, role: 'lojista' })); navigate('/lojista/perfil'); return; }
    const cliente = clientes.find((item) => item.documento === doc && item.senha === senha);
    if (cliente) { dispatch(loginSuccess({ user: cliente, role: 'cliente' })); navigate('/inicio'); return; }
    setErro('Credenciais inválidas. Verifique o documento e a palavra-passe.');
  };

  return (
    <Layout>
      <div className="container min-vh-100 d-flex align-items-center"><div className="row justify-content-center w-100"><div className="col-12">
        <div className="text-center mb-4"><h1 className="fw-bold">REPAROU</h1><p className="text-muted">Seu app de busca para<br />conserto de PCs e notebooks</p></div>
        <div className="card rounded-custom shadow-soft p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><label className="form-label"><strong>Login</strong></label><input type="text" className="form-control" value={documento} onChange={(e)=>setDocumento(e.target.value)} placeholder="CPF ou CNPJ" maxLength={18} /></div>
            <div className="d-flex justify-content-between align-items-center mb-3 small"><span>Não tem conta?</span><Link to="/cadastro" className="fw-bold text-decoration-none">CRIAR CONTA</Link></div>
            <div className="mb-2"><label className="form-label"><strong>Senha</strong></label><input type="password" className="form-control" value={senha} onChange={(e)=>setSenha(e.target.value)} placeholder="Senha" /></div>
            <div className="mb-2"><span className="small text-decoration-none">Esqueceu sua senha?</span></div>
            <p className="text-danger small mb-3">{erro}</p>
            <button type="submit" className="btn btn-custom w-100 mb-3">LOGIN</button>
          </form>
          <Link to="/acessos" className="btn btn-outline-secondary w-100">Acessos de demonstração</Link>
        </div></div></div></div>
    </Layout>
  );
}
