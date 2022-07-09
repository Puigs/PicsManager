import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
    COLORS,
    deviceWidth
} from '../../utils/stylesConfig'
import { updateSearch } from '../../actions'
import LoupeSvg from '../../assets/images/loupe.svg'
import CroixSvg from '../../assets/images/croix.svg'
import AppTextInput from './AppTextInput'
import { store } from '../../store'

class SearchButton extends PureComponent {
    constructor(props) {
        super(props)
    }

    componentWillUnmount() {
        store.dispatch(updateSearch(''))
    }

    componentDidMount() {
        store.dispatch(updateSearch(''))
    }

    render() {
        const { style, onPress, active, icon, value, onValueChange, searchFocus, search } = this.props
        let defaultStyle = {
            height: 70,
            width: 70,
            padding: 6,
            borderRadius: 99,
            borderWidth: 2,
            borderColor: COLORS.turquoise,
            backgroundColor: COLORS['blue-light'],
            alignItems: 'center',
            justifyContent: 'center'
        }

        return (
            <>
                {active &&
                    <AppTextInput
                        style={{
                            width: deviceWidth * 0.6,
                        }}
                        value={search}
                        onChangeText={v => store.dispatch(updateSearch(v))}
                        placeholder={'Entrez votre filtre...'}
                        autofocus={searchFocus}
                    />
                }

                <TouchableOpacity
                    style={{
                        ...defaultStyle,
                        ...style
                    }}
                    onPress={onPress}
                    activeOpacity={0.8}
                >
                    {active ? <CroixSvg /> : icon }
                </TouchableOpacity>
            </>
        )
    }
}

const mapStatesToProps = ({ search }) => {
    return { search }
}

SearchButton.propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
    icon: PropTypes.element
}

SearchButton.defaultProps = {
    style: {},
    onPress: () => {},
    icon: <LoupeSvg />
}

export default connect(mapStatesToProps, { updateSearch })(SearchButton)
