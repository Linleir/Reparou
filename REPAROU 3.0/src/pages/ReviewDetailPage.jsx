import React, { useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { saveReview } from '../features/dataSlice';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const review = useSelector((state) =>
    state.data.reviews.find((r) => String(r.id) === String(id))
  );

  const [nota, setNota] = useState(review?.nota || 5);
  const [texto, setTexto] = useState(review?.texto || '');

  const handleSave = async () => {
    await dispatch(
      saveReview({
        review: {
          ...review,
          nota,
          texto,
        },
        chatId: review.chatId,
      })
    );
    navigate('/avaliacoes/historico');
  };

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3">
        <Link to="/avaliacoes/historico" className="text-white text-decoration-none">←</Link>
        <h4 className="mt-2">Editar Avaliação</h4>
      </div>

      <div className="card p-3 mb-5">

        <div className="mb-3">
          <h6>Sua nota</h6>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNota(star)}
                style={{
                  fontSize: '1.8rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: star <= nota ? '#f4b400' : '#d4d4d4',
                  textShadow: star <= nota ? '0 1px 0 #c58a00' : 'none'
                }}
              >
                ★
              </button>
            ))}
          </div>

          <div className="mt-1 small text-muted">
            Nota selecionada: {nota} de 5
          </div>
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <button className="btn btn-custom w-100 mb-2" onClick={handleSave}>
          Salvar alterações
        </button>

        <Link to="/avaliacoes/historico" className="btn btn-outline-dark w-100">
          Cancelar
        </Link>
      </div>
    </Layout>
  );
}
