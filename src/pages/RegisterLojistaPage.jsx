import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function RegisterLojistaPage() {
  return <Layout><div className="card p-4"><h3 className="mb-3">Cadastro de lojista</h3><div className="mb-3"><input className="form-control" placeholder="CNPJ" /></div><div className="mb-3"><input className="form-control" placeholder="Senha" type="password" /></div><div className="mb-3"><input className="form-control" placeholder="Confirmar senha" type="password" /></div><div className="alert alert-secondary">Tela mantida para o fluxo original. Para testar o sistema completo, use os acessos de demonstração.</div><Link to="/" className="btn btn-outline-dark w-100">Voltar</Link></div></Layout>;
}
