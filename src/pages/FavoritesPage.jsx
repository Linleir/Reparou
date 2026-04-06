import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import StoreCard from '../components/StoreCard';
import { toggleFavorite } from '../features/dataSlice';
import { useState } from 'react';
import { normalize } from '../utils/format';

export default function FavoritesPage() {
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cliente = useSelector((state) => state.data.clientes.find((item) => item.id === user.id));
  const lojas = useSelector((state) => state.data.lojas.filter((loja) => cliente?.favoritos?.includes(loja.id)).filter((loja)=>normalize([loja.nome,...loja.tags,...loja.enderecoLinhas].join(' ')).includes(normalize(term))));
  return <Layout bottom={<BottomNavCliente />}><div className="profile-header2 mb-3 text-center"><h4>FAVORITOS</h4></div><input className="form-control mb-3" placeholder="Pesquisar favoritos" value={term} onChange={(e)=>setTerm(e.target.value)} /><div className="card p-2 mb-5">{lojas.length ? lojas.map((loja)=><StoreCard key={loja.id} loja={loja} favorito onToggleFavorite={(lojaId)=>dispatch(toggleFavorite({ clienteId: user.id, lojaId }))} />) : <div className="text-center text-muted p-3">Você ainda não favoritou nenhuma loja.</div>}</div></Layout>;
}
