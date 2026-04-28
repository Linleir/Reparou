import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout, { BottomNavCliente } from "../components/Layout";
import { saveClienteProfile, loadData } from "../features/dataSlice";

export default function EditClienteProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cliente = useSelector((state) =>
    state.data.clientes.find((item) => item.id === user?.id)
  );

  const perfil = cliente?.perfil || {};

  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    bairro: "",
    municipio: "",
    telefone1: "",
    telefone2: "",
  });

  // 🔥 carrega dados quando cliente existir
  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        sobrenome: cliente.sobrenome || "",
        bairro: perfil.bairro || "",
        municipio: perfil.municipio || "",
        telefone1: perfil.telefone1 || perfil.telefones?.[0] || "",
        telefone2: perfil.telefone2 || perfil.telefones?.[1] || "",
      });
    }
  }, [cliente]);

  const handleSave = async () => {
    if (!cliente?.id) return;

    const payload = {
      nome: form.nome,
      sobrenome: form.sobrenome,
      perfil: {
        bairro: form.bairro,
        municipio: form.municipio,
        telefone1: form.telefone1,
        telefone2: form.telefone2,
        telefones: [form.telefone1, form.telefone2].filter(Boolean),
      },
    };

    await dispatch(
      saveClienteProfile({
        clienteId: cliente.id,
        payload,
      })
    );

    // 🔥 recarrega dados pra atualizar tela
    dispatch(loadData());

    // 🔥 volta pro perfil correto
    navigate("/perfil");
  };

  return (
    <Layout bottom={<BottomNavCliente />}>
      <div className="profile-header2 mb-3">
        <Link to="/perfil" className="text-white text-decoration-none">
          ←
        </Link>
        <h4 className="mt-2">Editar Perfil</h4>
      </div>

      <div className="card p-3 mb-5">

        <input
          className="form-control mb-2"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Nome"
        />

        <input
          className="form-control mb-2"
          value={form.sobrenome}
          onChange={(e) => setForm({ ...form, sobrenome: e.target.value })}
          placeholder="Sobrenome"
        />

        <input
          className="form-control mb-2"
          value={form.bairro}
          onChange={(e) => setForm({ ...form, bairro: e.target.value })}
          placeholder="Bairro"
        />

        <input
          className="form-control mb-2"
          value={form.municipio}
          onChange={(e) => setForm({ ...form, municipio: e.target.value })}
          placeholder="Município"
        />

        <input
          className="form-control mb-2"
          value={form.telefone1}
          onChange={(e) => setForm({ ...form, telefone1: e.target.value })}
          placeholder="Telefone 1"
        />

        <input
          className="form-control mb-3"
          value={form.telefone2}
          onChange={(e) => setForm({ ...form, telefone2: e.target.value })}
          placeholder="Telefone 2"
        />

        <button
          className="btn btn-custom w-100 mb-2"
          onClick={handleSave}
        >
          Salvar perfil
        </button>

        <Link to="/perfil" className="btn btn-outline-dark w-100">
          Voltar
        </Link>
      </div>
    </Layout>
  );
}