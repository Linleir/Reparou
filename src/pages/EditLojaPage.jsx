import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { deleteLoja, saveLoja } from '../features/dataSlice';

const allTags = [
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
];

export default function EditLojaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const loja = useSelector((state) =>
    state.data.lojas.find((item) => String(item.id) === String(id))
  );

  const [nome, setNome] = useState(loja?.nome || '');
  const [enderecos, setEnderecos] = useState(loja?.enderecos?.length ? loja.enderecos : ['']);
  const [telefones, setTelefones] = useState(loja?.telefones?.length ? loja.telefones : ['']);
  const [pesquisa, setPesquisa] = useState('');
  const [tags, setTags] = useState(loja?.tags || []);

  const disponiveis = useMemo(
    () =>
      allTags.filter(
        (tag) =>
          !tags.includes(tag) &&
          tag.toLowerCase().includes(pesquisa.toLowerCase())
      ),
    [pesquisa, tags]
  );

  const updateEndereco = (index, value) => {
    setEnderecos(enderecos.map((item, i) => (i === index ? value : item)));
  };

  const updateTelefone = (index, value) => {
    setTelefones(telefones.map((item, i) => (i === index ? value : item)));
  };

  const persist = async (event) => {
    event.preventDefault();

    const enderecosLimpos = enderecos.map((item) => item.trim()).filter(Boolean);
    const telefonesLimpos = telefones.map((item) => item.trim()).filter(Boolean);

    const payload = {
      id: loja?.id || `loja-${Date.now()}`,
      nome,
      titulo: (nome || 'NOVA LOJA').toUpperCase(),
      lojistaId: user.id,
      imagem: loja?.imagem || '/imgtst.jpg',
      enderecos: enderecosLimpos,
      enderecoLinhas: enderecosLimpos[0]
        ? enderecosLimpos[0].split(' - ')
        : ['Endereço principal', 'RJ'],
      telefones: telefonesLimpos,
      tags,
      servicos: loja?.servicos || [],
      media: loja?.media || 0,
      quantidadeAvaliacoes: loja?.quantidadeAvaliacoes || 0,
    };

    await dispatch(saveLoja({ id: loja?.id, payload })).unwrap();
    navigate('/lojista/perfil');
  };

  const handleDelete = async () => {
    if (!loja?.id) return;
    const confirmed = window.confirm('Tem certeza que deseja excluir esta loja?');
    if (!confirmed) return;

    await dispatch(deleteLoja(loja.id)).unwrap();
    navigate('/lojista/perfil');
  };

  return (
    <Layout bottom={<BottomNavLojista />}>
      <div className="profile-header2 mb-3">
        <Link to="/lojista/perfil" className="text-white text-decoration-none">
          ←
        </Link>
        <h4 className="mt-2">{loja ? 'Editar Loja' : 'Nova Loja'}</h4>
      </div>

      <div className="card p-3 mb-5">
        <form onSubmit={persist}>
          <label className="mb-1">
            <strong>Nome da loja</strong>
          </label>
          <input
            className="form-control rounded-3 mb-3"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label className="mb-1">
            <strong>Endereços</strong>
          </label>
          {enderecos.map((valor, index) => (
            <input
              key={index}
              className="form-control rounded-3 mb-2"
              value={valor}
              onChange={(e) => updateEndereco(index, e.target.value)}
              placeholder="Ex.: Rua X, 100 - Bairro, Cidade"
            />
          ))}
          <button
            type="button"
            className="btn btn-light btn-sm rounded-circle mb-3"
            onClick={() => setEnderecos([...enderecos, ''])}
          >
            <i className="fa-solid fa-plus" />
          </button>

          <label className="mb-1">
            <strong>Telefones</strong>
          </label>
          {telefones.map((valor, index) => (
            <input
              key={index}
              className="form-control rounded-3 mb-2"
              value={valor}
              onChange={(e) => updateTelefone(index, e.target.value)}
              placeholder="Ex.: (21) 99999-9999"
            />
          ))}
          <button
            type="button"
            className="btn btn-light btn-sm rounded-circle mb-3"
            onClick={() => setTelefones([...telefones, ''])}
          >
            <i className="fa-solid fa-plus" />
          </button>

          <label className="mb-1">
            <strong>Tags</strong>
          </label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="btn btn-sm btn-custom"
                onClick={() => setTags(tags.filter((item) => item !== tag))}
              >
                {tag} ×
              </button>
            ))}
          </div>

          <input
            className="form-control rounded-3 mb-2"
            placeholder="Pesquisar tags"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />

          <div
            className="bg-light rounded-4 p-2 mb-3"
            style={{ maxHeight: 120, overflowY: 'auto' }}
          >
            {disponiveis.map((tag) => (
              <button
                type="button"
                key={tag}
                className="btn btn-sm btn-outline-secondary me-1 mb-1"
                onClick={() => setTags([...tags, tag])}
              >
                {tag}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-2">
            Salvar alterações
          </button>

          {loja ? (
            <button
              type="button"
              className="btn w-100 rounded-pill mb-2"
              style={{ background: '#dc3545', color: '#fff' }}
              onClick={handleDelete}
            >
              Excluir loja
            </button>
          ) : null}

          <Link to="/lojista/perfil" className="btn btn-secondary w-100 rounded-pill">
            Cancelar
          </Link>
        </form>
      </div>
    </Layout>
  );
}
