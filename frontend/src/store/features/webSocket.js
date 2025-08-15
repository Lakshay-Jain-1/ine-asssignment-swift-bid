import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  io: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.io = action.payload;
    },
    disconnect: (state) => {
      if (state.io) {
        state.io.disconnect();
      }
      state.io = null;
    },
  },
});

export const { setSocket, disconnect } = socketSlice.actions;

// AsyncThunk for middleware
export const connectSocket = () => (dispatch, getState) => {
  const { io } = getState().socket;
  if (!io) {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    dispatch(setSocket(socket));
  }
};

export default socketSlice.reducer;
