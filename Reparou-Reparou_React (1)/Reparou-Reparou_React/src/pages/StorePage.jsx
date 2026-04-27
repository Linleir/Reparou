import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { toggleFavorite } from '../features/dataSlice';
import { formatRating, normalize } from '../utils/format';

export default function StorePage() {
  const { id } = useParams();
  const [term, setTerm] = useState('');

  const loja = useSelector((state) =>
    state.data.lojas.find((item) => String(item.id) === String(id))
  );
  const user = useSelector((state) => state.auth.user);
  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user.id)
  );
  const dispatch = useDispatch();

  const servicos = useMemo(() => {
    if (!loja?.servicos) return [];

    return loja.servicos.filter((servico) =>
      normalize([servico.nome, servico.tag, servico.preco].join(' ')).includes(normalize(term))
    );
  }, [loja, term]);

  if (!loja) return null;

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3">
        <div className="d-flex justify-content-between align-items-start">
          <Link to="/inicio" className="text-white text-decoration-none">
            ←
          </Link>

          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => dispatch(toggleFavorite({ clienteId: user.id, lojaId: loja.id }))}
          >
            <i className={`fa-${cliente?.favoritos?.includes(loja.id) ? 'solid' : 'regular'} fa-heart`} />
          </button>
        </div>

        <div className="text-center">
          <img src={loja.imagem} className="shop-img mb-2" alt={loja.nome} />
          <h4>{loja.titulo}</h4>
          <div>
            {loja.enderecoLinhas?.[0]}
            <br />
            {loja.enderecoLinhas?.[1]}
          </div>
          <div>{(loja.telefones || []).join(' • ')}</div>
          <div className="mt-2">
            ★ {formatRating(loja.media)} ({loja.quantidadeAvaliacoes})
          </div>
        </div>

        <div className="d-flex justify-content-center gap-2 loja-tabs mt-3">
          <span className="loja-tab loja-tab-active">Serviços</span>
          <Link className="loja-tab" to={`/lojas/${id}/avaliacoes`}>
            Avaliações
          </Link>
          <Link className="loja-tab" to={`/lojas/${id}/denuncia`}>
            Denunciar
          </Link>
        </div>
      </div>

      <div className="card p-3 mb-5">
        <input
          className="form-control mb-3"
          placeholder="Pesquisar serviço"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <div>
          {servicos.length ? (
            servicos.map((servico) => (
              <div
                key={servico.id}
                className="list-group-item mb-2 shadow-sm rounded-custom border-0"
                style={{ background: '#fff', color: '#000' }}
              >
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <strong>{servico.nome}</strong>
                    <div className="small text-muted">
                      {servico.preco || 'Orçamento a combinar'}
                    </div>
                    <div className="small text-muted">{servico.tag}</div>
                  </div>

                  <div className="text-end">
                    <div className="text-warning fw-bold">
                      {formatRating(servico.nota || 0)} ★
                    </div>
                    <small className="text-muted">
                      ({servico.quantidadeAvaliacoes || 0})
                    </small>
                  </div>
                </div>

                <Link
                  to={`/chat/novo-${id}-${servico.id}?lojaId=${id}&servicoId=${servico.id}`}
                  className="btn btn-dark btn-sm w-100 mt-2"
                >
                  Conversar sobre este serviço
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-muted p-3">
              Nenhum serviço cadastrado para esta loja.
            </div>
          )}
        </div>
      </div>

      <Link to={`/chat/novo-${id}?lojaId=${id}`} className="store-chat-fab">
        <i className="fa-solid fa-comment" /> Chat
      </Link>
    </Layout>
  );
}
