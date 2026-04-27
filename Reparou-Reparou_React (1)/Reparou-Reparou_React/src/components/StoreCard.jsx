import React from "react";
import { Link } from 'react-router-dom';
import { formatRating } from '../utils/format';

export default function StoreCard({ loja, favorito, onToggleFavorite }) {
  return (
    <div className="card p-2 text-dark mb-2">
      <div className="d-flex flex-row align-items-center gap-2">
        <Link to={`/lojas/${loja.id}`} className="d-flex flex-row align-items-center gap-2 text-decoration-none text-dark flex-grow-1">
          <img src={loja.imagem} className="item-img flex-shrink-0" />
          <div>
            <h6 className="mb-1">{loja.nome}</h6>
            <p className="mb-1 small">{loja.enderecoLinhas.join(' • ')}</p>
            <small>{loja.tags.slice(0, 3).join(' • ')}</small>
            <div className="small text-warning fw-bold">★ {formatRating(loja.media)} ({loja.quantidadeAvaliacoes})</div>
          </div>
        </Link>
        {onToggleFavorite && (
          <button type="button" className={`btn btn-sm btn-light ${favorito ? 'active' : ''}`} onClick={() => onToggleFavorite(loja.id)}>
            <i className={`fa-${favorito ? 'solid' : 'regular'} fa-heart`} />
          </button>
        )}
      </div>
    </div>
  );
}
