import React, { useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Layout, {
  BottomNavCliente,
} from "../components/Layout";

import {
  saveDenuncia,
} from "../features/dataSlice";

// -------------------------
// MOTIVOS
// -------------------------
const reasons = [
  "Racismo",
  "Fraude",
  "Assédio",
  "Furto",
  "Serviço",
  "Outro",
];

export default function ComplaintPage() {

  // -------------------------
  // ROUTER
  // -------------------------
  const { id } = useParams();

  const navigate = useNavigate();

  // -------------------------
  // REDUX
  // -------------------------
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  // -------------------------
  // LOJA
  // -------------------------
  const loja = useSelector(
    (state) =>
      state.data.lojas.find(
        (item) => item.id === id
      )
  );

  // -------------------------
  // DENÚNCIAS
  // -------------------------
  const denuncias = useSelector(
    (state) =>
      state.data.denuncias?.filter(
        (item) =>
          item.lojaId === loja?.id
      ) || []
  );

  // -------------------------
  // STATES
  // -------------------------
  const [selecionados, setSelecionados] =
    useState([]);

  const [descricao, setDescricao] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // -------------------------
  // LOJA NÃO ENCONTRADA
  // -------------------------
  if (!loja) return null;

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

            Conta de convidado

          </h4>

          <p className="text-muted">

            Convidados não podem
            enviar denúncias.

          </p>

          <Link
            to={`/lojas/${id}`}
            className="btn btn-custom"
          >
            Voltar
          </Link>

        </div>

      </Layout>
    );
  }

  // -------------------------
  // TOGGLE MOTIVOS
  // -------------------------
  const toggle = (item) => {

    setSelecionados((prev) =>

      prev.includes(item)

        ? prev.filter(
            (x) => x !== item
          )

        : [...prev, item]
    );
  };

  // -------------------------
  // ENVIAR DENÚNCIA
  // -------------------------
  const handleSubmit = async () => {

    if (!selecionados.length) {

      setMsg(
        "Selecione pelo menos 1 motivo para enviar a denúncia."
      );

      return;
    }

    await dispatch(

      saveDenuncia({

        id: String(Date.now()),

        lojaId: loja.id,

        lojaNome: loja.titulo,

        motivos: selecionados,

        descricao,

        data: new Date()
          .toISOString()
          .slice(0, 10),

        status: "Pendente",
      })
    );

    // sucesso
    setSuccess(true);

    // limpa formulário
    setSelecionados([]);

    setDescricao("");

    setMsg("");
  };

  return (

    <Layout
      bottom={<BottomNavCliente />}
    >

      {/* HEADER */}
      <div className="profile-header2 mb-3">

        <Link
          to={`/lojas/${id}`}
          className="text-white text-decoration-none"
        >
          ←
        </Link>

        {/* LOJA */}
        <div className="text-center mt-2">

          <img
            src={loja.imagem}
            className="shop-img mb-2"
            alt={loja.titulo}
          />

          <h4>
            {loja.titulo}
          </h4>

          <div>
            {loja.enderecoLinhas.join(
              " • "
            )}
          </div>

          <div>
            {loja.telefones.join(
              " • "
            )}
          </div>

        </div>

        {/* TABS */}
        <div className="d-flex justify-content-center gap-2 loja-tabs mt-3">

          <Link
            className="loja-tab"
            to={`/lojas/${id}`}
          >
            Serviços
          </Link>

          <Link
            className="loja-tab"
            to={`/lojas/${id}/avaliacoes`}
          >
            Avaliações
          </Link>

          <span className="loja-tab loja-tab-active">
            Denunciar
          </span>

        </div>

      </div>

      {/* CARD */}
      <div className="card p-3 mb-5">

        {/* TEXTO */}
        <p className="small">

          Selecione os motivos
          da denúncia:

        </p>

        {/* TAGS */}
        <div className="d-flex flex-wrap gap-2 mb-3">

          {reasons.map((motivo) => (

            <label
              key={motivo}
              className="tag-container"
            >

              <input
                type="checkbox"

                checked={selecionados.includes(
                  motivo
                )}

                onChange={() =>
                  toggle(motivo)
                }
              />

              {" "}

              <span className="tag">
                {motivo}
              </span>

            </label>
          ))}

        </div>

        {/* DESCRIÇÃO */}
        <textarea
          className="form-control mb-3"

          rows={4}

          placeholder="Descreva o ocorrido"

          value={descricao}

          onChange={(e) =>
            setDescricao(
              e.target.value
            )
          }
        />

        {/* ERRO */}
        {msg && (

          <p className="small text-danger">

            {msg}

          </p>
        )}

        {/* SUCESSO */}
        {success && (

          <div className="alert alert-success">

            Denúncia enviada
            com sucesso.

          </div>
        )}

        {/* BOTÃO */}
        <button
          className="btn btn-custom w-100 mb-2"
          onClick={handleSubmit}
        >
          Enviar denúncia
        </button>

        {/* CANCELAR */}
        <button
          className="btn btn-outline-secondary w-100"
          onClick={() =>
            navigate(`/lojas/${id}`)
          }
        >
          Cancelar
        </button>

        {/* HISTÓRICO */}
        <hr />

        <h5 className="mb-3">

          Denúncias anteriores

        </h5>

        {/* SEM DENÚNCIAS */}
        {denuncias.length === 0 && (

          <p className="small text-muted">

            Nenhuma denúncia registrada.

          </p>
        )}

        {/* LISTA */}
        {denuncias.map((item) => (

          <div
            key={item.id}
            className="card p-2 mb-2"
          >

            <div className="small mb-1">

              <strong>
                Data:
              </strong>

              {" "}

              {item.data}

            </div>

            <div className="small mb-1">

              <strong>
                Status:
              </strong>

              {" "}

              {item.status}

            </div>

            <div className="small mb-1">

              <strong>
                Motivos:
              </strong>

              {" "}

              {item.motivos.join(
                ", "
              )}

            </div>

            <div className="small">

              <strong>
                Descrição:
              </strong>

              {" "}

              {item.descricao ||
                "Sem descrição"}

            </div>

          </div>
        ))}

      </div>

    </Layout>
  );
}