import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store'; // Importando o cérebro do Redux
import App from './App';

// Importação dos Estilos Globais
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import './Test.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O Provider garante que qualquer tela acesse os dados das lojas */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);