import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
};
const currentChannelSlice = createSlice({
  name: 'currentChannel',
  initialState,

  reducers: {
    setCurrentChannel: (state, action) => {
      state.id = action;
    },
  },
});

export const { setCurrentChannel } = currentChannelSlice.actions;
export default currentChannelSlice.reducer;
