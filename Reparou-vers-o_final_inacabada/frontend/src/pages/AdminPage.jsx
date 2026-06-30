import React, {
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { formatPhoneBR } from "../utils/format";

import {
  saveLoja,
  saveLojista,
  saveClienteProfile,
  saveDenuncia,
  deleteLoja,
  deleteLojista,
  deleteCliente,
} from "../features/dataSlice";

import {
  deleteMessage,
} from "../features/chatThunks";

export default function AdminPage() {

  const dispatch = useDispatch();

  // =========================================
  // AUTH
  // =========================================

  const user = useSelector(
    (state) => state.auth?.user
  );

  // =========================================
  // STORE
  // =========================================

  const lojas = useSelector(
    (state) => state.data?.lojas || []
  );

  const lojistas = useSelector(
    (state) => state.data?.lojistas || []
  );

  const clientes = useSelector(
    (state) => state.data?.clientes || []
  );

  const denuncias = useSelector(
    (state) => state.data?.denuncias || []
  );

  const chats = useSelector(
    (state) => state.chat?.chats || []
  );

  // =========================================
  // PROTEÇÃO
  // =========================================

  if (!user || user.tipo !== "admin") {


    return (
      <Layout>

        <div className="card p-4">

          <h3>Acesso negado</h3>

          <Link
            to="/"
            className="btn btn-dark mt-2"
          >
            Voltar
          </Link>

        </div>

      </Layout>
    );
  }

  // =========================================
  // STATES
  // =========================================

  const [activeTab, setActiveTab] =
    useState("clientes");

  const [loadingId, setLoadingId] =
    useState(null);

    const [mensagemAdmin, setMensagemAdmin] =
  useState({});

  const [search, setSearch] =
    useState("");

  // =========================================
  // EDIT STATES
  // =========================================

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState({});

  // =========================================
  // HELPERS
  // =========================================

  const includesSearch = (value) =>
    String(value || "")
      .toLowerCase()
      .includes(
        search.toLowerCase()
      );

  const updateField = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  // =========================================
  // FILTERS
  // =========================================

  const filteredLojas = useMemo(() => {

    return lojas.filter(
      (loja) =>
        includesSearch(loja.nome) ||
        includesSearch(
          loja.titulo
        )
    );

  }, [lojas, search]);

  const filteredLojistas =
    useMemo(() => {

      return lojistas.filter(
        (lojista) =>
          includesSearch(
            lojista.responsavel
          ) ||
          includesSearch(
            lojista.email
          )
      );

    }, [lojistas, search]);

  const filteredClientes =
    useMemo(() => {

      return clientes.filter(
        (cliente) =>
          includesSearch(
            cliente.nome
          ) ||
          includesSearch(
            cliente.email
          )
      );

    }, [clientes, search]);

  // =========================================
  // START EDIT
  // =========================================

  const startEdit = (item) => {

    setEditingId(item.id);

    setFormData({
      ...item,
    });

  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const cancelEdit = () => {

    setEditingId(null);

    setFormData({});

  };

  // =========================================
  // SAVE LOJA
  // =========================================

  const salvarLoja = async (
    loja
  ) => {

    try {

      setLoadingId(loja.id);

      const payload = {
        ...loja,
        ...formData,
      };

      await dispatch(
        saveLoja({
          id: loja.id,
          payload,
        })
      ).unwrap();

      alert(
        "Loja atualizada."
      );

      cancelEdit();

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao salvar loja."
      );

    } finally {

      setLoadingId(null);

    }
  };

  // =========================================
  // SAVE LOJISTA
  // =========================================

  const salvarLojista = async (
    lojista
  ) => {

    try {

      setLoadingId(
        lojista.id
      );

      const payload = {
        ...lojista,
        ...formData,
      };

      await dispatch(
        saveLojista({
          id: lojista.id,
          payload,
        })
      ).unwrap();

      alert(
        "Lojista atualizado."
      );

      cancelEdit();

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao salvar lojista."
      );

    } finally {

      setLoadingId(null);

    }
  };

  // =========================================
  // SAVE CLIENTE
  // =========================================

  const salvarCliente =
    async (cliente) => {

      try {

        setLoadingId(
          cliente.id
        );

        const payload = {
          ...cliente,
          ...formData,
        };

        await dispatch(
          saveClienteProfile({
            clienteId:
              cliente.id,
            payload,
          })
        ).unwrap();

        alert(
          "Cliente atualizado."
        );

        cancelEdit();

      } catch (err) {

        console.error(err);

        alert(
          "Erro ao salvar cliente."
        );

      } finally {

        setLoadingId(null);

      }
    };

  // =========================================
  // DELETE LOJA
  // =========================================

  const excluirLoja = async (
    loja
  ) => {

    const confirmacao =
      window.confirm(
        `Excluir loja ${loja.nome}?`
      );

    if (!confirmacao) return;

    try {

      setLoadingId(loja.id);

      await dispatch(
        deleteLoja(loja.id)
      ).unwrap();

      alert(
        "Loja excluída."
      );

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao excluir loja."
      );

    } finally {

      setLoadingId(null);

    }
  };

  // =========================================
  // DELETE LOJISTA
  // =========================================

  const excluirLojista =
    async (lojista) => {

      const confirmacao =
        window.confirm(
          `Excluir lojista ${lojista.responsavel}?`
        );

      if (!confirmacao)
        return;

      try {

        setLoadingId(
          lojista.id
        );

        await dispatch(
          deleteLojista(
            lojista.id
          )
        ).unwrap();

        alert(
          "Lojista excluído."
        );

      } catch (err) {

        console.error(err);

        alert(
          "Erro ao excluir lojista."
        );

      } finally {

        setLoadingId(null);

      }
    };

  // =========================================
  // DELETE CLIENTE
  // =========================================

  const excluirCliente =
    async (cliente) => {

      const confirmacao =
        window.confirm(
          `Excluir cliente ${cliente.nome}?`
        );

      if (!confirmacao)
        return;

      try {

        setLoadingId(
          cliente.id
        );

        await dispatch(
          deleteCliente(
            cliente.id
          )
        ).unwrap();

        alert(
          "Cliente excluído."
        );

      } catch (err) {

        console.error(err);

        alert(
          "Erro ao excluir cliente."
        );

      } finally {

        setLoadingId(null);

      }
    };

  // =========================================
  // DENÚNCIA
  // =========================================

  const resolverDenuncia =
    async (denuncia) => {

      try {

        setLoadingId(
          denuncia.id
        );

        await dispatch(
          saveDenuncia({
            ...denuncia,
            status:
              "Resolvida",
          })
        ).unwrap();

        alert(
          "Denúncia resolvida."
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingId(null);

      }
    };

  // =========================================
  // DELETE MESSAGE
  // =========================================

  const excluirMensagem =
    async (
      chat,
      indexMensagem
    ) => {

      try {

        setLoadingId(chat.id);

        await dispatch(
          deleteMessage({
            chat,
            indexMensagem,
          })
        ).unwrap();

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingId(null);

      }
    };


    const totalMensagens =
  chats.reduce(
    (acc, chat) =>
      acc +
      (
        chat.mensagens?.length || 0
      ),
    0
  );

const denunciasPendentes =
  denuncias.filter(
    (d) =>
      d.status !== "Resolvida"
  ).length;

const lojasMaisAtivas =
  [...lojas]
    .sort((a, b) => {

      const totalA =
        chats.filter(
          (c) =>
            c.lojaId === a.id
        ).length;

      const totalB =
        chats.filter(
          (c) =>
            c.lojaId === b.id
        ).length;

      return totalB - totalA;

    })
    .slice(0, 5);

  // =========================================
  // UI
  // =========================================

  return (
    <Layout>

      <div className="profile-header2 mb-3">

        <h3>
          Painel Admin
        </h3>

        <p>
          Bem-vindo, {
            user.nome
          }
        </p>

      </div>

      {/* TABS */}

      <div className="d-flex gap-2 flex-wrap mb-3">

        {[
          "dashboard",
          "clientes",
          "lojistas",
          "lojas",
          "denuncias",
          "chats",
        ].map((tab) => (

          <button
            key={tab}
            className={`btn btn-sm ${
              activeTab === tab
                ? "btn-dark"
                : "btn-outline-dark"
            }`}
            onClick={() =>
              setActiveTab(tab)
            }
          >
            {tab}
          </button>

        ))}

      </div>

      {/* SEARCH */}

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* ========================================= */
/* CLIENTES */
/* MODELO BASEADO EM EditClienteProfilePage */
/* ========================================= */}

{activeTab === "clientes" && (

  <>
    {filteredClientes.map((cliente) => {

      const perfil =
        cliente?.perfil || {};

      return (

        <div
          key={cliente.id}
          className="card p-3 mb-3"
        >

          {editingId ===
          cliente.id ? (

            <>

              {/* NOME */}
              <input
                className="form-control mb-2"
                placeholder="Nome"
                value={
                  formData.nome || ""
                }
                onChange={(e) =>
                  updateField(
                    "nome",
                    e.target.value.replace(
                      /[^A-Za-zÀ-ÿ\s]/g,
                      ""
                    )
                  )
                }
              />

              {/* SOBRENOME */}
              <input
                className="form-control mb-2"
                placeholder="Sobrenome"
                value={
                  formData.sobrenome ||
                  ""
                }
                onChange={(e) =>
                  updateField(
                    "sobrenome",
                    e.target.value.replace(
                      /[^A-Za-zÀ-ÿ\s]/g,
                      ""
                    )
                  )
                }
              />

              {/* BAIRRO */}
              <input
                className="form-control mb-2"
                placeholder="Bairro"
                value={
                  formData.perfil
                    ?.bairro || ""
                }
                onChange={(e) =>
                  updateField(
                    "perfil",
                    {
                      ...formData.perfil,
                      bairro:
                        e.target.value.replace(
                          /[^A-Za-zÀ-ÿ\s]/g,
                          ""
                        ),
                    }
                  )
                }
              />

              {/* MUNICÍPIO */}
              <input
                className="form-control mb-2"
                placeholder="Município"
                value={
                  formData.perfil
                    ?.municipio || ""
                }
                onChange={(e) =>
                  updateField(
                    "perfil",
                    {
                      ...formData.perfil,
                      municipio:
                        e.target.value.replace(
                          /[^A-Za-zÀ-ÿ\s]/g,
                          ""
                        ),
                    }
                  )
                }
              />

              {/* TELEFONE 1 */}
              <input
                className="form-control mb-2"
                placeholder="Telefone 1"
                value={
                  formData.perfil
                    ?.telefone1 || ""
                }
                onChange={(e) =>
                  updateField(
                    "perfil",
                    {
                      ...formData.perfil,
                      telefone1:
                        e.target.value,
                    }
                  )
                }
              />

              {/* TELEFONE 2 */}
              <input
                className="form-control mb-2"
                placeholder="Telefone 2"
                value={
                  formData.perfil
                    ?.telefone2 || ""
                }
                onChange={(e) =>
                  updateField(
                    "perfil",
                    {
                      ...formData.perfil,
                      telefone2:
                        e.target.value,
                    }
                  )
                }
              />

              {/* EMAIL */}
              <input
                className="form-control mb-3"
                placeholder="Email"
                value={
                  formData.email || ""
                }
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
              />

              {/* BOTÕES */}
              <div className="d-flex gap-2">

                <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    salvarCliente(
                      cliente
                    )
                  }
                >
                  Salvar
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>

              </div>

            </>

          ) : (

            <>

              <strong>
                {cliente.nome}{" "}
                {
                  cliente.sobrenome
                }
              </strong>

              <small>
                {cliente.email}
              </small>

              <div>
                📍 Bairro:{" "}
                {
                  perfil.bairro
                }
              </div>

              <div>
                🏙️ Município:{" "}
                {
                  perfil.municipio
                }
              </div>

              <div>
                📞{" "}
                {
                  perfil.telefone1
                }
              </div>

              <div>
                📞{" "}
                {
                  perfil.telefone2
                }
              </div>

              <div className="d-flex gap-2 mt-2">

                <button
                  className="btn btn-dark btn-sm"
                  onClick={() =>
                    startEdit(
                      cliente
                    )
                  }
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    excluirCliente(
                      cliente
                    )
                  }
                >
                  Excluir
                </button>

              </div>

            </>

          )}

        </div>

      );
    })}
  </>

)}

{/* ========================================= */
/* DASHBOARD */
/* ========================================= */}

{activeTab ===
  "dashboard" && (

  <>

    {/* ========================================= */
/* CARDS DASHBOARD */
/* ========================================= */}

<div className="row g-3 mb-4">
  {/* CLIENTES */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          Clientes
        </h6>

        <h2 className="fw-bold mb-0">
          {clientes.length}
        </h2>

      </div>

    </div>

  </div>

  {/* LOJISTAS */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          Lojistas
        </h6>

        <h2 className="fw-bold mb-0">
          {lojistas.length}
        </h2>

      </div>

    </div>

  </div>

  {/* LOJAS */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          Lojas
        </h6>

        <h2 className="fw-bold mb-0">
          {lojas.length}
        </h2>

      </div>

    </div>

  </div>

  {/* CHATS */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          Chats
        </h6>

        <h2 className="fw-bold mb-0">
          {chats.length}
        </h2>

      </div>

    </div>

  </div>

  {/* MENSAGENS */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          MSG
        </h6>

        <h2 className="fw-bold mb-0">
          {totalMensagens}
        </h2>

      </div>

    </div>

  </div>

  {/* DENÚNCIAS */}
  <div className="col-12 col-sm-6 col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <h6 className="text-muted mb-2">
          Denúncias Pendentes
        </h6>

        <h2 className="fw-bold mb-0">
          {denunciasPendentes}
        </h2>

      </div>

    </div>

  </div>

</div>

    {/* LOJAS MAIS ATIVAS */}
    <div className="card p-3">

      <h4 className="mb-3">

        Lojas Mais Ativas

      </h4>

      {lojasMaisAtivas.map(
        (loja) => {

          const totalChats =
            chats.filter(
              (c) =>
                c.lojaId === loja.id
            ).length;

          return (

            <div
              key={loja.id}
              className="border rounded p-2 mb-2"
            >

              <strong>
                {loja.nome}
              </strong>

              <div>
                Chats:
                {" "}
                {
                  totalChats
                }
              </div>

            </div>

          );
        }
      )}

    </div>

  </>

)}



{/* ========================================= */
/* LOJISTAS */
/* ========================================= */}

{activeTab === "lojistas" && (

  <>
    {filteredLojistas.map((lojista) => (

      <div
        key={lojista.id}
        className="card p-3 mb-3"
      >

        {editingId === lojista.id ? (

          <>

            {/* RESPONSÁVEL */}
            <input
              className="form-control mb-2"
              placeholder="Responsável"
              value={
                formData.responsavel || ""
              }
              onChange={(e) =>
                updateField(
                  "responsavel",
                  e.target.value.replace(
                    /[^A-Za-zÀ-ÿ\s]/g,
                    ""
                  )
                )
              }
            />

            {/* EMAIL */}
            <input
              className="form-control mb-2"
              placeholder="Email"
              value={
                formData.email || ""
              }
              onChange={(e) =>
                updateField(
                  "email",
                  e.target.value
                    .replace(/\s/g, "")
                    .toLowerCase()
                )
              }
            />

            {/* TELEFONE */}
            <input
              className="form-control mb-2"
              placeholder="Telefone"
              value={
                formData.telefone || ""
              }
              onChange={(e) =>
                updateField(
                  "telefone",
                  formatPhoneBR(e.target.value)
                )
              }
            />

            {/* ENDEREÇO */}
            <input
              className="form-control mb-2"
              placeholder="Endereço"
              value={
                formData.endereco || ""
              }
              onChange={(e) =>
                updateField(
                  "endereco",
                  e.target.value
                )
              }
            />

            {/* BAIRRO */}
            <input
              className="form-control mb-2"
              placeholder="Bairro"
              value={
                formData.bairro || ""
              }
              onChange={(e) =>
                updateField(
                  "bairro",
                  e.target.value.replace(
                    /[^A-Za-zÀ-ÿ\s]/g,
                    ""
                  )
                )
              }
            />

            {/* MUNICÍPIO */}
            <input
              className="form-control mb-3"
              placeholder="Município"
              value={
                formData.municipio || ""
              }
              onChange={(e) =>
                updateField(
                  "municipio",
                  e.target.value.replace(
                    /[^A-Za-zÀ-ÿ\s]/g,
                    ""
                  )
                )
              }
            />

            {/* BOTÕES */}
            <div className="d-flex gap-2">

              <button
                className="btn btn-success btn-sm"
                onClick={() =>
                  salvarLojista(
                    lojista
                  )
                }
              >
                Salvar
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={cancelEdit}
              >
                Cancelar
              </button>

            </div>

          </>

        ) : (

          <>

            <strong>
              {
                lojista.responsavel
              }
            </strong>

            <small>
              {lojista.email}
            </small>

            <div>
              📞{" "}
              {
                lojista.telefone
              }
            </div>

            <div>
              🏠{" "}
              {
                lojista.endereco
              }
            </div>

            <div>
              📍{" "}
              {
                lojista.bairro
              }
            </div>

            <div>
              🏙️{" "}
              {
                lojista.municipio
              }
            </div>

            <div className="d-flex gap-2 mt-2">

              <button
                className="btn btn-dark btn-sm"
                onClick={() =>
                  startEdit(
                    lojista
                  )
                }
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  excluirLojista(
                    lojista
                  )
                }
              >
                Excluir
              </button>

            </div>

          </>

        )}

      </div>

    ))}
  </>

)}


{/* ========================================= */
/* LOJAS */
/* ========================================= */}

{activeTab === "lojas" && (

  <>
    {filteredLojas.map((loja) => (

      <div
        key={loja.id}
        className="card p-3 mb-3"
      >

        {editingId === loja.id ? (

          <>

            <input
              className="form-control mb-2"
              placeholder="Nome"
              value={formData.nome || ""}
              onChange={(e) =>
                updateField(
                  "nome",
                  e.target.value
                )
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Título"
              value={
                formData.titulo || ""
              }
              onChange={(e) =>
                updateField(
                  "titulo",
                  e.target.value
                )
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Imagem"
              value={
                formData.imagem || ""
              }
              onChange={(e) =>
                updateField(
                  "imagem",
                  e.target.value
                )
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Lojista ID"
              value={
                formData.lojistaId || ""
              }
              onChange={(e) =>
                updateField(
                  "lojistaId",
                  e.target.value
                )
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Tags separadas por vírgula"
              value={
                formData.tags?.join(
                  ", "
                ) || ""
              }
              onChange={(e) =>
                updateField(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((tag) =>
                      tag.trim()
                    )
                )
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Telefones separados por vírgula"
              value={
                formData.telefones?.join(
                  ", "
                ) || ""
              }
              onChange={(e) =>
                updateField(
                  "telefones",
                  e.target.value
                    .split(",")
                    .map((t) =>
                      t.trim()
                    )
                )
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Endereços separados por vírgula"
              value={
                formData.enderecos?.join(
                  ", "
                ) || ""
              }
              onChange={(e) =>
                updateField(
                  "enderecos",
                  e.target.value
                    .split(",")
                    .map((e) =>
                      e.trim()
                    )
                )
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Linhas endereço separadas por vírgula"
              value={
                formData.enderecoLinhas?.join(
                  ", "
                ) || ""
              }
              onChange={(e) =>
                updateField(
                  "enderecoLinhas",
                  e.target.value
                    .split(",")
                    .map((e) =>
                      e.trim()
                    )
                )
              }
            />

            <div className="d-flex gap-2">

              <button
                className="btn btn-success btn-sm"
                onClick={() =>
                  salvarLoja(loja)
                }
              >
                Salvar
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={cancelEdit}
              >
                Cancelar
              </button>

            </div>

          </>

        ) : (

          <>

            <strong>
              {loja.nome}
            </strong>

            <small>
              {loja.titulo}
            </small>

            <div>
              👤 {loja.lojistaId}
            </div>

            <div>
              📞{" "}
              {loja.telefones?.join(
                " • "
              )}
            </div>

            <div>
              📍{" "}
              {loja.enderecos?.join(
                " • "
              )}
            </div>

            <div>
              🏷️{" "}
              {loja.tags?.join(
                ", "
              )}
            </div>

            <div className="d-flex gap-2 mt-2">

              <button
                className="btn btn-dark btn-sm"
                onClick={() =>
                  startEdit(loja)
                }
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  excluirLoja(loja)
                }
              >
                Excluir
              </button>

            </div>

          </>

        )}

      </div>

    ))}
  </>

)}

 {/* ========================================= */
/* DENUNCIAS */
/* ========================================= */}

{activeTab === "denuncias" && (
  <>
    {denuncias.map((denuncia) => {

      // CHAT RELACIONADO (corrigido)
      const chat = chats.find(
        (c) => String(c.id) === String(denuncia.chatId)
      );

      return (
        <div
          key={denuncia.id}
          className="card p-3 mb-3"
        >
          {/* LOJA */}
          <strong>
            {denuncia.lojaNome}
          </strong>

          {/* STATUS */}
          <div className="mb-2">
            Status: {denuncia.status}
          </div>

          {/* MOTIVOS */}
          <div className="mb-2">
            <strong>Motivos:</strong>{" "}
            {denuncia.motivos?.join(", ")}
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-3">
            <strong>Descrição:</strong>{" "}
            {denuncia.descricao}
          </div>

          {/* CHAT */}
          <div className="border rounded p-2 mb-3 bg-light">
            <h6 className="mb-3">Conversa</h6>

            {!chat ? (
              <div className="small text-muted">
                Nenhum chat encontrado.
              </div>
            ) : (
              chat.mensagens?.map((msg, index) => (
                <div
                  key={index}
                  className="border rounded p-2 mb-2 bg-white"
                >
                  <strong>{msg.autor}</strong>
                  <div>{msg.texto}</div>
                </div>
              ))
            )}

            {/* INPUT ADMIN */}
            <input
              className="form-control mb-2"
              placeholder="Responder cliente"
              value={mensagemAdmin[denuncia.id] || ""}
              onChange={(e) =>
                setMensagemAdmin({
                  ...mensagemAdmin,
                  [denuncia.id]: e.target.value,
                })
              }
            />

            {/* BOTÃO ENVIAR */}
            <button
              className="btn btn-dark btn-sm"
              onClick={async () => {
                const texto = mensagemAdmin[denuncia.id];

                if (!chat) {
                  alert("Chat não encontrado.");
                  return;
                }

                if (!texto) return;

                await dispatch(
                  sendMessage({
                    chat,
                    text: texto,
                    author: "admin",
                  })
                );

                setMensagemAdmin({
                  ...mensagemAdmin,
                  [denuncia.id]: "",
                });
              }}
            >
              Enviar resposta
            </button>
          </div>

          {/* BOTÃO RESOLVER */}
          <button
            className="btn btn-success btn-sm"
            onClick={() => resolverDenuncia(denuncia)}
          >
            Resolver
          </button>
        </div>
      );
    })}
  </>
)}
      {/* ========================================= */
/* CHATS */
/* ========================================= */}

{activeTab === "chats" && (

  <>

    {chats.map((chat) => (

      <div
        key={chat.id}
        className="card p-3 mb-4"
      >

        {/* HEADER CHAT */}
        <div className="mb-3">

          <strong className="fs-5">
            {
              chat.tituloServico
            }
          </strong>

          <div className="small text-muted">

            Cliente:
            {" "}
            {
              chat.clienteId
            }

          </div>

          <div className="small text-muted">

            Loja:
            {" "}
            {
              chat.lojaId
            }

          </div>

        </div>

        {/* MENSAGENS */}
        <div className="d-flex flex-column gap-2">

          {chat.mensagens?.map(
            (
              mensagem,
              index
            ) => {

              // identifica autor
              const isAdmin =
                mensagem.autor
                  ?.toLowerCase()
                  .includes(
                    "admin"
                  );

              const isCliente =
                mensagem.autor
                  ?.toLowerCase()
                  .includes(
                    "cliente"
                  );

              const isLojista =
                mensagem.autor
                  ?.toLowerCase()
                  .includes(
                    "lojista"
                  );

              return (

                <div
                  key={index}
                  className={`border rounded p-2 ${
                    isAdmin
                      ? "bg-danger-subtle"
                      : isCliente
                      ? "bg-primary-subtle"
                      : isLojista
                      ? "bg-success-subtle"
                      : "bg-light"
                  }`}
                >

                  {/* AUTOR */}
                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <strong>

                        {isAdmin &&
                          "🛡️ Admin"}

                        {isCliente &&
                          "👤 Cliente"}

                        {isLojista &&
                          "🏪 Lojista"}

                        {!isAdmin &&
                          !isCliente &&
                          !isLojista &&
                          mensagem.autor}

                      </strong>

                    </div>

                    {/* DATA */}
                    <small className="text-muted">

                      {
                        mensagem.data
                      }

                    </small>

                  </div>

                  {/* TEXTO */}
                  <div className="mt-2">

                    {
                      mensagem.texto
                    }

                  </div>

                  {/* BOTÃO */}
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() =>
                      excluirMensagem(
                        chat,
                        index
                      )
                    }
                  >
                    Excluir mensagem
                  </button>

                </div>

              );
            }
          )}

        </div>

      </div>

    ))}

  </>

)}

    </Layout>
  );
}