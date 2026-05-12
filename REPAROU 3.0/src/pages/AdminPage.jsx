import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { logout } from "../features/authSlice";

import {
  deleteCliente,
  adminDeleteLojista,
  adminDeleteLoja,
  adminEditLoja,
  adminEditLojista,
  adminDeleteMessage,
  adminEditMessage,
} from "../features/dataSlice";

export default function AdminPage() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [chatSelecionado, setChatSelecionado] = useState(null);

  const {
    clientes = [],
    lojistas = [],
    lojas = [],
    chats = [],
    reviews = [],
    denuncias = [],
  } = useSelector((state) => state.data || {});

  /* =======================================================
     HELPERS
  ======================================================= */
  const onlyNumbers = (txt) => String(txt || "").replace(/\D/g, "");
  const searchNumber = onlyNumbers(search);

  const getCliente = (id) =>
    clientes.find((item) => String(item.id) === String(id));

  const getLoja = (id) =>
    lojas.find((item) => String(item.id) === String(id));

  const getLojista = (id) =>
    lojistas.find((item) => String(item.id) === String(id));

  const getLojistaByLoja = (lojaId) => {
    const loja = getLoja(lojaId);
    if (!loja) return null;
    return getLojista(loja.lojistaId);
  };

  /* =======================================================
     FILTROS
  ======================================================= */
  const clientesFiltrados = useMemo(() => {
    if (!search.trim()) return clientes;

    return clientes.filter((c) =>
      onlyNumbers(c.cpf).includes(searchNumber)
    );
  }, [clientes, search, searchNumber]);

  const lojistasFiltrados = useMemo(() => {
    if (!search.trim()) return lojistas;

    return lojistas.filter((l) =>
      onlyNumbers(l.cnpj).includes(searchNumber)
    );
  }, [lojistas, search, searchNumber]);

  const chatsFiltrados = useMemo(() => {
    if (!search.trim()) return chats;

    return chats.filter((chat) => {
      const cliente = getCliente(chat.clienteId);
      const lojista = getLojistaByLoja(chat.lojaId);

      const cpf = onlyNumbers(cliente?.cpf);
      const cnpj = onlyNumbers(lojista?.cnpj);

      return (
        cpf.includes(searchNumber) ||
        cnpj.includes(searchNumber)
      );
    });
  }, [chats, clientes, lojistas, lojas, search, searchNumber]);

  /* =======================================================
     SINCRONIZA CHAT SELECIONADO
  ======================================================= */
  useEffect(() => {
    if (!chatSelecionado) return;

    const atualizado = chats.find(
      (c) => String(c.id) === String(chatSelecionado.id)
    );

    if (atualizado) {
      setChatSelecionado(atualizado);
    } else {
      setChatSelecionado(null);
    }
  }, [chats]);

  /* =======================================================
     ACTION BUTTONS
  ======================================================= */
  const ActionButtons = ({ onEdit, onDelete }) => (
    <div className="d-flex gap-2 mt-3 flex-wrap">
      {onEdit && (
        <button
          className="btn btn-warning btn-sm"
          onClick={onEdit}
        >
          Editar
        </button>
      )}

      {onDelete && (
        <button
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          Excluir
        </button>
      )}
    </div>
  );

  /* =======================================================
     EDITORES
  ======================================================= */
  const editarLojista = (lojista) => {
    const responsavel = prompt(
      "Responsável:",
      lojista.responsavel || ""
    );
    if (responsavel === null) return;

    const cnpj = prompt(
      "CNPJ:",
      lojista.cnpj || ""
    );
    if (cnpj === null) return;

    dispatch(
      adminEditLojista({
        lojistaId: lojista.id,
        dados: { responsavel, cnpj },
      })
    );
  };

  const editarLoja = (loja) => {
    const nome = prompt(
      "Nome da loja:",
      loja.nome || ""
    );
    if (nome === null) return;

    const titulo = prompt(
      "Título:",
      loja.titulo || ""
    );
    if (titulo === null) return;

    dispatch(
      adminEditLoja({
        lojaId: loja.id,
        dados: { nome, titulo },
      })
    );
  };

  const editarMensagem = (chat, index, msg) => {
    const novoTexto = prompt(
      "Editar mensagem:",
      msg.texto
    );

    if (novoTexto === null) return;

    dispatch(
      adminEditMessage({
        chatId: chat.id,
        indexMensagem: index,
        novoTexto,
      })
    );
  };

  /* =======================================================
     STATS
  ======================================================= */
  const media =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, item) =>
              acc + Number(item.nota || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     COMPONENTES
  ======================================================= */
  const CardStat = ({ titulo, valor }) => (
    <div className="col-6 col-md-4">
      <div className="card p-3 rounded-4 text-center shadow-sm h-100">
        <h3>{valor}</h3>
        <small>{titulo}</small>
      </div>
    </div>
  );

  const TabButton = ({ value, label }) => (
    <div className="col-6 col-md-4">
      <button
        className={`btn w-100 ${
          tab === value
            ? "btn-dark"
            : "btn-outline-dark"
        }`}
        onClick={() => {
          setTab(value);
          setChatSelecionado(null);
        }}
      >
        {label}
      </button>
    </div>
  );

  /* =======================================================
     JSX
  ======================================================= */
  return (
    <Layout>
      {/* HEADER */}
      <div className="bg-dark text-white rounded-4 p-4 mb-4 text-center">
        <h1>PAINEL ADMIN</h1>
        <small>Controle total do sistema</small>
      </div>

      {/* STATS */}
      <div className="row g-2 mb-4">
        <CardStat titulo="Clientes" valor={clientes.length} />
        <CardStat titulo="Lojistas" valor={lojistas.length} />
        <CardStat titulo="Lojas" valor={lojas.length} />
        <CardStat titulo="Chats" valor={chats.length} />
        <CardStat titulo="Denúncias" valor={denuncias.length} />
        <CardStat titulo="Média" valor={media} />
      </div>

      {/* TABS */}
      <div className="card p-3 rounded-4 mb-3">
        <div className="row g-2">
          <TabButton value="dashboard" label="Dashboard" />
          <TabButton value="usuarios" label="Usuários" />
          <TabButton value="lojas" label="Lojas" />
          <TabButton value="chats" label="Chats" />
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control rounded-pill mb-4"
        placeholder="Buscar CPF ou CNPJ..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div className="card rounded-4 p-4 mb-5">
          <h3>Resumo</h3>
          <p>
            Total usuários:{" "}
            {clientes.length + lojistas.length}
          </p>
          <p>Total lojas: {lojas.length}</p>
          <p>Total chats: {chats.length}</p>
          <p>Total denúncias: {denuncias.length}</p>
        </div>
      )}

      {/* USUÁRIOS */}
      {tab === "usuarios" && (
        <div className="card rounded-4 p-4 mb-5">
          <h3>Clientes</h3>

          {clientesFiltrados.map((c) => (
            <div
              key={c.id}
              className="border rounded-3 p-3 mb-3"
            >
              <strong>{c.nome || "Sem nome"}</strong>
              <br />
              CPF: {c.cpf}
              <br />
              ID: {c.id}

              <ActionButtons
                onDelete={() =>
                  dispatch(deleteCliente(c.id))
                }
              />
            </div>
          ))}

          <hr />

          <h3>Lojistas</h3>

          {lojistasFiltrados.map((l) => (
            <div
              key={l.id}
              className="border rounded-3 p-3 mb-3"
            >
              <strong>
                {l.responsavel || "Sem nome"}
              </strong>
              <br />
              CNPJ: {l.cnpj}
              <br />
              ID: {l.id}

              <ActionButtons
                onEdit={() => editarLojista(l)}
                onDelete={() =>
                  dispatch(
                    adminDeleteLojista(l.id)
                  )
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* LOJAS */}
      {tab === "lojas" && (
        <div className="card rounded-4 p-4 mb-5">
          <h3>Lojas</h3>

          {lojas.map((loja) => {
            const lojista = getLojista(
              loja.lojistaId
            );

            return (
              <div
                key={loja.id}
                className="border rounded-3 p-3 mb-3"
              >
                <strong>{loja.nome}</strong>
                <br />
                Responsável:{" "}
                {lojista?.responsavel ||
                  "Não encontrado"}
                <br />
                ID: {loja.id}

                <ActionButtons
                  onEdit={() =>
                    editarLoja(loja)
                  }
                  onDelete={() =>
                    dispatch(
                      adminDeleteLoja(loja.id)
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {/* CHATS */}
      {tab === "chats" && (
        <div className="row g-3 mb-5">
          <div className="col-md-5">
            <div className="card rounded-4 p-3 h-100">
              <h4>Conversas</h4>

              {chatsFiltrados.map((chat) => {
                const cliente = getCliente(
                  chat.clienteId
                );

                const loja = getLoja(chat.lojaId);

                const lojista =
                  getLojistaByLoja(chat.lojaId);

                return (
                  <div
                    key={chat.id}
                    className="border rounded-3 p-3 mb-2"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setChatSelecionado(chat)
                    }
                  >
                    <strong>
                      {cliente?.nome ||
                        "Cliente"}
                    </strong>
                    <br />
                    Loja:{" "}
                    {loja?.nome ||
                      "Loja removida"}
                    <br />
                    CPF: {cliente?.cpf || "-"}
                    <br />
                    CNPJ: {lojista?.cnpj || "-"}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-md-7">
            <div className="card rounded-4 p-3 h-100">
              <h4>Mensagens</h4>

              {!chatSelecionado && (
                <p>Selecione um chat.</p>
              )}

              {chatSelecionado &&
                chatSelecionado.mensagens?.map(
                  (msg, i) => (
                    <div
                      key={i}
                      className="border rounded-3 p-3 mb-2"
                    >
                      <strong>
                        {msg.autor}
                      </strong>
                      <br />
                      {msg.texto}

                      <ActionButtons
                        onEdit={() =>
                          editarMensagem(
                            chatSelecionado,
                            i,
                            msg
                          )
                        }
                        onDelete={() =>
                          dispatch(
                            adminDeleteMessage({
                              chatId:
                                chatSelecionado.id,
                              indexMensagem: i,
                            })
                          )
                        }
                      />
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      )}

      {/* SAIR */}
      <button
        className="btn btn-danger w-100 rounded-pill mb-5"
        onClick={() =>
          dispatch(logout())
        }
      >
        Sair
      </button>
    </Layout>
  );
}