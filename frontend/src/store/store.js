import { configureStore } from "@reduxjs/toolkit";
import SocketReducer from "./features/webSocket.js";
import highestReducer from "./features/highestBid.js";
export const store = configureStore({
  reducer: {
    socketClient: SocketReducer,
    highestBid:highestReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables the warning
    }),
});
