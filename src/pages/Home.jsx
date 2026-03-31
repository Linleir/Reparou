import React, { useEffect } from 'react'; // Corrigido: React e useEffect na mesma linha
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { buscarLojas } from '../store/lojasSlice';
import Header from '../components/Header';
import StoreCard from '../components/StoreCard';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Pegamos os dados do Redux
  const { lista, status, erro } = useSelector((state) => state.lojas);

  // Disparamos o fetch (GET) quando a tela carrega
  useEffect(() => {
    if (status === 'idle') {
      dispatch(buscarLojas());
    }
  }, [status, dispatch]);

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          
          <Header titulo="Recomendações" subtitulo="Encontre a melhor assistência" />

          {/* Tratamento de Estados do Redux */}
          {status === 'loading' && <div className="text-center my-5">Carregando lojas...</div>}
          {status === 'failed' && <div className="alert alert-danger">{erro}</div>}

          <div className="list-group mt-3">
            {lista.map((loja) => (
              <StoreCard 
                key={loja.id} 
                loja={loja} 
                onClick={() => navigate(`/loja/${loja.id}`)} 
              />
            ))}
          </div>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}