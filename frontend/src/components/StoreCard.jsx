import React from "react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatRating } from '../utils/format';

export default function StoreCard({ loja, favorito, onToggleFavorite }) {
  const reviews = useSelector((state) => state.data.reviews);

  const reviewsLoja = reviews.filter(
    (item) => String(item.lojaId) === String(loja.id)
  );

  const media =
    reviewsLoja.length > 0
      ? reviewsLoja.reduce(
          (total, item) => total + Number(item.nota),
          0
        ) / reviewsLoja.length
      : 0;
  return (
    <div className="card p-2 text-dark mb-2">
      <div className="d-flex flex-row align-items-center gap-2">
        <Link to={`/lojas/${loja.id}`} className="d-flex flex-row align-items-center gap-2 text-decoration-none text-dark flex-grow-1">
          <img src={loja.imagem} className="item-img flex-shrink-0" />
          <div>
            <h6 className="mb-1">{loja.nome}</h6>
            <p className="mb-1 small">{loja.enderecoLinhas.join(' • ')}</p>
            <small>{loja.tags.slice(0, 3).join(' • ')}</small>
            <div className="small text-warning fw-bold">★ {formatRating(media)} ({reviewsLoja.length})</div>
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
