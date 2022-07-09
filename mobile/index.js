import { Navigation } from 'react-native-navigation'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import {
    store, 
    persistor
} from './src/store'
import { COLORS } from './src/utils/stylesConfig'
import App from './src/App'
import Albums from './src/components/Albums'
import Login from './src/components/Login'
import Register from './src/components/Register'
import Upload from './src/components/Upload'
import AlbumAdd from './src/components/common/AlbumAdd'
import AlbumContent from './src/components/AlbumContent'
import Picture from './src/components/Picture'
import PictureDesc from './src/components/PictureDesc'
import Profile from './src/components/Profile'
import ROOTS from './src/utils/roots'
import Share from './src/components/Share'
import AddTag from './src/components/AddTag'
import EditImage from './src/components/EditImage'

Navigation.registerComponent('App', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Login', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Login {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Register', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Register {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Albums', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Albums {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('AlbumAdd', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AlbumAdd {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('AlbumContent', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AlbumContent {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Picture', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Picture {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('PictureDesc', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PictureDesc {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Upload', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Upload {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Profile', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Profile {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('Share', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Share {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('AddTag', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AddTag {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.registerComponent('EditImage', 
    () => (props) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <EditImage {...props} />
            </PersistGate>
        </Provider>
    )
)

Navigation.setDefaultOptions({
    statusBar: {
        backgroundColor: COLORS.turquoise,
        visible: true,
    },
    topBar: {
        visible: false,
        title: {
            color: 'white'
        },
        backButton: {
            color: 'white'
        },
        background: {
            color: '#4d089a'
        },
        title: {},
        subtitle: {},
    },
    animations: {
        setRoot: {
            alpha: {
                from: 0,
                to: 1,
                duration: 400
            }
        }
    }
});

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot(ROOTS.LOGIN)
})
