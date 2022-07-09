import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import RNPickerSelect from 'react-native-picker-select'
import { StyleSheet } from 'react-native'

import { COLORS } from '../../utils/stylesConfig'
import AppText from './AppText'

class CustomSelect extends PureComponent {

    render() {
        const { onValueChange, value, label, style, selectionValues, disabled } = this.props

        return (
            <>
                <AppText
                    size={12}
                    style={{
                        alignSelf: "flex-start",
                        marginLeft: 20,
                        marginTop: 8,
                        color: disabled ? COLORS.gray : COLORS.turquoise,
                    }}
                >
                    {label || 'Selector'}
                </AppText>

                <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    value={value}
                    onValueChange={onValueChange}
                    items={selectionValues.map(item => { return { label: item.name, value: item.id } })}
                    style={{
                        ...pickerSelectStyles,
                        inputAndroid: {
                            ...pickerSelectStyles.inputAndroid,
                            ...style,
                            borderColor: disabled ? COLORS.gray : COLORS.turquoise,
                            opacity: disabled ? 0.8 : 1
                        }
                    }}
                    disabled={disabled}
                />
            </>
        )
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        color: COLORS['black-blue'],
        backgroundColor: COLORS['blue-light'],
        fontFamily: 'Aleo-Regular',
        fontSize: 16,
        borderRadius: 20,
        borderWidth: 2,
        height: 50,
        padding: 12,
        borderColor: COLORS.turquoise,
        marginBottom: 8
    },
    placeholder: {
        color: COLORS.gray,
        fontFamily: 'Aleo-Regular'
    }
})

CustomSelect.propTypes = {
    selectedValue: PropTypes.string,
    onValueChange: PropTypes.func,
    label: PropTypes.string,
    style: PropTypes.object,
    albums: PropTypes.array,
    disabled: PropTypes.bool
}

CustomSelect.defaultProps = {
    selectedValue: '',
    onValueChange: () => {},
    label: '',
    style: {},
    albums: [],
    disabled: false
}

export default CustomSelect
