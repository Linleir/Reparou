import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente } from '../components/Layout';
import { saveClienteProfile } from '../features/dataSlice';

export default function EditClienteProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user.id)
  );

  const perfilInicial = cliente?.perfil || {};
  const telefonesIniciais = Array.isArray(perfilInicial.telefones)
    ? perfilInicial.telefones
    : [perfilInicial.telefone1 || '', perfilInicial.telefone2 || ''];

  const [form, setForm] = useState({
    nome: cliente?.nome || '',
    sobrenome: cliente?.sobrenome || '',
    perfil: {
      ...perfilInicial,
      telefones: [
        telefonesIniciais[0] || '',
        telefonesIniciais[1] || '',
      ],
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateTelefone = (index, value) => {
    const telefones = [...(form.perfil?.telefones || ['', ''])];
    telefones[index] = value;
    setForm({
      ...form,
      perfil: {
        ...form.perfil,
        telefones,
      },
    });
  };

  const handleSave = async () => {
    const telefonesLimpos = (form.perfil?.telefones || [])
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 2);

    await dispatch(
      saveClienteProfile({
        clienteId: cliente.id,
        payload: {
          ...form,
          perfil: {
            ...form.perfil,
            telefones: telefonesLimpos,
          },
        },
      })
    );

    navigate('/perfil');
  };

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3">
        <Link to="/perfil" className="text-white text-decoration-none">←</Link>
        <h4 className="mt-2">Editar Perfil</h4>
      </div>

      <div className="card p-3 mb-5">
        <div className="mb-2">
          <input
            className="form-control"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Nome"
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            value={form.sobrenome}
            onChange={(e) => setForm({ ...form, sobrenome: e.target.value })}
            placeholder="Sobrenome"
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            value={form.perfil?.bairro || ''}
            onChange={(e) =>
              setForm({
                ...form,
                perfil: {
                  ...form.perfil,
                  bairro: e.target.value,
                },
              })
            }
            placeholder="Bairro"
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            value={form.perfil?.municipio || ''}
            onChange={(e) =>
              setForm({
                ...form,
                perfil: {
                  ...form.perfil,
                  municipio: e.target.value,
                },
              })
            }
            placeholder="Município"
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            value={form.perfil?.telefones?.[0] || ''}
            onChange={(e) => updateTelefone(0, e.target.value)}
            placeholder="Telefone 1"
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            value={form.perfil?.telefones?.[1] || ''}
            onChange={(e) => updateTelefone(1, e.target.value)}
            placeholder="Telefone 2"
          />
          <div className="form-text">Você pode cadastrar até 2 números de telefone.</div>
        </div>

        <button className="btn btn-custom w-100 mb-2" onClick={handleSave}>
          Salvar perfil
        </button>

        <Link to="/perfil" className="btn btn-outline-dark w-100">
          Voltar
        </Link>
      </div>
    </Layout>
  );
}
