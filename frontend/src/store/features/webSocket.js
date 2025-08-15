import { createSlice } from "@reduxjs/toolkit";
import io  from "socket.io-client";

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    disconnect: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },
  },
});

export const { setSocket, disconnect } = socketSlice.actions;

// AsyncThunk middleware
export const connectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socketClient;
  console.log("Connecting socket to:", import.meta.env.VITE_BACKEND_URL);
  if (!socket) {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    dispatch(setSocket(socket));
  }
};

export default socketSlice.reducer;
