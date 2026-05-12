import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    cart: [],
    addresses: {},
    selectAddress: null,
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    setAddress: (state, action) => {
      const { userId, address } = action.payload;

      if (!userId) return;

      if (Array.isArray(state.addresses)) {
        state.addresses = {};
      }

      if (!state.addresses[userId]) {
        state.addresses[userId] = [];
      }

      state.addresses[userId].push(address);
    },

    setSelectAddress: (state, action) => {
      state.selectAddress = action.payload;
    },

    deleteAddress: (state, action) => {
      const { userId, index } = action.payload;

      if (!userId) return;
      if (!state.addresses[userId]) return;

      state.addresses[userId].splice(index, 1);

      if (state.selectAddress === index) {
        state.selectAddress = null;
      }

      if (state.selectAddress > index) {
        state.selectAddress -= 1;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  setAddress,
  setSelectAddress,
  deleteAddress,
} = ProductSlice.actions;

export default ProductSlice.reducer;