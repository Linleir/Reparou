import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';

export default function LojaLojistaPage() {
  const { id } = useParams();
  const loja = useSelector((state) => state.data.lojas.find((item) => item.id === id));
  const lojista = useSelector((state) => state.data.lojistas.find((item) => item.id === loja?.lojistaId));
  if (!loja) return null;
  return <Layout bottom={<BottomNavLojista />}><div className="profile-header2 mb-3"><Link to="/lojista/perfil" className="text-white text-decoration-none">←</Link><h4 className="mt-2">{loja.nome}</h4><div>{lojista?.responsavel}</div></div><div className="card p-3 mb-5"><h6>Endereços</h6>{loja.enderecos.map((item, index)=><div key={index} className="list-group-item">{item}</div>)}<h6 className="mt-3">Telefones</h6>{loja.telefones.map((item, index)=><div key={index} className="list-group-item">{item}</div>)}<h6 className="mt-3">Tags</h6><div>{loja.tags.map((tag)=><span key={tag} className="badge bg-secondary me-1">{tag}</span>)}</div><Link to={`/lojista/loja/${id}/editar`} className="btn btn-custom w-100 mt-3">Editar loja</Link></div></Layout>;
}
