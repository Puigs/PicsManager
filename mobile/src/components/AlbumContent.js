import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import { connect } from 'react-redux'
import { launchCamera } from 'react-native-image-picker'

import AlbumsLayout from './layouts/Title'
import { Navigation } from 'react-native-navigation'
import AppText from './common/AppText'
import {
    deviceHeight,
    deviceWidth
} from '../utils/stylesConfig'
import PictureElement from './common/PictureElement'
import { COLORS } from '../utils/stylesConfig'
import { apiCall } from '../utils/apiCall'
import AppModal from './common/AppModal'
import { updateModal } from '../actions'
import PlusSvg from '../assets/images/plus.svg'
import ShareSvg from '../assets/images/share.svg'
import { store } from '../store'

class AlbumContent extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            albumImages: [],
            loading: true
        }
    }

    async componentDidMount() {
        const { id, type } = this.props

        try {
            const resImagesIds = await apiCall({
                method: 'GET',
                route: type === 'albumShared' ? 'api/image/shared' : `api/album/${id}/images`
            })

            if (resImagesIds.status === 200) {
                const resultImagesIds = await resImagesIds.json()

                this.setState({
                    albumImages: resultImagesIds,
                    loading: false
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            const { loading } = this.state
            if (loading) {
                this.setState({
                    loading: false
                })
            }
        }
    }

    goBackToAlbums() {
        Navigation.pop(this.props.componentId)
    }

    handlePicturePress(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Picture',
                passProps: {
                    ...item
                }
            }
        })
    }

    handleLongAlbumPress(item) {
        console.log('Picture Long clicked')
        store.dispatch(updateModal(
            { 
                ...item, 
                type: 'image'
            }
        ))
    }

    async handleAddPress(item) {
        console.log("Camera pressed with album id", item.id);

        const res = await launchCamera(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxWidth: deviceWidth,
                maxHeight: deviceHeight
            }
        )

        if (res.assets) {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Upload',
                    passProps: {
                        image: res.assets[0],
                        selectedAlbum: item.id
                    }
                }
            })
        } else if (res.didCancel) {
            console.log('Taking photo canceled')
        } else {
            console.log(`Error ${res.errorCode} when taking photo: ${res.errorMessage}`)
        }
    }

    handleSharePress() {
        const { id } = this.props

        Navigation.push(this.props.componentId, {
            component: {
                name: 'Share',
                passProps: {
                    id,
                    isAlbum: true
                }
            }
        })
    }
 
    render() {
        const { title, description, search, id, type } = this.props
        const { albumImages, loading } = this.state

        return (
            <AlbumsLayout
                bottomBar={false}
                searchButton={false}
                title={title}
            >
                <AppModal />

                <View
                    style={styles.desc}
                >
                    <AppText
                        size={16}
                    >
                        {description}
                    </AppText>
                </View>

                {loading ?
                    <ActivityIndicator
                        color={COLORS.turquoise}
                        size={'large'}
                    />
                :
                    <FlatList
                        data={albumImages}
                        style={styles.picList}
                        ListEmptyComponent={
                            <View
                                style={styles.NoPicture}
                            >
                                <AppText
                                    size={deviceWidth * 0.05}
                                    weight={'Bold'}
                                    style={{
                                        textAlign: 'center'
                                    }}
                                >
                                    {search ? `No picture available for :\n\n${search}` : "No picture available"}
                                </AppText>
                            </View>
                        }
                        contentContainerStyle={{
                            alignSelf: 'center'
                        }}
                        numColumns={3}
                        renderItem={({item, index}) =>
                            <PictureElement
                                onPress={this.handlePicturePress.bind(this, item)}
                                onLongPress={this.handleLongAlbumPress.bind(this, {
                                    ...item,
                                })}
                                key={index}
                                data={item.data}
                            />
                        }
                    />
                }


                {type !== 'albumShared' &&
                    <>
                        <TouchableOpacity
                            onPress={this.handleAddPress.bind(this, {
                                id
                            })}
                            onLongPress={this.handleAddPress.bind(this, {
                                id
                            })}
                            style={styles.addButton}
                        >
                            <PlusSvg />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.handleSharePress.bind(this, {
                                id,
                            })}
                            onLongPress={this.handleSharePress.bind(this, {
                                id,
                            })}
                            style={styles.shareButton}
                        >
                            <ShareSvg />
                        </TouchableOpacity>
                    </>
                }
            </AlbumsLayout>
        )
    }
}

const mapStatesToProps = ({ search }) => {
    return { search }
}

const styles = StyleSheet.create({
    desc: {
        alignSelf: 'center',
        width: deviceWidth * 0.9,
        paddingHorizontal: 12,
    },
    NoPicture: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: deviceWidth,
        height: deviceHeight * 0.8
    },
    picList: {
        flexGrow: 0,
        paddingVertical: 12,
        maxHeight: deviceHeight * 0.84,
        overflow: 'scroll',
    },
    addButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: deviceWidth * 0.30,
        bottom: deviceHeight * 0.04,
        backgroundColor: COLORS.white,
        borderRadius: 46,
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: COLORS.turquoise,
    },
    shareButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 8,
        right: deviceWidth * 0.05,
        bottom: deviceHeight * 0.04,
        backgroundColor: COLORS.white,
        borderRadius: 46,
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: COLORS.turquoise,
    },
})

AlbumContent.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
}

AlbumContent.defaultProps = {
    title: 'My Album',
    description: 'Aucune description'
}

export default connect(mapStatesToProps, {})(AlbumContent)
