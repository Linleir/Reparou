import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { logout } from '../features/authSlice';

export default function LojistaProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const lojas = useSelector((state) => state.data.lojas.filter((item) => item.lojistaId === user.id));
  const lojista = useSelector((state) => state.data.lojistas.find((item) => item.id === user.id));
  const dispatch = useDispatch();

  return (
    <Layout bottom={<BottomNavLojista />}>
      <div className="profile-header2 mb-3 text-center">
        <h4>{lojista?.responsavel}</h4>
        <div>{lojista?.nomeLojaPrincipal}</div>
      </div>

      <div className="card p-3 mb-3">
        <div className="list-group">

          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link
                to={`/lojista/loja/${loja.id}`}
                className="d-flex align-items-center justify-content-between w-100 text-decoration-none text-dark"
              >
                <span>{loja.nome}</span>

                {/* espaço reservado (mantém formato de botão alinhado) */}
                <span style={{ width: '16px' }}></span>
              </Link>
            </div>
          ))}

          <Link to="/lojista/nova-loja" className="list-group-item text-center fw-bold">
            <i className="fa-solid fa-plus" />
          </Link>

        </div>
      </div>

      <div className="card p-3 mb-5">
        <Link to="/lojista/perfil/editar" className="btn btn-custom w-100 mb-2">
          Editar perfil
        </Link>
        <button
          className="btn btn-outline-secondary w-100"
          onClick={() => dispatch(logout())}
        >
          Sair
        </button>
      </div>
    </Layout>
  );
}
