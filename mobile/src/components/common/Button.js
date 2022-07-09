import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import AppText from './AppText'
import { COLORS } from '../../utils/stylesConfig'

class AppButton extends PureComponent {

    render() {
        const { style, onPress, title, cancel, disabled } = this.props
        let defaultStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            minHeight: 50,
            padding: 5,
            paddingHorizontal: 30,
            elevation: 8,
            borderRadius: 20,
            backgroundColor: disabled ? COLORS.gray : COLORS.turquoise
        }

        if (cancel)
            defaultStyle = {
                ...defaultStyle,
                backgroundColor: COLORS.black,
                borderWidth: 1,
                borderColor: COLORS["turquoise-light"],
            }

        return (
            <TouchableOpacity 
                style={{
                    ...defaultStyle,
                    ...style
                }}
                onPress={onPress}
                disabled={disabled}
            >
                <AppText
                    size={20}
                    weight="Bold"
                    onPress={disabled ? null : onPress}
                    style={cancel ? { color: COLORS.turquoise } : {}}
                >
                    {title}
                </AppText>
            </TouchableOpacity>
        )
    }
}

AppButton.propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
    title: PropTypes.string,
    disabled: PropTypes.bool
}

AppButton.defaultProps = {
    style: {},
    onPress: () => {},
    title: 'Button',
    disabled: false
}

export default AppButton
