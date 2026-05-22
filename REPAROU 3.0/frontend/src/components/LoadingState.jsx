import React from "react";
export default function LoadingState({ text = 'Carregando...' }) {
  return <div className="card p-4 text-center">{text}</div>;
}
