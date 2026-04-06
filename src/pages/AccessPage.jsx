import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { loginSuccess } from '../features/authSlice';

export default function AccessPage() {
  const { clientes, lojistas, admins } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const enterCliente = () => {
    dispatch(loginSuccess({ user: clientes[0], role: 'cliente' }));
    navigate('/inicio');
  };

  const enterLojista = (lojista) => {
    dispatch(loginSuccess({ user: lojista, role: 'lojista' }));
    navigate('/lojista/perfil');
  };

  const enterAdmin = () => {
    dispatch(loginSuccess({ user: admins[0], role: 'admin' }));
    navigate('/admin');
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
            CPF 111.222.333-44<br />
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

        <div>
          <p>
            <strong>Administrador:</strong><br />
            ID 00000000000000<br />
            Senha 123
          </p>
          <button className="btn btn-secondary w-100" onClick={enterAdmin}>
            Entrar como administrador
          </button>
        </div>
      </div>
    </Layout>
  );
}
