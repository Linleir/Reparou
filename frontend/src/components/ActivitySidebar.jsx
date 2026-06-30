import React from "react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDate, formatRating } from '../utils/format';

function ActivityEmpty({ icon, text }) {
  return (
    <div className="activity-empty">
      <i className={`fa-solid ${icon}`}></i>
      <span>{text}</span>
    </div>
  );
}

function ActivitySection({ title, viewAllTo, children }) {
  return (
    <div className="activity-section">
      <div className="activity-section-head">
        <h6>{title}</h6>
        {viewAllTo && (
          <Link to={viewAllTo} className="activity-section-link">Ver tudo</Link>
        )}
      </div>
      {children}
    </div>
  );
}

function FavoriteRow({ loja }) {
  return (
    <Link to={`/lojas/${loja.id}`} className="activity-row">
      <img src={loja.imagem} alt={loja.nome} className="activity-row-img" />
      <div className="activity-row-text">
        <span className="activity-row-title">{loja.nome}</span>
        <span className="activity-row-sub">{(loja.enderecoLinhas || []).join(' • ')}</span>
      </div>
      <i className="fa-solid fa-heart activity-row-heart"></i>
    </Link>
  );
}

function ReviewRow({ review, loja }) {
  return (
    <Link to={`/avaliacoes/${review.id}`} className="activity-row">
      <img src={loja?.imagem} alt={loja?.nome} className="activity-row-img" />
      <div className="activity-row-text">
        <span className="activity-row-title">{loja?.nome || 'Loja'}</span>
        <span className="activity-row-sub">{formatDate(review.dataIso)}</span>
      </div>
      <span className="activity-row-rating">★ {formatRating(review.nota)}</span>
    </Link>
  );
}

function ClienteActivity() {
  const { user } = useSelector((state) => state.auth);
  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user?.id)
  );
  const lojas = useSelector((state) => state.data.lojas || []);
  const reviews = useSelector((state) =>
    (state.data.reviews || []).filter((item) =>
      (state.chat.chats || []).some(
        (chat) => String(chat.id) === String(item.chatId) && String(chat.clienteId) === String(user?.id)
      )
    )
  );

  const favoritos = (cliente?.favoritos || [])
    .map((lojaId) => lojas.find((loja) => String(loja.id) === String(lojaId)))
    .filter(Boolean)
    .slice(0, 3);

  const avaliacoesRecentes = [...reviews]
    .sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso))
    .slice(0, 3);

  return (
    <>
      <ActivitySection title="Favoritos" viewAllTo="/favoritos">
        {favoritos.length > 0 ? (
          favoritos.map((loja) => <FavoriteRow key={loja.id} loja={loja} />)
        ) : (
          <ActivityEmpty icon="fa-heart" text="Nenhum favorito ainda" />
        )}
      </ActivitySection>

      <ActivitySection title="Avaliações recentes" viewAllTo="/avaliacoes/historico">
        {avaliacoesRecentes.length > 0 ? (
          avaliacoesRecentes.map((review) => (
            <ReviewRow
              key={review.id}
              review={review}
              loja={lojas.find((loja) => String(loja.id) === String(review.lojaId))}
            />
          ))
        ) : (
          <ActivityEmpty icon="fa-star" text="Nenhuma avaliação ainda" />
        )}
      </ActivitySection>
    </>
  );
}

function LojistaActivity() {
  const { user } = useSelector((state) => state.auth);
  const lojas = useSelector((state) =>
    (state.data.lojas || []).filter((loja) => String(loja.lojistaId) === String(user?.id))
  );
  const lojaIds = lojas.map((loja) => String(loja.id));

  const reviews = useSelector((state) =>
    (state.data.reviews || []).filter((item) => lojaIds.includes(String(item.lojaId)))
  );

  const avaliacoesRecentes = [...reviews]
    .sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso))
    .slice(0, 3);

  const mediaGeral = reviews.length
    ? reviews.reduce((total, item) => total + Number(item.nota), 0) / reviews.length
    : 0;

  return (
    <>
      <ActivitySection title="Minhas lojas">
        {lojas.length > 0 ? (
          lojas.slice(0, 3).map((loja) => <FavoriteRow key={loja.id} loja={loja} />)
        ) : (
          <ActivityEmpty icon="fa-store" text="Nenhuma loja cadastrada" />
        )}
      </ActivitySection>

      <ActivitySection title="Avaliações recentes" viewAllTo="/lojista/perfil">
        {avaliacoesRecentes.length > 0 ? (
          <>
            <div className="activity-rating-summary">
              <span className="activity-rating-value">★ {formatRating(mediaGeral)}</span>
              <span className="activity-rating-count">{reviews.length} avaliações</span>
            </div>
            {avaliacoesRecentes.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                loja={lojas.find((loja) => String(loja.id) === String(review.lojaId))}
              />
            ))}
          </>
        ) : (
          <ActivityEmpty icon="fa-star" text="Nenhuma avaliação recebida" />
        )}
      </ActivitySection>
    </>
  );
}

export default function ActivitySidebar() {
  const { role } = useSelector((state) => state.auth);

  if (role === 'guest' || !role) {
    return null;
  }

  return (
    <aside className="activity-sidebar">
      {role === 'lojista' ? <LojistaActivity /> : <ClienteActivity />}
    </aside>
  );
}
