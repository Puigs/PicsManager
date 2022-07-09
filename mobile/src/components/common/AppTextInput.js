import React, { PureComponent } from 'react'
import { TextInput } from 'react-native'
import PropTypes from 'prop-types'

import { COLORS, deviceHeight } from '../../utils/stylesConfig'
import AppText from './AppText'

class AppTextInput extends PureComponent {

    render() {
        const { style, onChangeText, value, secureTextEntry, placeholder, autofocus, label, multiline, numberOfLines, keyboardType } = this.props
        const defaultStyle = {
            display: 'flex',
            textAlignVertical: numberOfLines > 1 ? 'top' : 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: numberOfLines > 1 ?
                (deviceHeight * 0.06) * numberOfLines
                : 50 * numberOfLines,
            borderWidth: 2,
            borderColor: COLORS.turquoise,
            borderRadius: 20,
            color: COLORS['black-blue'],
            backgroundColor: COLORS['blue-light'],
            padding: 12,
            fontFamily: 'Aleo-Regular',
            fontSize: 16
        }

        return (
            <>
                {label &&
                    <AppText
                        size={12}
                        style={
                            { alignSelf: "flex-start", marginLeft: 20, color: COLORS.turquoise }
                        }
                    >
                        {label}
                    </AppText>
                }

                <TextInput 
                    style={{
                        ...defaultStyle,
                        ...style
                    }}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    value={value}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray}
                    autoFocus={autofocus}
                />
            </>
        )
    }
}

AppTextInput.propTypes = {
    style: PropTypes.object,
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    placeholder: PropTypes.string,
    autofocus: PropTypes.bool,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    label: PropTypes.string,
    keyboardType: PropTypes.string
}

AppTextInput.defaultProps = {
    style: {},
    onChangeText: () => {},
    value: '',
    multiline: false,
    numberOfLines: 1,
    secureTextEntry: false,
    placeholder: 'Entrez un texte...',
    autofocus: false,
    label: null,
    keyboardType: 'default'
}

export default AppTextInput
