import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'

import {store} from './store'

class App extends PureComponent {

    componentDidMount() {
        SplashScreen.hide()
    }
  
    render() {
        return (
            <Provider store={store}>
            </Provider>
        )
    }  
}

export default App
