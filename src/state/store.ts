// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './Global'; // This should be your combined global slice
import { graphqlUserApi } from './Api/user/api';
import { graphqlGroupApi } from './Api/group/api';
import { graphqlAi_AssitanceApi } from './Api/ai-assistant/api';
import { graphqlattachment } from './Api/attachment/api';

// Combine reducers
const rootReducer = combineReducers({
  [graphqlAi_AssitanceApi.reducerPath]: graphqlAi_AssitanceApi.reducer,
  [graphqlUserApi.reducerPath]: graphqlUserApi.reducer,
  [graphqlGroupApi.reducerPath]: graphqlGroupApi.reducer,
  [graphqlattachment.reducerPath]: graphqlattachment.reducer,
  global: reducer, // this will be persisted
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global'], // persist only the global slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }).concat(
      graphqlAi_AssitanceApi.middleware,
      graphqlUserApi.middleware,
      graphqlGroupApi.middleware,
      graphqlattachment.middleware
    ),
});

// Persistor for <PersistGate />
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
