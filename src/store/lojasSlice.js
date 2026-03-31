import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Busca os dados do servidor na porta 3001 para evitar conflito com o React
export const buscarLojas = createAsyncThunk(
  'lojas/buscarLojas',
  async () => {
    const response = await fetch('http://localhost:3001/lojas');
    if (!response.ok) throw new Error('Erro ao conectar ao servidor');
    return await response.json();
  }
);

const lojasSlice = createSlice({
  name: 'lojas',
  initialState: { lista: [], status: 'idle', erro: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarLojas.pending, (state) => { state.status = 'loading'; })
      .addCase(buscarLojas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lista = action.payload;
      })
      .addCase(buscarLojas.rejected, (state, action) => {
        state.status = 'failed';
        state.erro = action.error.message;
      });
  }
});

export default lojasSlice.reducer;