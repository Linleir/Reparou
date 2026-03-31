import React from 'react';
import { useNavigate } from 'react-router-dom'; // A linha que faltava!

export default function Header({ 
  titulo, 
  subtitulo, 
  imagem, 
  mostrarVoltar = false 
}) {
  const navigate = useNavigate();

  return (
    <div className="profile-header mb-3 shadow-soft text-center position-relative">
      
      {/* O botão de voltar só aparece se passarmos mostrarVoltar={true} */}
      {mostrarVoltar && (
        <button 
          onClick={() => navigate(-1)} 
          className="btn text-white position-absolute top-0 start-0 m-3 fs-4 p-0 border-0"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      )}

      {/* A imagem só renderiza se passarmos uma prop "imagem" */}
      {imagem && (
        <img src={imagem} className="profile-img mb-2" alt={titulo} />
      )}

      {/* Título e Subtítulo dinâmicos */}
      <h5 className="mb-0 text-white">{titulo}</h5>
      
      {subtitulo && (
        <p className="profile-user-subinfo mb-0 mt-1">{subtitulo}</p>
      )}
      
    </div>
  );
}