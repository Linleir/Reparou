import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { selectChatsByLojista } from '../utils/selectors';
import { normalize } from '../utils/format';

export default function LojistaChatsPage() {
  const [term, setTerm] = useState('');
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => selectChatsByLojista(state, user.id)).filter((chat)=>normalize([chat.tituloServico,...chat.mensagens.map((m)=>m.texto)].join(' ')).includes(normalize(term)));
  const lojas = useSelector((state) => state.data.lojas);
  return <Layout bottom={<BottomNavLojista />}><div className="profile-header2 mb-3 text-center"><h4>CAIXA DE ENTRADA</h4></div><input className="form-control mb-3" placeholder="Pesquisar conversas" value={term} onChange={(e)=>setTerm(e.target.value)} /><div className="card p-2 mb-5">{chats.length ? chats.map((chat)=>{ const loja=lojas.find((item)=>item.id===chat.lojaId); const last=chat.mensagens.at(-1); return <Link key={chat.id} to={`/chat/${chat.id}`} className="list-group-item list-group-item-action item-card chat-history-card"><div className="w-100"><div className="d-flex justify-content-between align-items-center"><h6 className="mb-0">{chat.clienteNome} <span className="text-muted small">({loja?.nome})</span></h6></div><p className="fw-bold mt-1 mb-1">{chat.tituloServico}</p><div className="mb-1">{(chat.tags||[]).map((tag)=><span key={tag} className="review-service-chip me-1">{tag}</span>)}</div><p className="text-muted small text-truncate mb-1">{last?.texto}</p><span className={`chat-status-badge ${chat.status}`}>{chat.status}</span></div></Link>; }) : <div className="text-center p-3 text-muted">Nenhum contacto de cliente encontrado.</div>}</div></Layout>;
}
