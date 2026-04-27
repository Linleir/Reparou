import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { logout } from "../features/authSlice";

export default function AdminPage() {
  const dispatch = useDispatch();

  // ======================
  // STATES
  // ======================
  const [tab, setTab] = useState("denuncias");
  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [lojaFiltroReviews, setLojaFiltroReviews] = useState("");
  const [lojaFiltroChats, setLojaFiltroChats] = useState("");

  // ======================
  // DATA (SEGURA)
  // ======================
  const {
    lojas = [],
    denuncias = [],
    clientes = [],
    lojistas = [],
    reviews = [],
    chats = [],
  } = useSelector((state) => state.data || {});

  // ======================
  // FILTROS
  // ======================
  const reviewsFiltradas = lojaFiltroReviews
    ? reviews.filter((r) => String(r.lojaId) === String(lojaFiltroReviews))
    : reviews;

  const chatsFiltrados = lojaFiltroChats
    ? chats.filter((c) => String(c.lojaId) === String(lojaFiltroChats))
    : chats;

  // ======================
  // USUÁRIO DETALHES
  // ======================
  const openUser = (user, type) => {
    setSelectedUser(user);
    setSelectedType(type);
  };

  return (
    <Layout>
      {/* HEADER */}
      <header className="bg-black text-white p-3 rounded mb-3 text-center">
        <h2>ADMINISTRAÇÃO</h2>
      </header>

      {/* TABS */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-dark w-100" onClick={() => setTab("denuncias")}>
          Denúncias
        </button>
        <button className="btn btn-dark w-100" onClick={() => setTab("lojas")}>
          Lojas
        </button>
        <button className="btn btn-dark w-100" onClick={() => setTab("usuarios")}>
          Usuários
        </button>
        <button className="btn btn-dark w-100" onClick={() => setTab("reviews")}>
          Avaliações
        </button>
        <button className="btn btn-dark w-100" onClick={() => setTab("chats")}>
          Conversas
        </button>
      </div>

      {/* ================= DENUNCIAS ================= */}
      {tab === "denuncias" && (
        <div>
          <h5>Denúncias</h5>

          {denuncias.map((d) => (
            <div key={d.id} className="border p-2 mb-2">
              <strong>Loja:</strong> {d.lojaNome} <br />
              <strong>Descrição:</strong> {d.descricao}
            </div>
          ))}
        </div>
      )}

      {/* ================= LOJAS ================= */}
      {tab === "lojas" && (
        <div>
          <h5>Lojas</h5>

          {lojas.map((l) => (
            <div key={l.id} className="border p-2 mb-2">
              {l.nome}
            </div>
          ))}
        </div>
      )}

      {/* ================= USUÁRIOS ================= */}
      {tab === "usuarios" && (
        <div>
          <h5>Clientes</h5>

          {clientes.map((c) => (
            <div
              key={c.id}
              className="admin-list-item"
              style={{ cursor: "pointer" }}
              onClick={() => openUser(c, "cliente")}
            >
              <strong>{c.nome || "Cliente"}</strong><br />
              CPF: {c.cpf}<br />
              ID: {c.id}
            </div>
          ))}

          <h5 className="mt-3">Lojistas</h5>

          {lojistas.map((l) => (
            <div
              key={l.id}
              className="admin-list-item"
              style={{ cursor: "pointer" }}
              onClick={() => openUser(l, "lojista")}
            >
              <strong>{l.nomeLojaPrincipal || "Lojista"}</strong><br />
              CNPJ: {l.cnpj}<br />
              ID: {l.id}
            </div>
          ))}
        </div>
      )}

      {/* ================= REVIEWS ================= */}
      {tab === "reviews" && (
        <div>
          <h5>Avaliações</h5>

          <select
            className="form-control mb-3"
            onChange={(e) => setLojaFiltroReviews(e.target.value)}
          >
            <option value="">Todas as lojas</option>
            {lojas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome}
              </option>
            ))}
          </select>

          {reviewsFiltradas.map((r) => (
            <div key={r.id} className="border p-2 mb-2">
              <strong>Loja:</strong> {r.lojaId} <br />
              <strong>Nota:</strong> {r.nota} <br />
              <strong>Comentário:</strong> {r.comentario}
            </div>
          ))}
        </div>
      )}

      {/* ================= CHATS ================= */}
      {tab === "chats" && (
        <div className="row">
          {/* lista */}
          <div className="col-4">
            <h5>Conversas</h5>

            <select
              className="form-control mb-2"
              onChange={(e) => setLojaFiltroChats(e.target.value)}
            >
              <option value="">Todas lojas</option>
              {lojas.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nome}
                </option>
              ))}
            </select>

            {chatsFiltrados.map((c) => (
              <div
                key={c.id}
                className="border p-2 mb-2"
                onClick={() => setChatSelecionado(c)}
                style={{ cursor: "pointer" }}
              >
                Chat #{c.id}
              </div>
            ))}
          </div>

          {/* mensagens */}
          <div className="col-8">
            <h5>Mensagens</h5>

            {chatSelecionado?.mensagens?.length ? (
              chatSelecionado.mensagens.map((m, i) => (
                <div key={i} className="border p-2 mb-2">
                  <strong>{m.autor}:</strong> {m.texto}
                </div>
              ))
            ) : (
              <p>Selecione uma conversa</p>
            )}
          </div>
        </div>
      )}

      {/* ================= DETALHES USUÁRIO ================= */}
      {selectedUser && (
        <div className="card p-3 mt-3 border-primary">
          <h5>Detalhes do {selectedType}</h5>

          <p><strong>ID:</strong> {selectedUser.id}</p>

          {selectedType === "cliente" && (
            <>
              <p><strong>Nome:</strong> {selectedUser.nome}</p>
              <p><strong>CPF:</strong> {selectedUser.cpf}</p>
              <p><strong>Favoritos:</strong> {selectedUser.favoritos?.length || 0}</p>
            </>
          )}

          {selectedType === "lojista" && (
            <>
              <p><strong>Nome Loja:</strong> {selectedUser.nomeLojaPrincipal}</p>
              <p><strong>CNPJ:</strong> {selectedUser.cnpj}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Telefone:</strong> {selectedUser.telefone}</p>
              <p><strong>Tags:</strong> {selectedUser.tags?.join(", ")}</p>
            </>
          )}

          <button
            className="btn btn-secondary btn-sm mt-2"
            onClick={() => setSelectedUser(null)}
          >
            Fechar
          </button>
        </div>
      )}

      {/* LOGOUT */}
      <button
        className="btn btn-outline-dark w-100 mt-3"
        onClick={() => dispatch(logout())}
      >
        Sair
      </button>
    </Layout>
  );
}