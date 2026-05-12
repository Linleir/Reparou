import React, { useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import StoreCard from '../components/StoreCard';
import { toggleFavorite } from '../features/dataSlice';
import { normalize } from '../utils/format';

export default function HomePage() {
  const [pesquisa, setPesquisa] = useState('');
  const [tagsPesquisa, setTagsPesquisa] = useState('');
  const [aberto, setAberto] = useState(false);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  const { lojas } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);
  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user.id)
  );
  const dispatch = useDispatch();

  const todasTags = useMemo(
    () =>
      [
        ...new Set(
          lojas.flatMap((loja) => [
            ...loja.tags,
            ...loja.servicos.map((s) => s.nome),
            ...loja.servicos.map((s) => s.tag),
          ])
        ),
      ].sort(),
    [lojas]
  );

  const lojasFiltradas = useMemo(
    () =>
      lojas.filter((loja) => {
        const base = normalize(
          [
            loja.nome,
            ...loja.enderecoLinhas,
            ...loja.tags,
            ...loja.servicos.map((s) => s.nome),
            ...loja.servicos.map((s) => s.tag),
          ].join(' | ')
        );

        const textoOk =
          !pesquisa.trim() ||
          normalize(pesquisa)
            .split(/\s+/)
            .every((part) => base.includes(part));

        const tagsOk = tagsSelecionadas.every((tag) =>
          base.includes(normalize(tag))
        );

        return textoOk && tagsOk;
      }),
    [lojas, pesquisa, tagsSelecionadas]
  );

  const recomendacoes = useMemo(() => {
    if (!lojas.length) return [];
    return [...lojas].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [lojas]);

  const lojasExibidas =
    pesquisa.trim() || tagsSelecionadas.length ? lojasFiltradas : recomendacoes;

  const disponiveis = todasTags.filter(
    (tag) =>
      !tagsSelecionadas.includes(tag) &&
      normalize(tag).includes(normalize(tagsPesquisa))
  );

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Pesquisar loja, bairro ou serviço"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <button
          className={`btn btn-custom ${aberto ? 'active' : ''}`}
          onClick={() => setAberto(!aberto)}
        >
          Filtro
        </button>
        <Link to="/perfil" className="btn btn-outline-secondary">
          <i className="fa-solid fa-user" />
        </Link>
      </div>

      {aberto && (
        <div className="card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Filtrar por tags e serviços</h6>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setTagsSelecionadas([]);
                setTagsPesquisa('');
              }}
            >
              Limpar
            </button>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-2">
            {tagsSelecionadas.map((tag) => (
              <button
                key={tag}
                className="btn btn-sm btn-custom"
                onClick={() =>
                  setTagsSelecionadas(
                    tagsSelecionadas.filter((item) => item !== tag)
                  )
                }
              >
                {tag} ×
              </button>
            ))}
          </div>

          <input
            className="form-control mb-2"
            placeholder="Pesquisar tags ou serviços"
            value={tagsPesquisa}
            onChange={(e) => setTagsPesquisa(e.target.value)}
          />

          <div className="d-flex flex-wrap gap-2">
            {disponiveis.map((tag) => (
              <button
                key={tag}
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setTagsSelecionadas([...tagsSelecionadas, tag])}
              >
                {tag} +
              </button>
            ))}
          </div>
        </div>
      )}

      <h5 className="mb-3">
        {pesquisa || tagsSelecionadas.length
          ? `${lojasFiltradas.length} loja${lojasFiltradas.length === 1 ? '' : 's'} encontrada${lojasFiltradas.length === 1 ? '' : 's'}`
          : 'Recomendações baseadas no seu local'}
      </h5>

      <div className="card p-2 mb-5">
        {lojasExibidas.length ? (
          lojasExibidas.map((loja) => (
            <StoreCard
              key={loja.id}
              loja={loja}
              favorito={cliente?.favoritos?.includes(loja.id)}
              onToggleFavorite={(lojaId) =>
                dispatch(toggleFavorite({ clienteId: user.id, lojaId }))
              }
            />
          ))
        ) : (
          <div className="text-center text-muted p-3">
            Nenhuma loja encontrada com esses filtros.
          </div>
        )}
      </div>
    </Layout>
  );
}
