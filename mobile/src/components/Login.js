import React, { PureComponent } from 'react'
import { 
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Toast from 'react-native-simple-toast'
import { Svg } from 'react-native-svg'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'

import AppText from './common/AppText'
import {
    deviceHeight, 
    deviceWidth, 
    COLORS
} from '../utils/stylesConfig'
import ROOTS from '../utils/roots'
import EllipseLayout from './layouts/Layout'
import UnlockSvg from '../assets/images/unlock.svg'
import AppTextInput from './common/AppTextInput'
import AppButton from './common/Button'
import { apiCall } from '../utils/apiCall'
import { store } from '../store'
import { setUser, updateUser } from '../actions/index'

class Login extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            disabled: false
        }
    }

    componentDidMount() {
        const { user } = this.props

        SplashScreen.hide()

        if (user) {
            store.dispatch(updateUser({
                connectedAt: new Date()
            }))
            Navigation.setRoot(ROOTS.ALBUMS)
        }
    }

    handleForgotPassword() {
        console.log("Forgot password")
    }

    handleRegister() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Register'
            }
        })
    }

    credentialsValitated(username, password) {
        return ''
    }

    async handleLoginPress() {
        const { username, password } = this.state

        if (username && password) {
            const errorOnCheck = this.credentialsValitated(username, password)

            if (errorOnCheck) {
                Toast.show(errorOnCheck)

                return
            }

            this.setState({ disabled: true })

            const res = await apiCall({
                route: 'api/auth/login',
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                })
            })

            if (res.message) {
                Toast.show('Invalid credentials')
            } else {
                const result = await res.json()

                store.dispatch(setUser({
                    username: result.username,
                    id: result.id,
                    roles: result.roles,
                    accessToken: result.accessToken,
                    connectedAt: new Date()
                }))
                Navigation.setRoot(ROOTS.ALBUMS)
                    .then(() => Toast.show(`Welcome ${username} !`))
            }

            this.setState({ disabled: false })
        } else {
            Toast.show('You must fill each inputs')
        }
    }
  
    render () {
        const { disabled } = this.state

        return (
            <EllipseLayout>
                <View
                    style={styles.unlockSvg}
                >
                    <Svg 
                        height={"100%"}
                        width={"100%"}
                        preserveAspectRatio="xMinYMin slice"
                        viewBox={`0 0 ${deviceWidth} ${deviceHeight}`}
                    >
                        <UnlockSvg />
                    </Svg>
                </View>

                <View
                    style={styles.welcomeText}
                >
                    <AppText 
                        weight={"Bold"}
                        size={deviceWidth * 0.08}
                    >
                        Welcome Aboard !
                    </AppText>
                </View>
                
                <View
                    style={styles.input}
                >
                    <AppTextInput 
                        label="Username"
                        placeholder="Username..."
                        value={this.state.username}
                        style={{ marginBottom: 16, color: COLORS['black-blue'] }}
                        onChangeText={(v) => this.setState({ username: v })}
                    />

                    <AppTextInput 
                        label="Password"
                        placeholder="Password..."
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={(v) => this.setState({ password: v })}
                    />
                </View>

                <TouchableOpacity
                    onPress={this.handleForgotPassword.bind(this)}
                    style={
                        { padding: 12 }
                    }
                >
                    <AppText
                        size={12}
                    >
                        Forgot Password ?
                    </AppText>
                </TouchableOpacity>

                <AppButton 
                    title="Sign In"
                    onPress={() => this.handleLoginPress()}
                    style={
                        { width: deviceWidth * 0.4, maxWidth: 150, marginTop: deviceHeight * 0.02 }
                    }
                    disabled={disabled}
                />

                <TouchableOpacity
                    onPress={this.handleRegister.bind(this)}
                    style={styles.noAccountText}
                    disabled={disabled}
                >
                    <AppText
                        size={12}
                        color={disabled ? COLORS.gray : COLORS.turquoise}
                        onPress={this.handleRegister.bind(this)}
                    >
                        Doesn't have an account ? Register Here !
                    </AppText>
                </TouchableOpacity>
            </EllipseLayout>
        )
    }  
}

const styles = StyleSheet.create({
    background: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 4,
    },
    button: {
        padding: 4,
        borderRadius: 16
    },
    input: {
        display: 'flex',
        color: '#FFF',
        width: deviceWidth * 0.8,
        minHeight: 50,
        margin: 15,
        paddingHorizontal: 15,
    },
    unlockSvg: {
        width: deviceWidth * 0.25,
        height: deviceHeight * 0.25,
        aspectRatio: deviceWidth / deviceHeight,
        alignSelf: 'center',
        marginTop: deviceHeight * 0.05
    },
    welcomeText: {
        marginVertical: 20,
    },
    noAccountText: {
        position: 'absolute',
        padding: 16,
        bottom: deviceHeight * 0.03
    },
})

const mapStatesToProps = ({ user }) => {
    return { user }
}

export default connect(mapStatesToProps, { setUser })(Login)
