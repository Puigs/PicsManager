import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user']
}
const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducer, {}, applyMiddleware(ReduxThunk))
const persistor = persistStore(store)

export {
    store,
    persistor
}