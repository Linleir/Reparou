
import React from "react";
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/authSlice';
import dataReducer from '../features/dataSlice';
import chatReducer from "../features/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    chat: chatReducer,
  },
});

