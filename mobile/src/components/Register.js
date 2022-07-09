import React, { PureComponent } from 'react'
import { 
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Toast from 'react-native-simple-toast'
import { Svg } from 'react-native-svg'

import AppText from './common/AppText'
import {
    deviceHeight,
    deviceWidth,
    COLORS
} from '../utils/stylesConfig'
import EllipseLayout from './layouts/Layout'
import RegisterSvg from '../assets/images/register.svg'
import AppTextInput from './common/AppTextInput'
import AppButton from './common/Button'
import { apiCall } from '../utils/apiCall'

class Register extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            disabled: false
        }
    }

    handleForgotPassword() {
        console.log("Forgot password")
    }

    handleGoBack() {
        Navigation.pop(this.props.componentId)
    }

    credentialsValitated(username, password, confirmPassword) {
        if (password !== confirmPassword)
            return '"Password" and "Confirmed Password" must be the same'

        return ''
    }

    async handleRegisterPress() {
        const { username, password, confirmPassword } = this.state
        const { componentId } = this.props

        if (username && password && confirmPassword) {
            const errorOnCheck = this.credentialsValitated(username, password, confirmPassword)

            if (errorOnCheck) {
                Toast.show(errorOnCheck)

                return
            }

            this.setState({ disabled: true })

            const res = await apiCall({
                route: 'api/auth/register',
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                })
            })

            if (res.message) {
                Toast.show(
                   'Erreur lors de la communication avec le serveur'
                )
            } else {
                Navigation.popToRoot(componentId)
                    .then(() => Toast.show('Registered successfully'))
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
                        viewBox={`0 0 ${deviceWidth} ${deviceHeight * 0.7}`}
                        style={{
                            marginLeft: deviceWidth * 0.26,
                        }}
                    >
                        <RegisterSvg />
                    </Svg>
                </View>

                <View
                    style={styles.welcomeText}
                >
                    <AppText 
                        weight={"Bold"}
                        size={deviceWidth * 0.075}
                        style={
                            { textAlign: 'center' }
                        }
                    >
                        Let's help you manage your pictures...
                    </AppText>
                </View>
                
                <View
                    style={styles.input}
                >
                    <AppTextInput 
                        label="Choose your Username"
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={(v) => this.setState({ username: v })}
                        style={{
                            marginBottom: deviceHeight * 0.015
                        }}
                    />

                    <AppTextInput 
                        label="Choose your Password"
                        placeholder="Password"
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={(v) => this.setState({ password: v })}
                        style={{
                            marginBottom: deviceHeight * 0.015
                        }}
                    />

                    <AppTextInput 
                        label="Confirm your Password"
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        value={this.state.confirmPassword}
                        onChangeText={(v) => this.setState({ confirmPassword: v })}
                    />
                </View>

                <AppButton 
                    title="Register"
                    onPress={() => {
                        this.handleRegisterPress()
                    }}
                    style={
                        { width: deviceWidth * 0.4, maxWidth: 150, marginTop: deviceHeight * 0.02 }
                    }
                    disabled={disabled}
                />

                <TouchableOpacity
                    onPress={this.handleGoBack.bind(this)}
                    style={styles.noAccountText}
                    disabled={disabled}
                >
                    <AppText
                        size={12}
                        color={disabled ? COLORS.gray : COLORS.turquoise}
                    >
                        Go Back
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
        height: deviceHeight * 0.2,
        aspectRatio: (deviceWidth * 0.6) / (deviceHeight * 0.15),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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

export default Register
