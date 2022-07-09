import React, { PureComponent } from "react"
import PropTypes from 'prop-types'

import {
    COLORS, deviceWidth 
} from "../../utils/stylesConfig"
import AppText from "./AppText"
import { View } from "react-native"

class Tag extends PureComponent {
    
    render() {
        const { name, color } = this.props

        return (
            <View
                style={{
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: color,
                    borderRadius: 24,
                    borderWidth: 1,
                    marginHorizontal: 4,
                    borderColor: COLORS.white
                }}
            >
                <AppText
                    size={deviceWidth * 0.05}
                    weight='Bold'
                >
                    {name}
                </AppText>
            </View>
        )
    }
}

Tag.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string
}

Tag.defaultProps = {
    name: 'Tag',
    color: COLORS.turquoise
}

export default Tag