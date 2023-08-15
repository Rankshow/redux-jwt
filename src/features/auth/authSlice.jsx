import { createSlice } from "@reduxjs/toolkit";

// authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCreadentials: (state, action) => {
      const {user, accessToken} = action.payload
      state.user = user
      state.token = accessToken
    }, 
    logout: (state, action) => {
      state.user = null
      state.token = null
    }
  },
})

export const { setCreadentials, logout} = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) = state.auth.user
export const selectCurrenToken = (state) = state.auth.token