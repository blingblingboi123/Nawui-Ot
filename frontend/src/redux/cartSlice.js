import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      items: [],
      totalPrice: 0,
    },
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = {
        items: [],
        totalPrice: 0,
      };
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;