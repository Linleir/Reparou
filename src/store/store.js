import { configureStore } from '@reduxjs/toolkit';
import lojasReducer from './lojasSlice';

// Configura o cofre central do Redux
export const store = configureStore({
  reducer: {
    // 'lojas' será o nome da variável que usaremos nas telas para acessar os dados
    lojas: lojasReducer,
    
    // Se no futuro você criar um usuariosSlice.js para gerir o login, entraria aqui:
    // usuarios: usuariosReducer 
  },
});