import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { saveLoja } from '../features/dataSlice';

const allTags = [
  'Diagnóstico',
  'Reparo',
  'Formatação',
  'Limpeza',
  'Upgrade',
  'SSD',
  'HD',
  'Memória RAM',
  'Placa-mãe',
  'Fonte',
  'Placa de vídeo',
  'Notebook',
  'Desktop',
  'Periféricos',
  'Teclado',
  'Mouse',
  'Headset',
  'Tela',
  'Bateria',
  'BIOS',
  'Cooler',
  'Setup Gamer',
  'Console',
  'Controle',
  'HDMI',
  'iPhone',
  'Celular',
  'Windows',
  'Backup',
];

function uniq(lista) {
  return [...new Set((lista || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function criarServicoDaTag(tag) {
  return {
    id: `servico-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    tag,
    nome: tag,
    preco: '',
    precoMin: '',
    precoMax: '',
    nota: 0,
    quantidadeAvaliacoes: 0,
  };
}

function parsePreco(preco) {
  const texto = String(preco || '');
  const nums = texto.match(/\d+(?:[.,]\d+)?/g) || [];
  return {
    precoMin: nums[0] || '',
    precoMax: nums[1] || '',
  };
}

function montarPreco(min, max) {
  const limpoMin = String(min || '').trim();
  const limpoMax = String(max || '').trim();

  if (limpoMin && limpoMax) return `R$ ${limpoMin} - ${limpoMax}`;
  if (limpoMin) return `A partir de R$ ${limpoMin}`;
  if (limpoMax) return `Até R$ ${limpoMax}`;
  return '';
}

export default function EditTagsServicesPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loja = useSelector((state) =>
    state.data.lojas.find((item) => String(item.id) === String(id))
  );

  const [pesquisaTag, setPesquisaTag] = useState('');
  const [tags, setTags] = useState(loja?.tags || []);
  const [servicos, setServicos] = useState(
    (loja?.servicos || []).map((servico) => ({
      ...servico,
      ...parsePreco(servico.preco),
    }))
  );
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(
    loja?.servicos?.[0]?.id || ''
  );
  const [pesquisaServico, setPesquisaServico] = useState('');

  useEffect(() => {
    if (!servicoSelecionadoId && servicos.length) {
      setServicoSelecionadoId(servicos[0].id);
    }

    if (servicoSelecionadoId && !servicos.some((servico) => String(servico.id) === String(servicoSelecionadoId))) {
      setServicoSelecionadoId(servicos[0]?.id || '');
    }
  }, [servicos, servicoSelecionadoId]);

  const tagsDisponiveis = useMemo(
    () =>
      allTags.filter(
        (tag) =>
          !tags.includes(tag) &&
          tag.toLowerCase().includes(pesquisaTag.toLowerCase())
      ),
    [pesquisaTag, tags]
  );

  const servicosFiltrados = useMemo(
    () =>
      servicos.filter((servico) =>
        String(servico.tag || '')
          .toLowerCase()
          .includes(pesquisaServico.toLowerCase())
      ),
    [servicos, pesquisaServico]
  );

  const servicoSelecionadoIndex = servicos.findIndex(
    (servico) => String(servico.id) === String(servicoSelecionadoId)
  );
  const servicoSelecionado = servicos[servicoSelecionadoIndex];

  const adicionarTag = (tag) => {
    const novasTags = uniq([...tags, tag]);
    const existeServico = servicos.some(
      (servico) => String(servico.tag).toLowerCase() === tag.toLowerCase()
    );

    setTags(novasTags);

    if (!existeServico) {
      const novo = criarServicoDaTag(tag);
      setServicos([...servicos, novo]);
      setServicoSelecionadoId(novo.id);
      setPesquisaServico('');
    }
  };

  const removerTag = (tag) => {
    const novasTags = tags.filter((item) => item !== tag);
    const novosServicos = servicos.filter(
      (servico) => String(servico.tag).toLowerCase() !== String(tag).toLowerCase()
    );

    setTags(novasTags);
    setServicos(novosServicos);

    if (
      servicoSelecionado &&
      String(servicoSelecionado.tag).toLowerCase() === String(tag).toLowerCase()
    ) {
      setServicoSelecionadoId(novosServicos[0]?.id || '');
    }
  };

  const atualizarServicoSelecionado = (campo, valor) => {
    if (servicoSelecionadoIndex < 0) return;

    setServicos(
      servicos.map((servico, index) =>
        index === servicoSelecionadoIndex
          ? {
              ...servico,
              [campo]: valor,
            }
          : servico
      )
    );
  };

  const removerServicoSelecionado = () => {
    if (!servicoSelecionado) return;

    const restantes = servicos.filter(
      (servico) => String(servico.id) !== String(servicoSelecionado.id)
    );

    setServicos(restantes);
    setTags(tags.filter((tag) => String(tag).toLowerCase() !== String(servicoSelecionado.tag).toLowerCase()));
    setServicoSelecionadoId(restantes[0]?.id || '');
  };

  const salvar = async (event) => {
    event.preventDefault();
    if (!loja) return;

    const servicosLimpos = servicos
      .map((servico) => {
        const nome = String(servico.nome || '').trim();
        const tag = String(servico.tag || '').trim();
        const precoMin = String(servico.precoMin || '').trim();
        const precoMax = String(servico.precoMax || '').trim();

        return {
          ...servico,
          id: servico.id || `servico-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          nome,
          tag,
          precoMin,
          precoMax,
          preco: montarPreco(precoMin, precoMax),
          nota: Number(servico.nota) || 0,
          quantidadeAvaliacoes: Number(servico.quantidadeAvaliacoes) || 0,
        };
      })
      .filter((servico) => servico.nome && servico.tag);

    const tagsDosServicos = servicosLimpos.map((servico) => servico.tag);
    const tagsFinais = uniq([...tags, ...tagsDosServicos]);

    await dispatch(
      saveLoja({
        id: loja.id,
        payload: {
          ...loja,
          tags: tagsFinais,
          servicos: servicosLimpos,
        },
      })
    ).unwrap();

    navigate(`/lojista/loja/${loja.id}`);
  };

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
        <Link to={`/lojista/loja/${loja.id}`} className="text-white text-decoration-none">
          ←
        </Link>
        <h4 className="mt-2">Editar tags e serviços</h4>
        <div className="small">{loja.nome}</div>
      </div>

      <div className="card p-3 mb-5">
        <form onSubmit={salvar}>
          <label className="mb-1">
            <strong>Tags da loja</strong>
          </label>

          <div className="d-flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="btn btn-sm btn-custom"
                onClick={() => removerTag(tag)}
              >
                {tag} ×
              </button>
            ))}
          </div>

          <input
            className="form-control rounded-3 mb-2"
            placeholder="Pesquisar tags"
            value={pesquisaTag}
            onChange={(e) => setPesquisaTag(e.target.value)}
          />

          <div
            className="bg-light rounded-4 p-2 mb-4"
            style={{ maxHeight: 120, overflowY: 'auto' }}
          >
            {tagsDisponiveis.map((tag) => (
              <button
                type="button"
                key={tag}
                className="btn btn-sm btn-outline-secondary me-1 mb-1"
                onClick={() => adicionarTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="alert alert-light small">
            Ao adicionar uma tag, um serviço editável com o mesmo nome é criado automaticamente.
            Ao remover uma tag, o serviço ligado a ela também é removido.
          </div>

          <label className="mb-1">
            <strong>Selecionar serviço</strong>
          </label>

          <input
            className="form-control rounded-3 mb-2"
            placeholder="Digite para encontrar uma tag de serviço"
            value={pesquisaServico}
            onChange={(e) => setPesquisaServico(e.target.value)}
          />

          <select
            className="form-select rounded-3 mb-3"
            value={servicoSelecionadoId}
            onChange={(e) => setServicoSelecionadoId(e.target.value)}
          >
            {servicosFiltrados.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.tag}
              </option>
            ))}
          </select>

          {servicoSelecionado ? (
            <div className="card p-2 mb-3 bg-light border-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{servicoSelecionado.tag}</strong>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={removerServicoSelecionado}
                >
                  Remover
                </button>
              </div>

              <input
                className="form-control rounded-3 mb-2"
                value={servicoSelecionado.nome || ''}
                onChange={(e) => atualizarServicoSelecionado('nome', e.target.value)}
                placeholder="Nome do serviço"
              />

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <input
                    className="form-control rounded-3"
                    value={servicoSelecionado.precoMin || ''}
                    onChange={(e) => atualizarServicoSelecionado('precoMin', e.target.value)}
                    placeholder="Valor mínimo"
                  />
                </div>

                <div className="col-6">
                  <input
                    className="form-control rounded-3"
                    value={servicoSelecionado.precoMax || ''}
                    onChange={(e) => atualizarServicoSelecionado('precoMax', e.target.value)}
                    placeholder="Valor máximo"
                  />
                </div>
              </div>

              <div className="small text-muted">
                Nota e quantidade de avaliações são calculadas pelas avaliações dos usuários.
              </div>
            </div>
          ) : (
            <div className="text-center text-muted p-3">
              Adicione uma tag para gerar um serviço.
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-2">
            Salvar tags e serviços
          </button>

          <Link to={`/lojista/loja/${loja.id}`} className="btn btn-secondary w-100 rounded-pill">
            Cancelar
          </Link>
        </form>
      </div>
    </Layout>
  );
}
