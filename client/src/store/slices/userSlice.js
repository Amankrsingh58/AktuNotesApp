import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserAuthenticated: false,
  userInfo: null,
  userAuthChecked: false,
  isAuthModalOpen: false,
  authModalType: 'signup', // 'login' or 'signup'
};

const userSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserAuth: (state, action) => {
      state.isUserAuthenticated = true;
      state.userInfo = action.payload;
      state.userAuthChecked = true;
    },
    clearUserAuth: (state) => {
      state.isUserAuthenticated = false;
      state.userInfo = null;
      state.userAuthChecked = true;
    },
    updateFollowing: (state, action) => {
      if (state.userInfo) {
        state.userInfo.following = action.payload;
      }
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalType = action.payload || 'signup';
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { setUserAuth, clearUserAuth, updateFollowing, openAuthModal, closeAuthModal } = userSlice.actions;
export default userSlice.reducer;
