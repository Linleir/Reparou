import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { formatDate, formatRating } from '../utils/format';

export default function ReviewHistoryPage() {
  const { user } = useSelector((state) => state.auth);
  const reviews = useSelector((state) =>
    state.data.reviews.filter(
      (item) =>
        item.chatId &&
        state.data.chats.some(
          (chat) => chat.id === item.chatId && chat.clienteId === user.id
        )
    )
  );
  const lojas = useSelector((state) => state.data.lojas);

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3 text-center">
        <h4>HISTÓRICO DE AVALIAÇÕES</h4>
      </div>

      <div className="card p-2 mb-5">
        {reviews.length ? (
          reviews.map((avaliacao) => {
            const loja = lojas.find((l) => l.id === avaliacao.lojaId);

            return (
              <Link
                key={avaliacao.id}
                to={`/avaliacoes/${avaliacao.id}`}
                className="list-group-item d-flex gap-3 align-items-start"
              >
                <img
                  src={loja?.imagem}
                  className="rounded"
                  width="70"
                  height="70"
                  alt={loja?.nome || 'Loja'}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1">Sobre a {loja?.nome}</h6>

                  <div className="mb-1">
                    <span className="review-service-chip">
                      {avaliacao.tituloServico}
                    </span>
                  </div>

                  <div className="mb-1">
                    {(avaliacao.tags || []).map((tag) => (
                      <span key={tag} className="review-service-chip me-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mb-1 small">{avaliacao.texto}</p>
                  <small className="text-muted">{formatDate(avaliacao.dataIso)}</small>
                </div>

                <div
                  className="text-end fw-bold"
                  style={{ color: '#f4b400', textShadow: '0 1px 0 #c58a00' }}
                >
                  ★ {formatRating(avaliacao.nota)}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center text-muted p-3">
            Você ainda não avaliou nenhum atendimento.
          </div>
        )}
      </div>
    </Layout>
  );
}
