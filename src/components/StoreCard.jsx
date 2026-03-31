import React from 'react';

export default function StoreCard({ loja, onClick }) {
  // Safe extraction of address
  const enderecoResumo = 
    loja?.enderecos?.length > 0 
      ? loja.enderecos[0] 
      : 'Endereço não disponível';

  // Safe numeric conversion for the rating
  const rating = typeof loja?.media === 'number' ? loja.media.toFixed(1) : '0.0';

  return (
    <div 
      className="list-group-item d-flex gap-3 align-items-center border-0 shadow-sm rounded-4 mb-2"
      onClick={onClick}
      role="button" // Better for accessibility than just style
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img 
        src={loja.imagem || 'https://via.placeholder.com/70'} 
        className="rounded-3 flex-shrink-0" 
        width="70" 
        height="70" 
        alt={loja.nome} 
        style={{ objectFit: 'cover' }}
      />
      
      <div className="flex-grow-1 overflow-hidden">
        <h6 className="mb-0 fw-bold text-dark text-truncate">{loja.nome}</h6>
        <p className="small text-muted mb-0 text-truncate">{enderecoResumo}</p>
      </div>
      
      <div className="text-warning fw-bold text-end flex-shrink-0" style={{ minWidth: '45px' }}>
        ★ {rating}
      </div>
    </div>
  );
}