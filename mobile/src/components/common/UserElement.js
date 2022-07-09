import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import ProfileSvg from '../../assets/images/profile.svg'
import AppText from './AppText'
import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../../utils/stylesConfig'
import CroixSvg from '../../assets/images/croix.svg'
import Svg from 'react-native-svg'

class UserElement extends PureComponent {

    render() {
        const { onPress, onDeletePress, deletable, username, selectedUsername } = this.props
        
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[
                    {...styles.item},
                    selectedUsername === username ? {...styles.selected} : {}
                ]}
            >
                <ProfileSvg />

                <AppText
                    size={deviceWidth * 0.05}
                    weight={'Bold'}
                    style={{ color: COLORS.turquoise, textAlign: 'center' }}
                >
                    {username}
                </AppText>

                {deletable &&
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={onDeletePress}
                    >
                        <Svg
                            width={20}
                            height={20}
                            preserveAspectRatio="xMinYMin slice"
                            viewBox={`0 0 ${deviceWidth * 0.12} ${deviceWidth * 0.12}`}
                            style={{
                                padding: 12
                            }}
                        >
                            <CroixSvg />
                        </Svg>
                    </TouchableOpacity>
                }
        </TouchableOpacity>
    )
    }
}

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.gray,
        padding: 16,
        marginVertical: 4,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: COLORS.gray
    },
    selected: {
        borderColor: COLORS.turquoise
    }
})

UserElement.propTypes = {
    onPress: PropTypes.func,
    onDeletePress: PropTypes.func,
    deletable: PropTypes.bool,
    username: PropTypes.string
}

UserElement.defaultProps = {
    onPress: () => {},
    onDeletePress: () => {},
    deletable: false,
    username: ''
}

export default UserElement