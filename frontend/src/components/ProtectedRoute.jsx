import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ roles, children }) {
  const { role } = useSelector((state) => state.auth);

  console.log("ROLE ATUAL:", role);
  console.log("ROLES PERMITIDAS:", roles);

  if (!role) {
    console.log("SEM ROLE");
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(role)) {
    console.log("ROLE NÃO PERMITIDA");
    return <Navigate to="/" replace />;
  }

  return children;
}