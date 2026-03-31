import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([
    { id: 1, texto: "Olá! Como podemos ajudar com o seu aparelho?", autor: 'loja' }
  ]);

  const enviar = (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    setConversa([...conversa, { id: Date.now(), texto: mensagem, autor: 'cliente' }]);
    setMensagem('');
  };

  return (
    <div className="container py-2 d-flex flex-column vh-100">
      <div className="row justify-content-center flex-grow-1 overflow-hidden">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4 d-flex flex-column">
          
          <Header titulo="Chat" mostrarVoltar={true} />

          <div className="flex-grow-1 overflow-auto p-2 d-flex flex-column gap-2">
            {conversa.map(m => (
              <div 
                key={m.id} 
                className={`p-2 rounded-4 shadow-sm ${m.autor === 'cliente' ? 'bg-primary text-white align-self-end' : 'bg-white text-dark align-self-start'}`}
                style={{ maxWidth: '80%' }}
              >
                {m.texto}
              </div>
            ))}
          </div>

          <div className="bg-white p-3 border-top shadow-lg rounded-top-4 mt-2">
            <form onSubmit={enviar} className="input-group">
              <input 
                type="text" 
                className="form-control rounded-start-pill bg-light" 
                placeholder="Diga algo..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <button className="btn btn-dark rounded-end-pill px-4" type="submit">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}