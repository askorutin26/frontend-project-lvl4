import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState(); //По умолчанию: { ids: [], entities: {} }
const messagesSlice = createSlice({
  name: 'messages',
  initialState,

  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    deleteMessage: (state, { payload }) => {
      messagesAdapter.removeOne(state, payload);
    },
    renameMessage: messagesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const { payload } = action;
      messagesAdapter.removeMany(state, [payload]);
    });
  },
});

export const { addMessages, addMessage, deleteMessage, renameMessage } =
  messagesSlice.actions;
export const messagesSelectors = messagesAdapter.getSelectors(
  (state) => state.messages
);

export default messagesSlice.reducer;