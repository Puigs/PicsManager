import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import { launchCamera } from 'react-native-image-picker'
import { Navigation } from 'react-native-navigation'

import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../../utils/stylesConfig'
import FolderSvg from '../../assets/images/folder.svg'
import CameraSvg from '../../assets/images/camera.svg'
import ProfileSvg from '../../assets/images/profile.svg'
import ROOTS from '../../utils/roots'

class BottomBar extends PureComponent {
    constructor(props) {
        super(props)
    }

    handleProfilePress() {
        console.log('Profile pressed')
        if (this.props.componentId !== 'Profile')
            Navigation.setRoot(ROOTS.PROFILE)
    }

    handleAlbumsPress() {        
        console.log('Albums pressed')
        if (this.props.componentId !== 'Albums')
            Navigation.setRoot(ROOTS.ALBUMS)
    }

    async handleCameraPress() {
        console.log("Camera pressed");

        const res = await launchCamera(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxWidth: deviceWidth,
                maxHeight: deviceHeight
            }
        )

        if (res.assets) {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Upload',
                    passProps: {
                        image: res.assets[0]
                    }
                }
            })
        } else if (res.didCancel) {
            console.log('Taking photo canceled')
        } else {
            console.log(`Error ${res.errorCode} when taking photo: ${res.errorMessage}`)
        }
    }

    render() {

        return (
            <View style={styles.index}>
                <View style={styles.bar}>
                    <TouchableOpacity
                        onPress={this.handleProfilePress.bind(this)}
                        style={styles.button}
                    >
                        <ProfileSvg />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this.handleAlbumsPress.bind(this)}
                        style={styles.button}
                    >
                        <FolderSvg />
                    </TouchableOpacity>
                </View>          

                <TouchableHighlight 
                    onPress={this.handleCameraPress.bind(this)}
                    underlayColor={COLORS}
                    style={styles.photoButton}
                >
                    <CameraSvg />
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    index: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
        bottom: 0
    },
    bar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'flex-end',
        width: deviceWidth,
        height: deviceHeight * 0.16,
        maxHeight: 55,
        minHeight: 45,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.black,
        backgroundColor: COLORS.white
    },
    photoButton: {
        width: deviceWidth * 0.25,
        height: deviceWidth * 0.25,
        backgroundColor: COLORS.white,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: COLORS.black,
        backgroundColor: COLORS.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth * 0.15,
        height: deviceHeight * 0.05,
    }
})

BottomBar.propTypes = {
    style: PropTypes.object,
}

BottomBar.defaultProps = {
    style: {}
}

export default BottomBar
