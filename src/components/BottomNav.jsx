import React from 'react';
import { Link } from 'react-router-dom'; // Importação essencial

export default function BottomNav() {
  return (
    <nav className="navbar bottom-nav fixed-bottom shadow-sm">
      <div className="container d-flex justify-content-around py-2">
        <Link to="/home">
          <img src="/Casa e lupa minimalista_edited.png" alt="Início" />
        </Link>
        <Link to="/home"> {/* Altere para rotas reais quando criá-las */}
          <img src="/star.png" alt="Avaliações" />
        </Link>
        <Link to="/home">
          <img src="/chat.png" alt="Chat" />
        </Link>
      </div>
    </nav>
  );
}