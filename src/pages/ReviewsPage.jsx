import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { formatRating } from '../utils/format';

export default function ReviewsPage() {
  const { id } = useParams();
  const loja = useSelector((state) => state.data.lojas.find((item) => item.id === id));
  const reviews = useSelector((state) => state.data.reviews.filter((item) => item.lojaId === id));
  if (!loja) return null;
  return <Layout bottom={<BottomNavCliente />}><div className="profile-header2 mb-3"><Link to={`/lojas/${id}`} className="text-white text-decoration-none">←</Link><div className="text-center"><img src={loja.imagem} className="shop-img mb-2" /><h4>{loja.titulo}</h4><div>{loja.enderecoLinhas.join(' • ')}</div><div>{loja.telefones.join(' • ')}</div><div className="mt-2">★ {formatRating(loja.media)} ({loja.quantidadeAvaliacoes})</div></div><div className="d-flex justify-content-center gap-2 loja-tabs mt-3"><Link className="loja-tab" to={`/lojas/${id}`}>Serviços</Link><span className="loja-tab loja-tab-active">Avaliações</span><Link className="loja-tab" to={`/lojas/${id}/denuncia`}>Denunciar</Link></div></div><div className="card p-3 mb-5"><div className="d-flex flex-wrap gap-2 mb-3">{[...new Set(reviews.flatMap((r)=>r.tags||[]))].map((tag)=><span key={tag} className="review-filter-chip">{tag}</span>)}</div>{reviews.map((avaliacao)=><div className="card mb-3" key={avaliacao.id}><div className="card-body"><div className="d-flex justify-content-between align-items-start"><div className="d-flex"><img src={loja.imagem} className="shop-img me-3" style={{width:'50px',height:'50px'}} /><div><h6 className="mb-0"><strong>{avaliacao.cliente}</strong></h6><div className="my-1">{(avaliacao.tags||[]).map((tag)=><span key={tag} className="review-service-chip me-1">{tag}</span>)}</div></div></div><div className="text-warning">{formatRating(avaliacao.nota)}★</div></div><p className="mt-2 mb-0" style={{fontSize:'0.9rem',color:'#444'}}>{avaliacao.texto}</p></div></div>)}</div><Link to={`/chat/novo-${id}?lojaId=${id}`} className="store-chat-fab"><i className="fa-solid fa-comment" /> Chat</Link></Layout>;
}
