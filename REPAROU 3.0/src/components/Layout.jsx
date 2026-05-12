import React from "react";
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children, bottom = null, className = '' }) {
  return (
    <div className={`reparou-layout ${className}`.trim()}>
      <main className="reparou-page container py-3">
        {children}
      </main>
      {bottom}
    </div>
  );
}

export function BottomNavCliente() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar bottom-nav fixed-bottom reparou-bottom-nav">
      <div className="container d-flex justify-content-around">
        <Link to="/inicio" className={pathname === '/inicio' ? 'active' : ''}><img src="/Casa e lupa minimalista_edited.png" /></Link>
        <Link to="/avaliacoes/historico" className={pathname.startsWith('/avaliacoes') ? 'active' : ''}><img src="/star.png" /></Link>
        <Link to="/mensagens" className={pathname.startsWith('/mensagens') || pathname.startsWith('/chat/') ? 'active' : ''}><img src="/chat.png" /></Link>
      </div>
    </nav>
  );
}

export function BottomNavLojista() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar bottom-nav fixed-bottom reparou-bottom-nav">
      <div className="container d-flex justify-content-around">
        <Link to="/lojista/perfil" className={pathname.startsWith('/lojista/perfil') || pathname.startsWith('/lojista/loja/') ? 'active' : ''}><img src="/Casa e lupa minimalista_edited.png" /></Link>
        <Link to="/lojista/agendamentos" className={pathname.startsWith('/lojista/agendamentos') ? 'active' : ''}><img src="/star.png" /></Link>
        <Link to="/lojista/chats" className={pathname.startsWith('/lojista/chats') || pathname.startsWith('/chat/') ? 'active' : ''}><img src="/chat.png" /></Link>
      </div>
    </nav>
  );
}
