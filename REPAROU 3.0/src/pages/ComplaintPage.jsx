import React, { useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { saveDenuncia } from '../features/dataSlice';

const reasons = ['Racismo', 'Fraude', 'Assédio', 'Furto', 'Serviço', 'Outro'];

export default function ComplaintPage() {
  const { id } = useParams();
  const loja = useSelector((state) => state.data.lojas.find((item) => item.id === id));
  const [selecionados, setSelecionados] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!loja) return null;
  const toggle = (item) => setSelecionados((prev) => prev.includes(item) ? prev.filter((x)=>x!==item) : [...prev, item]);
  return <Layout bottom={<BottomNavCliente />}><div className="profile-header2 mb-3"><Link to={`/lojas/${id}`} className="text-white text-decoration-none">←</Link><div className="text-center mt-2"><img src={loja.imagem} className="shop-img mb-2" /><h4>{loja.titulo}</h4><div>{loja.enderecoLinhas.join(' • ')}</div><div>{loja.telefones.join(' • ')}</div></div><div className="d-flex justify-content-center gap-2 loja-tabs mt-3"><Link className="loja-tab" to={`/lojas/${id}`}>Serviços</Link><Link className="loja-tab" to={`/lojas/${id}/avaliacoes`}>Avaliações</Link><span className="loja-tab loja-tab-active">Denunciar</span></div></div><div className="card p-3 mb-5"><p className="small">Selecione os motivos da denúncia:</p><div className="d-flex flex-wrap gap-2 mb-3">{reasons.map((motivo)=><label key={motivo} className="tag-container"><input type="checkbox" checked={selecionados.includes(motivo)} onChange={()=>toggle(motivo)} /> <span className="tag">{motivo}</span></label>)}</div><textarea className="form-control mb-3" rows={4} placeholder="Descreva o ocorrido" value={descricao} onChange={(e)=>setDescricao(e.target.value)} /><p className="small">{msg}</p><button className="btn btn-custom w-100 mb-2" onClick={async()=>{ if(!selecionados.length){ setMsg('Selecione pelo menos 1 motivo para enviar a denúncia.'); return; } await dispatch(saveDenuncia({ id: String(Date.now()), lojaId: loja.id, lojaNome: loja.titulo, motivos: selecionados, descricao, data: new Date().toISOString().slice(0,10), status: 'Pendente' })); navigate(`/lojas/${id}`); }}>Enviar denúncia</button><button className="btn btn-outline-secondary w-100" onClick={()=>navigate(`/lojas/${id}`)}>Cancelar</button></div></Layout>;
}
