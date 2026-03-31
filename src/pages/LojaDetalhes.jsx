
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function LojaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Buscamos a loja específica dentro da lista que já está no Redux
  const loja = useSelector((state) => 
    state.lojas.lista.find((l) => l.id === id)
  );

  if (!loja) return <div className="text-center mt-5">Loja não encontrada.</div>;

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          
          <Header 
            titulo={loja.nome} 
            imagem={loja.imagem} 
            mostrarVoltar={true} 
          />

          <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
            <h6 className="fw-bold">Serviços Disponíveis</h6>
            <div className="list-group list-group-flush">
              {loja.servicos.map(s => (
                <div key={s.id} className="list-group-item d-flex justify-content-between px-0 py-2 border-bottom">
                  <span>{s.nome}</span>
                  <span className="fw-bold text-success">{s.preco}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow"
            onClick={() => navigate(`/chat/${loja.id}`)}
          >
            <i className="fa-solid fa-comments me-2"></i> FALAR COM A LOJA
          </button>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}