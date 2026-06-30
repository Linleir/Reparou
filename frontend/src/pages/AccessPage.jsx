import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { loginComCredenciais } from '../features/authSlice';
import { loadData } from '../features/loadThunks';

export default function AccessPage() {
  const { lojistas } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const entrarComCredenciais = async ({ documento, senha, destino }) => {
    try {
      const auth = await dispatch(loginComCredenciais({ documento, senha })).unwrap();
      await dispatch(loadData());
      navigate(destino || (auth.role === 'admin' ? '/admin' : auth.role === 'lojista' ? '/lojista/perfil' : '/inicio'));
    } catch (error) {
      alert('Não foi possível entrar com este acesso de demonstração.');
    }
  };

  const enterCliente = () => {
    entrarComCredenciais({ documento: '11111111111', senha: '123', destino: '/inicio' });
  };

  const enterLojista = (lojista) => {
    const documento = lojista.cnpjNumeros || String(lojista.cnpj || '').replace(/\D/g, '') || lojista.id;
    entrarComCredenciais({ documento, senha: '123', destino: '/lojista/perfil' });
  };

  return (
    <Layout>
      <div className="card p-3">
        <div className="bg-black text-white p-3 rounded mb-3 text-center position-relative">
          <Link to="/" className="position-absolute start-0 top-50 translate-middle-y ms-3 text-white text-decoration-none">←</Link>
          <h1 className="h5 m-0">LOGIN</h1>
        </div>

        <h5 className="mb-3">Acessos de demonstração</h5>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Cliente:</strong><br />
            CPF 111.111.111-11<br />
            Senha 123
          </p>
          <button className="btn btn-primary w-100" onClick={enterCliente}>
            Entrar como cliente
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Lojistas:</strong><br />
            Escolha um perfil para testar a relação entre cada dono e suas lojas.
          </p>

          <div className="d-flex flex-column gap-2">
            {lojistas.map((lojista) => (
              <button
                key={lojista.id}
                className="btn btn-outline-primary text-start"
                onClick={() => enterLojista(lojista)}
              >
                <div className="fw-bold">{lojista.responsavel}</div>
                <div className="small">{lojista.cnpj}</div>
                <div className="small text-muted">{lojista.nomeLojaPrincipal}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="alert alert-warning small mb-0">
          O administrador deve acessar o sistema pela tela de login normal, informando ID e senha. O acesso rápido de administrador foi removido para manter o controle de acesso por JWT.
        </div>
      </div>
    </Layout>
  );
}
