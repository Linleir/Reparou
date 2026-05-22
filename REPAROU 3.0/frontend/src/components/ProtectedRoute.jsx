import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ roles, children }) {
  const { role } = useSelector((state) => state.auth);
  if (!role) return <Navigate to="/" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
