import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { saveLoja } from '../features/dataSlice';

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
      tags: loja?.tags || [],
      servicos: loja?.servicos || [],
      media: loja?.media || 0,
      quantidadeAvaliacoes: loja?.quantidadeAvaliacoes || 0,
    };

    await dispatch(saveLoja({ id: loja?.id, payload })).unwrap();
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
              onChange={(e) =>
                setEnderecos(enderecos.map((item, i) => (i === index ? e.target.value : item)))
              }
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
              onChange={(e) =>
                setTelefones(telefones.map((item, i) => (i === index ? e.target.value : item)))
              }
            />
          ))}

          <button
            type="button"
            className="btn btn-light btn-sm rounded-circle mb-3"
            onClick={() => setTelefones([...telefones, ''])}
          >
            <i className="fa-solid fa-plus" />
          </button>

          <div className="alert alert-light small">
            Tags e serviços agora são editados em <strong>Perfil do Lojista &gt; Editar tags e serviços</strong>.
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-2">
            Salvar alterações
          </button>

          <Link to="/lojista/perfil" className="btn btn-secondary w-100 rounded-pill">
            Cancelar
          </Link>
        </form>
      </div>
    </Layout>
  );
}
