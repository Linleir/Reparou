import { useSelector, useDispatch } from 'react-redux';
import Layout, { BottomNavLojista } from '../components/Layout';
import { updateAgendamento } from '../features/dataSlice';

export default function AgendamentosPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const agendamentos = useSelector((state) => state.data.agendamentos.filter((item)=>item.lojistaId===user.id));
  return <Layout bottom={<BottomNavLojista />}><div className="profile-header2 mb-3 text-center"><h4>AGENDAMENTOS</h4></div><div className="card p-3 mb-5">{agendamentos.length ? agendamentos.map((ag)=><div className="card mb-3" key={ag.id}><div className="card-body"><span className={`status-badge status-${ag.status}`}>{ag.status.toUpperCase()}</span><h6 className="fw-bold mb-1">{ag.cliente}</h6><p className="mb-1 small"><strong>Serviço:</strong> {ag.servico}</p><p className="mb-2 small"><strong>Data:</strong> {ag.data} às {ag.hora}</p>{ag.status==='pendente' && <div className="mt-3"><button className="btn btn-dark w-100 mb-2" onClick={()=>dispatch(updateAgendamento({ id: ag.id, payload: { status: 'confirmado' } }))}>Confirmar</button><button className="btn btn-outline-dark w-100" onClick={()=>dispatch(updateAgendamento({ id: ag.id, payload: { status: 'cancelado' } }))}>Cancelar</button></div>}{ag.status==='confirmado' && <button className="btn btn-outline-dark w-100 mt-2" onClick={()=>dispatch(updateAgendamento({ id: ag.id, payload: { status: 'cancelado' } }))}>Cancelar</button>}</div></div>) : <div className="text-center py-4 text-muted"><p>Sem agendamentos.</p></div>}</div></Layout>;
}
