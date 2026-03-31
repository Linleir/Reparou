import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import LojaDetalhes from './pages/LojaDetalhes';
import Chat from './pages/Chat';
import BottomNav from './components/BottomNav';

function Layout() {
  const location = useLocation();
  // A barra só aparece se NÃO estivermos na raiz (Login)
  const mostrarBarra = location.pathname !== '/';

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loja/:id" element={<LojaDetalhes />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
      {mostrarBarra && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}