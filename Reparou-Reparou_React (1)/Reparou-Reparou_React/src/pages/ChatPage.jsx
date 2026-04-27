import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout, { BottomNavCliente, BottomNavLojista } from '../components/Layout';
import {createChat,saveReview,sendMessage,editMessage,deleteMessage} from '../features/dataSlice';
import { formatDateTime } from '../utils/format';

export default function ChatPage() {
  const { chatId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const data = useSelector((state) => state.data);

  const role = auth?.role || null;
  const user = auth?.user || null;
  const lojas = Array.isArray(data?.lojas) ? data.lojas : [];
  const chats = Array.isArray(data?.chats) ? data.chats : [];

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const lojaIdFromQuery = params.get('lojaId');
  const servicoIdFromQuery = params.get('servicoId');

  const realChat = chats.find((item) => String(item.id) === String(chatId)) || null;
  const lojaFromChat = lojas.find((item) => String(item.id) === String(realChat?.lojaId)) || null;
  const lojaFromQuery = lojas.find((item) => String(item.id) === String(lojaIdFromQuery)) || null;
  const loja = lojaFromChat || lojaFromQuery || lojas[0] || null;

  const servicoSelecionado = loja?.servicos?.find(
    (servico) => String(servico.id) === String(servicoIdFromQuery)
  ) || null;

  const [msg, setMsg] = useState('');
  const [nota, setNota] = useState(5);
  const [textoAvaliacao, setTextoAvaliacao] = useState('');
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');
  const mensagens = Array.isArray(realChat?.mensagens) ? realChat.mensagens : [];
  const tags = Array.isArray(realChat?.tags)
    ? realChat.tags
    : [
        servicoSelecionado?.tag,
        ...(Array.isArray(loja?.tags) ? loja.tags : []),
      ].filter((tag, index, arr) => tag && arr.indexOf(tag) === index).slice(0, 3);

  const tituloServico = realChat?.tituloServico || servicoSelecionado?.nome || loja?.servicos?.[0]?.nome || 'Serviço';
  const serviceTag = realChat?.serviceTag || servicoSelecionado?.tag || loja?.servicos?.[0]?.tag || 'Serviço';
  const backTo = role === 'lojista' ? '/lojista/chats' : '/mensagens';
  const bottom = role === 'lojista' ? <BottomNavLojista /> : <BottomNavCliente />;

  const handleSend = async () => {
    const texto = msg.trim();
    if (!texto || !user) return;

    if (!realChat) {
      if (!loja) return;

      const payload = {
        id: `chat-${Date.now()}`,
        lojaId: loja.id,
        clienteId: user.id,
        clienteNome: user.nome ? `${user.nome} ${user.sobrenome || ''}`.trim() : 'Cliente',
        serviceTag,
        tags,
        tituloServico,
        status: 'ativo',
        mensagens: [
          {
            autor: role === 'lojista' ? 'loja' : 'cliente',
            texto,
            horario: new Date().toISOString(),
          },
        ],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        avaliacaoId: null,
      };

      const result = await dispatch(createChat(payload)).unwrap();
      setMsg('');
      navigate(`/chat/${result.id}`);
      return;
    }

    await dispatch(
      sendMessage({
        chat: realChat,
        text: texto,
        author: role === 'lojista' ? 'loja' : 'cliente',
      })
    ).unwrap();

    setMsg('');
  };

  const handleSaveReview = async () => {
    if (!realChat || !textoAvaliacao.trim()) return;

    await dispatch(
      saveReview({
        review: {
          id: realChat?.avaliacaoId || undefined,
          chatId: realChat.id,
          lojaId: realChat.lojaId,
          cliente: user?.nome || 'Cliente',
          tituloServico: realChat.tituloServico,
          serviceTag: realChat.serviceTag,
          tags: Array.isArray(realChat.tags) ? realChat.tags : [],
          nota,
          texto: textoAvaliacao,
          dataIso: new Date().toISOString(),
        },
        chatId: realChat.id,
      })
    ).unwrap();

    navigate('/avaliacoes/historico');
  };

  return (
    <Layout bottom={bottom}>
      <div className="chat-page-safe">
        <div className="profile-header2 mb-3">
          <div className="text-start">
            <Link to={backTo} className="text-white text-decoration-none">←</Link>
          </div>

          <div className="d-flex gap-3 align-items-center mt-2 text-start">
            <img
              src={loja?.imagem || '/imgtst.jpg'}
              className="shop-img"
              alt="Loja"
            />
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <h5 className="mb-1">{loja?.nome || 'Loja'}</h5>
              {Array.isArray(loja?.enderecoLinhas) && loja.enderecoLinhas.length > 0 ? (
                <div className="small">{loja.enderecoLinhas.join(' • ')}</div>
              ) : null}
              {Array.isArray(loja?.telefones) && loja.telefones.length > 0 ? (
                <div className="small">{loja.telefones.join(' • ')}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card p-3 mb-5 chat-card-safe">
          <div className="mb-2">
            <span className="review-service-chip">{tituloServico}</span>
          </div>

          <div className="mb-3">
            {tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>

          <div className="chat-messages-safe">
            {realChat ? (
              mensagens.length > 0 ? (
                mensagens.map((mensagem, index) => {
                  const minhaMensagem = mensagem?.autor === (role === 'lojista' ? 'loja' : 'cliente');
                  return (
                    <div
                      key={index}
                      className="d-flex"
                      style={{ justifyContent: minhaMensagem ? 'flex-end' : 'flex-start' }}
                    >
                      <div
                        className={minhaMensagem ? 'message-bubble mine' : 'message-bubble other'}
                        style={{ wordBreak: 'break-word' }}
                      >
                        <div>{editandoIndex === index ? (
  <>
    <input
      className="form-control mb-2"
      value={textoEditado}
      onChange={(e) => setTextoEditado(e.target.value)}
    />

    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => {
          dispatch(
            editMessage({
              chat: realChat,
              indexMensagem: index,
              novoTexto: textoEditado
            })
          );

          setEditandoIndex(null);
          setTextoEditado('');
        }}
      >
        Salvar
      </button>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => {
          setEditandoIndex(null);
          setTextoEditado('');
        }}
      >
        Cancelar
      </button>
    </div>
  </>
) : (
  <>
    <div>{mensagem?.texto || ''}</div>

    {mensagem?.editado && (
      <small className="text-muted">(editado)</small>
    )}
  </>
)}</div> 
                        <div className="small mt-1" style={{ opacity: 0.7, textAlign: 'right' }}>
                          {mensagem?.horario ? formatDateTime(mensagem.horario) : ''}
                          {minhaMensagem && editandoIndex !== index && (
  <div className="d-flex gap-2 justify-content-end mt-1">

    <button
      type="button"
      className="btn btn-link btn-sm p-0"
      onClick={() => {
        setEditandoIndex(index);
        setTextoEditado(mensagem.texto);
      }}
    >
      ✏️ Editar
    </button>

    <button
      type="button"
      className="btn btn-link btn-sm p-0 text-danger"
      onClick={() => {
        if (window.confirm('Deseja excluir esta mensagem?')) {
          dispatch(
            deleteMessage({
              chat: realChat,
              indexMensagem: index
            })
          );
        }
      }}
    >
      🗑 Excluir
    </button>

  </div>
)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted py-4">Nenhuma mensagem ainda.</div>
              )
            ) : (
              <div className="text-center text-muted py-4">
                Inicie a conversa enviando a primeira mensagem.
              </div>
            )}
          </div>

          <div className="chat-input-row-safe mt-3">
            <input
              className="form-control"
              placeholder="Escreva uma mensagem..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button type="button" className="btn btn-dark flex-shrink-0" onClick={handleSend}>
              Enviar
            </button>
          </div>

          {role === 'cliente' && realChat && realChat.status !== 'finalizado-avaliado' ? (
            <div className="mt-4">
              <h6>Avaliar atendimento</h6>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-select ${nota >= star ? 'active' : ''}`}
                    onClick={() => setNota(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="form-control mb-2"
                rows={3}
                value={textoAvaliacao}
                onChange={(e) => setTextoAvaliacao(e.target.value)}
                placeholder="Escreva sua avaliação"
              />
              <button type="button" className="btn btn-custom" onClick={handleSaveReview}>
                Salvar avaliação
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
