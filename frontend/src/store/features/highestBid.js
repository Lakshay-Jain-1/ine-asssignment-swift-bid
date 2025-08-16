import { createSlice } from "@reduxjs/toolkit";
import { resolveTripleslashReference } from "typescript";

const initialState = {
  highestBid: [],
};

const highestBidSlice = createSlice({
  name: "highestBid",
  initialState,
  reducers: {
    push: (state, action) => {
      state.highestBid.push(action.payload);
    },
    replace:(state,action)=>{
        state.highestBid=action.payload
    }
  },
});

export const { push,replace } = highestBidSlice.actions;
export default highestBidSlice.reducer;
