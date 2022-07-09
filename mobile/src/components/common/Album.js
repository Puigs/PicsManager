import React, { PureComponent } from 'react'
import {
    Pressable, TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import AppText from './AppText'
import AlbumSvg from '../../assets/images/album.svg'
import AlbumEmptySvg from '../../assets/images/albumEmpty.svg'
import AlbumSharedSvg from '../../assets/images/albumShared.svg'
import AlbumEmptySharedSvg from '../../assets/images/albumEmptyShared.svg'

class Album extends PureComponent {
    getPicture() {
        const { title, size } = this.props
        let path = 'album'

        if (!size)
            path += 'Empty'

        if (title === 'Shared Pic')
            path += 'Shared'

        switch (path) {
            case 'album':
                return <AlbumSvg />
            case 'albumEmpty':
                return <AlbumEmptySvg />
            case 'albumShared':
                return <AlbumSharedSvg />
            case 'albumEmptyShared':
                return <AlbumEmptySharedSvg />
        
            default:
                return <AlbumSvg />
        }
    }

    render() {
        const { onPress, onLongPress, title } = this.props

        return (
            <TouchableOpacity
                style={{ alignItems: 'center', padding: 8 }}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={500}
            >
                <AppText
                    size={16}
                >
                    {title}
                </AppText>

                {this.getPicture()}
            </TouchableOpacity>
        )
    }
}

Album.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    authorized_users: PropTypes.array,
    connectedUsername: PropTypes.string
}

Album.defaultProps = {
    title: '',
    onPress: () => {},
    onLongPress: () => {},
    authorized_users: [],
}

export default Album
