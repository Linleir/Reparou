import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from './features/dataSlice';
import LoginPage from './pages/LoginPage';
import AccessPage from './pages/AccessPage';
import RegisterPage from './pages/RegisterPage';
import RegisterLojistaPage from './pages/RegisterLojistaPage';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ReviewsPage from './pages/ReviewsPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ReviewHistoryPage from './pages/ReviewHistoryPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ClienteProfilePage from './pages/ClienteProfilePage';
import LojistaProfilePage from './pages/LojistaProfilePage';
import LojaLojistaPage from './pages/LojaLojistaPage';
import EditLojaPage from './pages/EditLojaPage';
import EditLojistaPage from './pages/EditLojistaPage';
import LojistaChatsPage from './pages/LojistaChatsPage';
import AgendamentosPage from './pages/AgendamentosPage';
import AdminPage from './pages/AdminPage';
import ComplaintPage from './pages/ComplaintPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingState from './components/LoadingState';

export default function App() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.data);
  useEffect(() => { dispatch(loadData()); }, [dispatch]);
  if (status === 'loading') return <LoadingState />;
  if (status === 'failed') return <LoadingState text={`Erro ao carregar dados: ${error}`} />;
  return (
    <div className="app-shell">
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/acessos" element={<AccessPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/cadastro-lojista" element={<RegisterLojistaPage />} />
      <Route path="/inicio" element={<ProtectedRoute roles={["cliente"]}><HomePage /></ProtectedRoute>} />
      <Route path="/favoritos" element={<ProtectedRoute roles={["cliente"]}><FavoritesPage /></ProtectedRoute>} />
      <Route path="/mensagens" element={<ProtectedRoute roles={["cliente"]}><MessagesPage /></ProtectedRoute>} />
      <Route path="/chat/:chatId" element={<ProtectedRoute roles={["cliente","lojista"]}><ChatPage /></ProtectedRoute>} />
      <Route path="/lojas/:id" element={<ProtectedRoute roles={["cliente"]}><StorePage /></ProtectedRoute>} />
      <Route path="/lojas/:id/avaliacoes" element={<ProtectedRoute roles={["cliente"]}><ReviewsPage /></ProtectedRoute>} />
      <Route path="/lojas/:id/denuncia" element={<ProtectedRoute roles={["cliente"]}><ComplaintPage /></ProtectedRoute>} />
      <Route path="/avaliacoes/historico" element={<ProtectedRoute roles={["cliente"]}><ReviewHistoryPage /></ProtectedRoute>} />
      <Route path="/avaliacoes/:id" element={<ProtectedRoute roles={["cliente"]}><ReviewDetailPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute roles={["cliente"]}><ClienteProfilePage /></ProtectedRoute>} />
      <Route path="/lojista/perfil" element={<ProtectedRoute roles={["lojista"]}><LojistaProfilePage /></ProtectedRoute>} />
      <Route path="/lojista/loja/:id" element={<ProtectedRoute roles={["lojista"]}><LojaLojistaPage /></ProtectedRoute>} />
      <Route path="/lojista/loja/:id/editar" element={<ProtectedRoute roles={["lojista"]}><EditLojaPage /></ProtectedRoute>} />
      <Route path="/lojista/nova-loja" element={<ProtectedRoute roles={["lojista"]}><EditLojaPage /></ProtectedRoute>} />
      <Route path="/lojista/perfil/editar" element={<ProtectedRoute roles={["lojista"]}><EditLojistaPage /></ProtectedRoute>} />
      <Route path="/lojista/chats" element={<ProtectedRoute roles={["lojista"]}><LojistaChatsPage /></ProtectedRoute>} />
      <Route path="/lojista/agendamentos" element={<ProtectedRoute roles={["lojista"]}><AgendamentosPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
