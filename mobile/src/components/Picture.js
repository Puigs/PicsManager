import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Navigation } from 'react-native-navigation'

import { 
    COLORS,
    deviceHeight,
    deviceWidth
} from '../utils/stylesConfig'
import SettingsSvg from '../assets/images/settings.svg'
import AppText from './common/AppText'

class Picture extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            orientation: deviceHeight > deviceWidth ? 
                'vertical'
                : 'horizontal',
            height: deviceHeight,
            width: deviceWidth,
            error: false
        }
    }

    handleSettingsPressed(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'PictureDesc',
                passProps: {
                    ...item,
                    title: item.name
                }
            }
        })
    }

    componentWillUnmount() {
        //TODO: rotate Vertical
    }

    render() {
        const { name, uri, description, tags, createdAt, username, id, data, owner, authorized_user } = this.props
        const { height, width, error } = this.state

        Dimensions.addEventListener('change', ({ window: { width, height }}) => {
            if (height > width) {
                console.log('vertical')
                this.setState({ 
                    orientation: 'vertical',
                    width: width,
                    height: height,
                })
            } else {
                console.log('horizontal')
                this.setState({ 
                    orientation: 'horizontal',
                    width: width,
                    height: height
                })
            }
        })

        return (
            <View
                style={[
                    {...styles.pic},
                    error ? { height: deviceHeight} : {}
                ]}
            >
                <TouchableOpacity
                    style={styles.settings}
                    onPress={this.handleSettingsPressed.bind(this, {
                        name,
                        uri,
                        description,
                        tags,
                        createdAt,
                        username,
                        id,
                        data,
                        authorized_user,
                        owner
                    })}
                >
                    <SettingsSvg />
                </TouchableOpacity>

                {!error ? <ImageZoom
                    cropWidth={width}
                    cropHeight={height}
                    imageWidth={width}
                    imageHeight={height}
                    useNativeDriver={true}
                >
                    <Image 
                        source={{
                            uri: `data:image/jpeg;base64,${data}`,
                            height,
                            width,
                        }}
                        resizeMode='contain'
                        onError={({ nativeEvent: {error} }) => {
                            this.setState({ error: true })
                            console.log('Erreur:', error)
                        }}
                    />
                </ImageZoom>
                : 
                    <AppText>
                        Une erreur est survenue
                    </AppText>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    pic: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black
    },
    settings: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        zIndex: 1,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.turquoise,
        borderRadius: 46,
        top: 16,
        right: 16
    }
})

Picture.propTypes = {
    name: PropTypes.string,
    uri: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    date: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.number
}

Picture.defaultProps = {
    name: 'Photo',
    uri: '',
    description: 'No description provided',
    tags: [],
    date: '',
    username: ''
}

export default Picture
