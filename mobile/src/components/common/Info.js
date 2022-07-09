import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import AppText from './AppText'
import { deviceWidth } from '../../utils/stylesConfig'

class Info extends PureComponent {

    render() {
        const { title, subTitle, size } = this.props

        return (
            <View
                style={{
                    display: 'flex',
                    alignSelf: 'flex-start'
                }}
            >
                <AppText
                    weight='Bold'
                    size={size}
                >
                    {title}
                </AppText>

                <AppText
                    size={size * 0.6}
                >
                    {subTitle}
                </AppText>
            </View>
        )
    }
}

Info.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    size: PropTypes.number,
}

Info.defaultProps = {
    title: 'Title',
    subTitle: 'SubTitle',
    size: deviceWidth * 0.06
}

export default Info
