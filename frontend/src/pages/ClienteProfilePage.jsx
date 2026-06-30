import React from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { logout, logoutUsuario } from '../features/authSlice';

function getIniciais(nome, sobrenome) {
  const primeira = nome?.trim()?.[0] || '';
  const segunda = sobrenome?.trim()?.[0] || '';
  const iniciais = `${primeira}${segunda}`.toUpperCase();
  return iniciais || '?';
}

function InfoRow({ icon, label, value }) {
  const isEmpty = !value;
  return (
    <div className="profile-info-row">
      <div className="profile-info-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="profile-info-text">
        <span className="profile-info-label">{label}</span>
        <span className={`profile-info-value${isEmpty ? ' is-empty' : ''}`}>
          {value || 'Não informado'}
        </span>
      </div>
    </div>
  );
}

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
  const telefonesTexto = telefones.length > 0 ? telefones.join(' • ') : '';

  return (
    <Layout bottom={<BottomNavCliente />} className="reparou-page-wide">
      <div className="profile-header-v2 mb-3">
        <div className="profile-avatar">
          {getIniciais(cliente?.nome, cliente?.sobrenome)}
        </div>
        <h4 id="perfil-usuario-nome">{nomeCompleto || 'Cliente'}</h4>
        <div className="profile-header-v2-sub" id="perfil-usuario-local">
          <i className="fa-solid fa-location-dot"></i>
          {[perfil?.bairro, perfil?.municipio].filter(Boolean).join(' • ') || 'Perfil do usuário'}
        </div>
      </div>

      <div className="card profile-info-card mb-3">
        <div className="profile-info-grid">
          <InfoRow icon="fa-user" label="Nome" value={cliente?.nome} />
          <InfoRow icon="fa-user" label="Sobrenome" value={cliente?.sobrenome} />
          <InfoRow icon="fa-map-pin" label="Bairro" value={perfil?.bairro} />
          <InfoRow icon="fa-city" label="Município" value={perfil?.municipio} />
        </div>
        <InfoRow icon="fa-phone" label="Telefones" value={telefonesTexto} />
      </div>

      <div className="card p-3 mb-5 profile-actions-card">
        <Link to="/perfil/editar" className="profile-action-btn profile-action-primary">
          <i className="fa-solid fa-pen"></i>
          Editar perfil
        </Link>
        <Link to="/favoritos" className="profile-action-btn profile-action-secondary">
          <i className="fa-solid fa-heart"></i>
          Ver favoritos
        </Link>
        <button
          className="profile-action-btn profile-action-danger"
          onClick={() => dispatch(logoutUsuario())}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Sair
        </button>
      </div>
    </Layout>
  );
}
