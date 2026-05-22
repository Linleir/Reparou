import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { formatRating } from '../utils/format';

export default function LojaLojistaPage() {
  const { id } = useParams();
 
  const loja = useSelector((state) =>
  state.data.lojas.find(
    (item) => String(item.id) === String(id)
  )
);



  const reviews = useSelector((state) =>
  state.data.reviews.filter(
    (item) => String(item.lojaId) === String(id)
  )
);

const media =
  reviews.length > 0
    ? reviews.reduce(
        (total, item) => total + Number(item.nota),
        0
      ) / reviews.length
    : 0;

  

  if (!loja) {
    return (
      <Layout bottom={<BottomNavLojista />}>
        <div className="card p-3 text-center">
          <p>Loja não encontrada.</p>
          <Link to="/lojista/perfil" className="btn btn-secondary rounded-pill">Voltar</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout bottom={<BottomNavLojista />}>
      <div className="profile-header2 mb-3">
        <Link to="/lojista/perfil" className="text-white text-decoration-none">←</Link>

        <div className="text-center">
          <img src={loja.imagem || '/imgtst.jpg'} className="shop-img mb-2" alt={loja.nome} />
          <h4>{loja.titulo || loja.nome}</h4>
          <div>
            {loja.enderecoLinhas?.[0]}
            <br />
            {loja.enderecoLinhas?.[1]}
          </div>
          <div>{(loja.telefones || []).join(' • ')}</div>
          <div className="mt-2">
           ★ {formatRating(media)} ({reviews.length})
          </div>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h6>Tags</h6>
        <div className="d-flex flex-wrap gap-2">
          {(loja.tags || []).length ? (
            loja.tags.map((tag) => (
              <span key={tag} className="review-service-chip">{tag}</span>
            ))
          ) : (
            <span className="text-muted small">Nenhuma tag cadastrada.</span>
          )}
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h6>Serviços</h6>
        {(loja.servicos || []).length ? (
          loja.servicos.map((servico) => (
            <div key={servico.id} className="list-group-item px-0">
              <strong>{servico.nome}</strong>
              <div className="small text-muted">{servico.preco || 'Orçamento a combinar'}</div>
              <div className="small text-muted">{servico.tag}</div>
            </div>
          ))
        ) : (
          <div className="text-muted small">Nenhum serviço cadastrado.</div>
        )}
      </div>

      <div className="card p-3 mb-5">
  <h6>Avaliações</h6>

  {reviews.length ? (
    reviews.map((review) => (
      <div key={review.id} className="border-bottom pb-2 mb-2">
        <div className="fw-bold">
          {review.cliente} - ★ {formatRating(review.nota)}
        </div>

        <div className="small text-muted">
          {review.tituloServico}
        </div>

        <div>{review.texto}</div>
      </div>
    ))
  ) : (
    <div className="text-muted small">
      Nenhuma avaliação ainda.
    </div>
  )}
</div>
        <Link to={`/lojista/loja/${loja.id}/editar`} className="btn btn-custom w-100 mb-2">
          Editar informações da loja
        </Link>

        <Link to={`/lojista/loja/${loja.id}/tags-servicos`} className="btn btn-outline-dark w-100">
          Editar tags e serviços
        </Link>
    </Layout>
  );
}
