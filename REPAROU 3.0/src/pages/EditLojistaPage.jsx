import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout, { BottomNavLojista } from '../components/Layout';
import { saveLojista } from '../features/dataSlice';

export default function EditLojistaPage() {
  const { user } = useSelector((state) => state.auth);
  const lojista = useSelector((state) => state.data.lojistas.find((item) => item.id === user.id));
  const [responsavel, setResponsavel] = useState(lojista?.responsavel || '');
  const [email, setEmail] = useState(lojista?.email || '');
  const [telefone, setTelefone] = useState(lojista?.telefone || '');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return <Layout bottom={<BottomNavLojista />}><div className="profile-header2 mb-3"><Link to="/lojista/perfil" className="text-white text-decoration-none">←</Link><h4 className="mt-2">Editar Perfil Lojista</h4></div><div className="card p-3 mb-5"><div className="mb-2"><input className="form-control" value={responsavel} onChange={(e)=>setResponsavel(e.target.value)} placeholder="Responsável" /></div><div className="mb-2"><input className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" /></div><div className="mb-3"><input className="form-control" value={telefone} onChange={(e)=>setTelefone(e.target.value)} placeholder="Telefone" /></div><button className="btn btn-custom w-100 mb-2" onClick={async()=>{ await dispatch(saveLojista({ id: lojista.id, payload: { responsavel, email, telefone } })); navigate('/lojista/perfil'); }}>Salvar perfil</button><Link to="/lojista/perfil" className="btn btn-outline-dark w-100">Voltar</Link></div></Layout>;
}
