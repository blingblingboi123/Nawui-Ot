import { createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    pin: null 
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPin: (state, action) => {
      state.pin = action.payload;
    }
  }
});

export const { setUser, setPin } = userSlice.actions;
export default userSlice.reducer;