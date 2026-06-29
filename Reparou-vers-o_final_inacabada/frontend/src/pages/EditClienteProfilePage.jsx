import React, {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Layout, {
  BottomNavCliente,
} from "../components/Layout";

import {
  saveClienteProfile,
} from "../features/dataSlice";

import {
  loadData,
} from "../features/loadThunks";

import {
  formatPhoneBR,
} from "../utils/format";

export default function EditClienteProfilePage() {

  // -------------------------
  // AUTH
  // -------------------------
  const { user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // -------------------------
  // CLIENTE
  // -------------------------
  const cliente = useSelector(
    (state) =>
      state.data.clientes.find(
        (item) =>
          item.id === user?.id
      )
  );

  const perfil =
    cliente?.perfil || {};

  // -------------------------
  // BLOQUEIO CONVIDADO
  // -------------------------
  if (user?.id === "guest") {

    return (

      <Layout
        bottom={<BottomNavCliente />}
      >

        <div className="card p-4 text-center">

          <h4 className="mb-3">

            Perfil de convidado

          </h4>

          <p className="text-muted">

            Convidados não podem
            editar perfil.

          </p>

          <Link
            to="/perfil"
            className="btn btn-custom"
          >
            Voltar
          </Link>

        </div>

      </Layout>
    );
  }

  // -------------------------
  // STATES
  // -------------------------
  const [form, setForm] =
    useState({

      nome: "",

      sobrenome: "",

      bairro: "",

      municipio: "",

      telefone1: "",

      telefone2: "",
    });

  // -------------------------
  // SOMENTE TEXTO
  // -------------------------
  const somenteTexto = (
    valor
  ) => {

    return valor.replace(

      /[^A-Za-zÀ-ÿ\s]/g,

      ""
    );
  };

  // -------------------------
  // CARREGA DADOS
  // -------------------------
  useEffect(() => {

    if (cliente) {

      setForm({

        nome:
          cliente.nome || "",

        sobrenome:
          cliente.sobrenome || "",

        bairro:
          perfil.bairro || "",

        municipio:
          perfil.municipio || "",

        telefone1:

          perfil.telefone1 ||

          perfil.telefones?.[0] ||

          "",

        telefone2:

          perfil.telefone2 ||

          perfil.telefones?.[1] ||

          "",
      });
    }

  }, [cliente]);

  // -------------------------
  // SALVAR PERFIL
  // -------------------------
  const handleSave =
    async () => {

      if (!cliente?.id)
        return;

      const payload = {

        nome: form.nome,

        sobrenome:
          form.sobrenome,

        perfil: {

          bairro:
            form.bairro,

          municipio:
            form.municipio,

          telefone1:
            form.telefone1,

          telefone2:
            form.telefone2,

          telefones: [

            form.telefone1,

            form.telefone2,

          ].filter(Boolean),
        },
      };

      await dispatch(

        saveClienteProfile({

          clienteId:
            cliente.id,

          payload,
        })
      );

      // recarrega
      dispatch(loadData());

      // volta
      navigate("/perfil");
    };

  return (

    <Layout
      bottom={
        <BottomNavCliente />
      }
    >

      {/* HEADER */}
      <div className="profile-header2 mb-3">

        <Link
          to="/perfil"
          className="text-white text-decoration-none"
        >
          ←
        </Link>

        <h4 className="mt-2">

          Editar Perfil

        </h4>

      </div>

      {/* CARD */}
      <div className="card p-3 mb-5">

        {/* NOME */}
        <input
          className="form-control mb-2"

          value={form.nome}

          onChange={(e) =>

            setForm({

              ...form,

              nome:
                somenteTexto(
                  e.target.value
                ),
            })
          }

          placeholder="Nome"
        />

        {/* SOBRENOME */}
        <input
          className="form-control mb-2"

          value={form.sobrenome}

          onChange={(e) =>

            setForm({

              ...form,

              sobrenome:
                somenteTexto(
                  e.target.value
                ),
            })
          }

          placeholder="Sobrenome"
        />

        {/* BAIRRO */}
        <input
          className="form-control mb-2"

          value={form.bairro}

          onChange={(e) =>

            setForm({

              ...form,

              bairro:
                somenteTexto(
                  e.target.value
                ),
            })
          }

          placeholder="Bairro"
        />

        {/* MUNICÍPIO */}
        <input
          className="form-control mb-2"

          value={form.municipio}

          onChange={(e) =>

            setForm({

              ...form,

              municipio:
                somenteTexto(
                  e.target.value
                ),
            })
          }

          placeholder="Município"
        />

        {/* TELEFONE 1 */}
        <input
          className="form-control mb-2"

          value={form.telefone1}

          onChange={(e) =>

            setForm({

              ...form,

              telefone1:

                formatPhoneBR(
                  e.target.value
                ),
            })
          }

          placeholder="Telefone 1"
        />

        {/* TELEFONE 2 */}
        <input
          className="form-control mb-3"

          value={form.telefone2}

          onChange={(e) =>

            setForm({

              ...form,

              telefone2:

                formatPhoneBR(
                  e.target.value
                ),
            })
          }

          placeholder="Telefone 2"
        />

        {/* BOTÃO */}
        <button
          className="btn btn-custom w-100 mb-2"

          onClick={handleSave}
        >
          Salvar perfil
        </button>

        {/* VOLTAR */}
        <Link
          to="/perfil"
          className="btn btn-outline-dark w-100"
        >
          Voltar
        </Link>

      </div>

    </Layout>
  );
}