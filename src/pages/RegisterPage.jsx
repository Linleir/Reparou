import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function RegisterPage() {
  const [ok, setOk] = useState(false);
  return <Layout><div className="card p-4"><h3 className="mb-3">Cadastro de cliente</h3><div className="mb-3"><input className="form-control" placeholder="CPF" /></div><div className="mb-3"><input className="form-control" placeholder="Senha" type="password" /></div><div className="mb-3"><input className="form-control" placeholder="Confirmar senha" type="password" /></div><button className="btn btn-custom w-100 mb-3" onClick={()=>setOk(true)}>Criar conta</button>{ok && <div className="alert alert-success">Fluxo preservado como tela de cadastro mockada. Use o acesso de demonstração para entrar.</div>}<Link to="/cadastro-lojista" className="btn btn-outline-secondary w-100 mb-2">Cadastrar lojista</Link><Link to="/" className="btn btn-outline-dark w-100">Voltar</Link></div></Layout>;
}
