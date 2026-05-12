import React from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { logout } from '../features/authSlice';

export default function ClienteProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user.id)
  );
  const dispatch = useDispatch();

  const nomeCompleto = `${cliente?.nome || ''} ${cliente?.sobrenome || ''}`.trim();
  const perfil = cliente?.perfil || {};
  const telefones = Array.isArray(perfil?.telefones)
    ? perfil.telefones.filter(Boolean)
    : [perfil?.telefone1, perfil?.telefone2].filter(Boolean);

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3 text-center">
        <h4 id="perfil-usuario-nome">{nomeCompleto || 'Cliente'}</h4>
        <div id="perfil-usuario-local">
          {[perfil?.bairro, perfil?.municipio].filter(Boolean).join(' • ') || 'Perfil do usuário'}
        </div>
      </div>

      <div className="card p-3 mb-3">
        <div className="mb-3">
          <div className="text-muted small mb-1">Nome</div>
          <div className="fw-semibold">{cliente?.nome || '-'}</div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Sobrenome</div>
          <div className="fw-semibold">{cliente?.sobrenome || '-'}</div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Bairro</div>
          <div className="fw-semibold">{perfil?.bairro || '-'}</div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Município</div>
          <div className="fw-semibold">{perfil?.municipio || '-'}</div>
        </div>

        <div className="mb-0">
          <div className="text-muted small mb-1">Telefones</div>
          {telefones.length > 0 ? (
            telefones.map((telefone, index) => (
              <div key={index} className="fw-semibold">{telefone}</div>
            ))
          ) : (
            <div className="fw-semibold">-</div>
          )}
        </div>
      </div>

      <div className="card p-3 mb-5">
        <Link to="/perfil/editar" className="btn btn-custom w-100 mb-2">
          Editar perfil
        </Link>
        <Link to="/favoritos" className="btn btn-outline-dark w-100 mb-2">
          Ver favoritos
        </Link>
        <button
          className="btn btn-custom w-100"
          onClick={() => dispatch(logout())}
        >
          Sair
        </button>
      </div>
    </Layout>
  );
}
