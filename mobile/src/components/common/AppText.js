import React, { PureComponent } from 'react'
import { Pressable, Text } from 'react-native'
import PropTypes from 'prop-types'

class AppText extends PureComponent {
    getStyle() {
        const { weight, color, size, style } = this.props

        return {
            fontFamily: `Aleo-${weight}`,
            fontSize: size,
            color,
            ...style
        }
    }

    render() {
        const { children, onPress } = this.props

        return (
            <Pressable
                onPress={onPress}
            >
                <Text style={this.getStyle()}>{children}</Text>
            </Pressable>
        )
    }
}

AppText.propTypes = {
    weight: PropTypes.oneOf(['Regular', 'Light', 'LightItalic', 'Italic', 'Bold', 'BoldItalic']),
    italic: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    style: PropTypes.object,
    onPress: PropTypes.func
}

AppText.defaultProps = {
    weight: 'Regular',
    color: 'white',
    size: 24,
    onPress: () => {},
    style: {}
}

export default AppText
