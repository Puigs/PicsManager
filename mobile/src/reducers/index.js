/**
 * Module that exports all the redux store reducers
 * @module reducers
 */

import { combineReducers } from 'redux'
import userReducer from './user'
import searchReducer from './search'
import rootReducer from './root'
import modalReducer from './modal'
import albumsReducer from './albums'
import imagesReducer from './images'

export default combineReducers({
    user: userReducer,
    search: searchReducer,
    root: rootReducer,
    modal: modalReducer,
    albums: albumsReducer,
    images: imagesReducer
})