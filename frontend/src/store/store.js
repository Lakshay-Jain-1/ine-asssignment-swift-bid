import { configureStore } from "@reduxjs/toolkit";
import SocketReducer from "./features/webSocket.js";
export const store = configureStore({
  reducer: {
    socketClient: SocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables the warning
    }),
});
