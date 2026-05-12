import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from "react";
import Layout, { BottomNavCliente } from '../components/Layout';
import { selectChatsByCliente } from '../utils/selectors';
import { formatDateTime, normalize } from '../utils/format';

export default function MessagesPage() {
  const [term, setTerm] = useState('');
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => selectChatsByCliente(state, user.id)).filter((chat)=>normalize([chat.tituloServico,...chat.mensagens.map((m)=>m.texto)].join(' ')).includes(normalize(term)));
  const lojas = useSelector((state) => state.data.lojas);
  return <Layout bottom={<BottomNavCliente />}><div className="profile-header2 chat-history-header mb-3 text-center"><h4>HISTÓRICO DE CHATS</h4><div className="chat-subtitle">Converse com as lojas e acompanhe o andamento dos seus atendimentos.</div></div><input className="form-control mb-3" placeholder="Pesquisar conversa" value={term} onChange={(e)=>setTerm(e.target.value)} /><div className="card p-2 mb-5">{chats.length ? chats.map((chat)=>{ const loja=lojas.find((l)=>l.id===chat.lojaId); const last=chat.mensagens.at(-1); return <Link key={chat.id} to={`/chat/${chat.id}`} className="list-group-item d-flex gap-3 align-items-start"><img src={loja?.imagem} className="rounded" width="100" height="100" /><div className="flex-grow-1"><div className="d-flex justify-content-between"><h6 className="mb-1">{loja?.nome}</h6><small className="text-muted">{last ? formatDateTime(last.horario) : ''}</small></div><div className="small text-muted">{chat.tituloServico}</div><div className="mb-1">{(chat.tags||[]).map((tag)=><span key={tag} className="review-service-chip me-1">{tag}</span>)}</div><div className="small">{last?.texto || 'Sem mensagens ainda.'}</div><span className={`chat-status-badge ${chat.status}`}>{chat.status.replaceAll('-', ' ')}</span></div></Link>;}) : <div className="text-center text-muted p-3">Nenhum chat encontrado para essa pesquisa.</div>}</div></Layout>;
}
