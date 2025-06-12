import { configureStore } from '@reduxjs/toolkit';
import { graphqlUserApi } from './Api/user/api';
import { graphqlGroupApi } from './Api/group/api';
import { graphqlAi_AssitanceApi } from './Api/ai-assistant/api';
import { graphqlattachment } from './Api/attachment/api';
import reducer from './Global';

export const store = configureStore({
  reducer: {
    [graphqlAi_AssitanceApi.reducerPath]: graphqlAi_AssitanceApi.reducer,
    [graphqlUserApi.reducerPath]: graphqlUserApi.reducer,
    [graphqlGroupApi.reducerPath]: graphqlGroupApi.reducer,
    [graphqlattachment.reducerPath]: graphqlattachment.reducer,
    global: reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      graphqlAi_AssitanceApi.middleware,
      graphqlUserApi.middleware,
      graphqlGroupApi.middleware,
      graphqlattachment.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;