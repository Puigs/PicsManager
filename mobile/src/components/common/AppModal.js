import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'

import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../../utils/stylesConfig'
import { updateAlbums, updateImages, updateModal } from '../../actions'
import CroixSvg from '../../assets/images/croix.svg'
import AppText from './AppText'
import { store } from '../../store'
import AppButton from './Button'
import { apiCall } from '../../utils/apiCall'

class AppModal extends PureComponent {

    handleCrossPress() {
        store.dispatch(updateModal({}))
    }

    async handleDeletePress(type) {
        const { id, name } = this.props.modalContent

        apiCall({
            method: 'DELETE',
            route: `api/${type}/${id}`
        }).then(() => {
            switch (type) {
                case 'album':
                    store.dispatch(updateAlbums(store.getState()
                        .albums.filter(album => album.id !== id)))
                    break;
                case 'image':
                    store.dispatch(updateImages(store.getState()
                        .images.filter(image => image.id !== id)))
                    break;
            
                default:
                    break;
            }

            Toast.show(`${type.toUpperCase()} ${name} deleted`)
            store.dispatch(updateModal({}))
        })
    }

    render() {
        const { style, modalContent } = this.props
        const disabled = modalContent.type === 'albumShared'

        if (Object.keys(modalContent).length) return (
            <View
                style={styles.background}
            >
                <View
                    style={{
                        ...styles.defaultStyle,
                        ...style
                    }}
                >
                    <AppText
                        weight={'Bold'}
                        style={{
                            color: COLORS.black,
                            marginBottom: 24
                        }}
                    >
                        {modalContent.name || modalContent.title}
                    </AppText>

                    <AppText
                        weight={'Italic'}
                        style={{
                            color: COLORS.black,
                        }}
                        size={deviceWidth * 0.05}
                    >
                        {modalContent.description}
                    </AppText>

                    <AppButton 
                        title='Delete'
                        style={{ backgroundColor: disabled ?
                            COLORS.gray
                            : COLORS.red 
                        }}
                        onPress={this.handleDeletePress.bind(this, modalContent.type)}
                        disabled={disabled}
                    />

                    <TouchableOpacity
                        onPress={this.handleCrossPress.bind(this)}
                        style={styles.cross}
                    >
                        <CroixSvg />
                    </TouchableOpacity>
                </View>
            </View>
        )

        return null
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 99,
        padding: 12,
        width: deviceWidth * 0.8,
        height: deviceHeight * 0.5,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.turquoise
    },
    cross: {
        position: 'absolute',
        right: 12,
        top: 12
    }
})

AppModal.propTypes = {
    style: PropTypes.object,
    modalContent: PropTypes.object
}

AppModal.defaultProps = {
    style: {},
    modalContent: {}
}

const mapStatesToProps = ({ modal }) => {
    return { modalContent: modal }
}

export default connect(mapStatesToProps, { updateModal })(AppModal)
