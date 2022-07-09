import React, { PureComponent } from "react"
import { View, StyleSheet, Image } from "react-native"
import PropTypes from 'prop-types'

import { 
    deviceHeight, 
    deviceWidth,
    COLORS
} from '../../utils/stylesConfig'
import EllipseSvg from '../../assets/images/ellipses.svg'

class Layout extends PureComponent {
    constructor(props) {
        super(props)
    }

    render () {
        const { children, ellipses } = this.props

        return (
            <View
                style={styles.layoutBackground}
            >
                {ellipses &&
                    <View
                        style={styles.ellipses}
                    >
                        <EllipseSvg />
                    </View>
                }

                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ellipses: {
        position: 'absolute',
        top: - deviceHeight * 0.11,
        left: - deviceWidth * 0.27
    },
    layoutBackground: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: deviceWidth,
        minHeight: deviceHeight,
        backgroundColor: COLORS["black"],
        padding: 12,
        alignItems: 'center'
    }
})

Layout.propTypes = {
    ellipses: PropTypes.bool
}

Layout.defaultProps = {
    ellipses: true
}

export default Layout
