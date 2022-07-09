import React, { PureComponent } from 'react'
import {
    Image,
    TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { COLORS, deviceWidth } from '../../utils/stylesConfig'

class PictureElement extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            error: false
        }
    }

    render() {
        const { onPress, onLongPress, data } = this.props

        return (
            <TouchableOpacity
                style={{
                    width: deviceWidth / 4,
                    height: deviceWidth / 4,
                    borderWidth: 1,
                    borderColor: COLORS.turquoise,
                    borderRadius: 12,
                    margin: 2,
                }}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <Image
                    resizeMode='cover'
                    source={{
                        uri: `data:image/jpeg;base64,${data}`,
                        height: '100%',
                        width: '100%'
                    }}
                    style={{
                        borderRadius: 12,
                    }}
                    onError={({ nativeEvent: {error} }) => {
                        this.setState({ error: true })
                        console.log('Erreur:', error)
                    }}
                />
            </TouchableOpacity>
        )
    }
}

PictureElement.propTypes = {
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    uri: PropTypes.string
}

PictureElement.defaultProps = {
    onPress: () => {},
    onLongPress: () => {},
    uri: ''
}

export default PictureElement
