import React from "react";
import { Link, useLocation } from 'react-router-dom';
import ActivitySidebar from './ActivitySidebar';

export default function Layout({ children, bottom = null, aside, className = '' }) {
  if (!bottom) {
    return (
      <div className={`reparou-layout ${className}`.trim()}>
        <main className="reparou-page container py-3">
          {children}
        </main>
      </div>
    );
  }

  const asideContent = aside !== undefined ? aside : <ActivitySidebar />;

  return (
    <div className={`reparou-layout reparou-with-sidebar${asideContent ? ' reparou-with-activity' : ''} ${className}`.trim()}>
      {bottom}
      <main className="reparou-page container py-3">
        {children}
      </main>
      {asideContent}
    </div>
  );
}

function SidebarLink({ to, icon, label, active }) {
  return (
    <Link to={to} className={`app-sidebar-link${active ? ' active' : ''}`}>
      <i className={`fa-solid ${icon}`}></i>
      <span>{label}</span>
    </Link>
  );
}

export function BottomNavCliente() {
  const { pathname } = useLocation();
  return (
    <aside className="app-sidebar">
      <Link to="/inicio" className="app-sidebar-logo">
        <img src="/Casa e lupa minimalista_edited.png" alt="Reparou" />
        <span>Reparou</span>
      </Link>
      <nav className="app-sidebar-nav">
        <SidebarLink to="/inicio" icon="fa-house" label="Início" active={pathname === '/inicio'} />
        <SidebarLink to="/favoritos" icon="fa-heart" label="Favoritos" active={pathname.startsWith('/favoritos')} />
        <SidebarLink to="/avaliacoes/historico" icon="fa-star" label="Avaliações" active={pathname.startsWith('/avaliacoes')} />
        <SidebarLink to="/mensagens" icon="fa-comment-dots" label="Mensagens" active={pathname.startsWith('/mensagens') || pathname.startsWith('/chat/')} />
        <SidebarLink to="/perfil" icon="fa-user" label="Perfil" active={pathname.startsWith('/perfil')} />
      </nav>
      <div className="app-sidebar-footer">© Reparou</div>
    </aside>
  );
}

export function BottomNavLojista() {
  const { pathname } = useLocation();
  return (
    <aside className="app-sidebar">
      <Link to="/lojista/perfil" className="app-sidebar-logo">
        <img src="/Casa e lupa minimalista_edited.png" alt="Reparou" />
        <span>Reparou</span>
      </Link>
      <nav className="app-sidebar-nav">
        <SidebarLink
          to="/lojista/perfil"
          icon="fa-store"
          label="Minha loja"
          active={pathname.startsWith('/lojista/perfil') || pathname.startsWith('/lojista/loja/')}
        />
        <SidebarLink
          to="/lojista/agendamentos"
          icon="fa-calendar-check"
          label="Agendamentos"
          active={pathname.startsWith('/lojista/agendamentos')}
        />
        <SidebarLink
          to="/lojista/chats"
          icon="fa-comment-dots"
          label="Chats"
          active={pathname.startsWith('/lojista/chats') || pathname.startsWith('/chat/')}
        />
      </nav>
      <div className="app-sidebar-footer">© Reparou</div>
    </aside>
  );
}
