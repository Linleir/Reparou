import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Layout, {
  BottomNavLojista,
} from "../components/Layout";

import { saveLojista } from "../features/dataSlice";

export default function EditLojistaPage() {

  const { user } = useSelector(
    (state) => state.auth
  );

  const lojista = useSelector(
    (state) =>
      state.data.lojistas.find(
        (item) => item.id === user.id
      )
  );

  // -------------------------
  // STATES
  // -------------------------
  const [responsavel, setResponsavel] =
    useState(
      lojista?.responsavel || ""
    );

  const [email, setEmail] =
    useState(
      lojista?.email || ""
    );

  const [telefone, setTelefone] =
    useState(
      lojista?.telefone || ""
    );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // -------------------------
  // SOMENTE TEXTO
  // -------------------------
  const somenteTexto = (valor) => {

    return valor.replace(
      /[^A-Za-zÀ-ÿ\s]/g,
      ""
    );
  };

  // -------------------------
  // FORMATAR EMAIL
  // -------------------------
  const formatarEmail = (valor) => {

    return valor
      .replace(/\s/g, "")
      .toLowerCase();
  };

  // -------------------------
  // MÁSCARA TELEFONE
  // -------------------------
  const formatarTelefone = (valor) => {

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");

    // limita em 11 números
    valor = valor.slice(0, 11);

    // celular
    if (valor.length > 10) {

      valor = valor.replace(
        /^(\d{2})(\d{5})(\d{4}).*/,
        "($1) $2-$3"
      );
    }

    // fixo
    else if (valor.length > 5) {

      valor = valor.replace(
        /^(\d{2})(\d{4})(\d{0,4}).*/,
        "($1) $2-$3"
      );
    }

    // parcial
    else if (valor.length > 2) {

      valor = valor.replace(
        /^(\d{2})(\d{0,5})/,
        "($1) $2"
      );
    }

    return valor;
  };

  // -------------------------
  // SALVAR
  // -------------------------
  const handleSave = async () => {

    // remove máscara telefone
    const telefoneLimpo =
      telefone.replace(/\D/g, "");

    // valida telefone
    if (
      telefoneLimpo.length !== 10 &&
      telefoneLimpo.length !== 11
    ) {
      alert("Telefone inválido");
      return;
    }

    await dispatch(
      saveLojista({
        id: lojista.id,

        payload: {
          responsavel,
          email,
          telefone,
        },
      })
    );

    navigate("/lojista/perfil");
  };

  return (

    <Layout bottom={<BottomNavLojista />}>

      {/* HEADER */}
      <div className="profile-header2 mb-3">

        <Link
          to="/lojista/perfil"
          className="text-white text-decoration-none"
        >
          ←
        </Link>

        <h4 className="mt-2">
          Editar Perfil Lojista
        </h4>

      </div>

      {/* CARD */}
      <div className="card p-3 mb-5">

        {/* RESPONSÁVEL */}
        <div className="mb-2">

          <input
            className="form-control"

            value={responsavel}

            onChange={(e) =>
              setResponsavel(
                somenteTexto(
                  e.target.value
                )
              )
            }

            placeholder="Responsável"
          />

        </div>

        {/* EMAIL */}
        <div className="mb-2">

          <input
            className="form-control"

            value={email}

            onChange={(e) =>
              setEmail(
                formatarEmail(
                  e.target.value
                )
              )
            }

            placeholder="Email"
          />

        </div>

        {/* TELEFONE */}
        <div className="mb-3">

          <input
            className="form-control"

            value={telefone}

            onChange={(e) =>
              setTelefone(
                formatarTelefone(
                  e.target.value
                )
              )
            }

            placeholder="Telefone"
          />

        </div>

        {/* BOTÃO SALVAR */}
        <button
          className="btn btn-custom w-100 mb-2"
          onClick={handleSave}
        >
          Salvar perfil
        </button>

        {/* VOLTAR */}
        <Link
          to="/lojista/perfil"
          className="btn btn-outline-dark w-100"
        >
          Voltar
        </Link>

      </div>

    </Layout>
  );
}