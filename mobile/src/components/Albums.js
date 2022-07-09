import React, { PureComponent } from 'react'
import { 
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../utils/stylesConfig'
import {
    updateModal,
    updateAlbums,
    updateImages
} from '../actions'
import AlbumsLayout from './layouts/Title'
import Album from './common/Album'
import AppText from './common/AppText'
import AppModal from './common/AppModal'
import { store } from '../store'
import PlusSvg from '../assets/images/plus.svg'
import { apiCall } from '../utils/apiCall'
import PictureElement from './common/PictureElement'

class Albums extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            albums: [],
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const resAlbum = await apiCall({
                method: 'GET',
                route: 'api/album'
            })

            const resultAlbum = await resAlbum.json()

            store.dispatch(updateAlbums([
                ...resultAlbum,
                {
                    id: 'shared',
                    name: 'Shared Pic',
                    description: 'Shared pictures from another user with you',
                    tags: [],
                    created_at: new Date(),
                    last_update: new Date(),
                    image_id: [1],
                    authorized_users: [],
                    isShared: true
                },
            ]))

            const resImages = await apiCall({
                method: 'GET',
                route: 'api/image'
            })

            const resultImages = await resImages.json()
            
            store.dispatch(updateImages(resultImages))
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    handleAlbumPress(selectedAlbum) {
        console.log('Album clicked:', selectedAlbum)

        Navigation.push(this.props.componentId, {
            component: {
                name: 'AlbumContent',
                passProps: {
                    ...selectedAlbum,
                    title: selectedAlbum.name,
                    type: selectedAlbum.name === 'Shared Pic' ? 'albumShared' : 'album',
                    isShared: selectedAlbum.name === 'Shared Pic' 
                }
            }
        })
    }

    handleLongAlbumPress(selectedAlbum) {
        console.log('Album Long clicked:', selectedAlbum.name)

        store.dispatch(updateModal(
            { 
                ...selectedAlbum, 
                title: selectedAlbum.name,
                type: selectedAlbum.name === 'Shared Pic' ? 'albumShared' : 'album',
                isShared: selectedAlbum.name === 'Shared Pic' 
            }
        ))
    }

    handleAlbumAddPress() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'AlbumAdd',
                passProps: {
                    title: 'Add Album'
                }
            }
        })
    }

    handleAlbums() {
        const { search, albums } = this.props

        return search ? albums.filter(album => album.name.indexOf(search)) : albums
    }

    handlePicturePress(item) {
        console.log('Picture clicked')
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Picture',
                passProps: {
                    ...item
                }
            }
        })
    }

    handleLongPicturePress(item) {
        console.log('Picture Long clicked')
        store.dispatch(updateModal(
            { 
                ...item, 
                type: 'image'
            }
        ))
    }
  
    render () {
        const { search, albums, unasignedImages } = this.props
        const { username } = store.getState().user
        const { loading } = this.state

        return (
            <AlbumsLayout
                title={'Albums'}
                componentId={this.props.componentId}
            >
                <AppModal />

                {loading ?
                    <ActivityIndicator
                        color={COLORS.turquoise}
                        size={'large'}
                    />
                :
                    <>
                        <View
                            style={styles.content}
                        >
                            <FlatList 
                                data={albums?.filter(album => album?.name?.indexOf(search) !== -1 )}
                                ListEmptyComponent={
                                    <View
                                        style={styles.NoAlbum}
                                    >
                                        <AppText
                                            size={deviceWidth * 0.05}
                                            weight={'Bold'}
                                            style={{
                                                textAlign: 'center',
                                                opacity: search ? 1 : 0.5
                                            }}
                                        >
                                            {search ? `No album available for :\n\n${search}` : "No album available"}
                                        </AppText>
                                    </View>
                                }
                                contentContainerStyle={{
                                    alignSelf: albums.length > 2 ? 'center' : 'flex-start'
                                }}
                                numColumns={3}
                                renderItem={({ item: { id, name, authorized_users, description, isShared, image_id} }) => 
                                    <Album
                                        key={id}
                                        title={name}
                                        size={image_id?.length}
                                        onPress={this.handleAlbumPress.bind(this, { name, id, description, isShared })}
                                        onLongPress={this.handleLongAlbumPress.bind(this, { name, id, description, isShared })}
                                        authorized_users={authorized_users}
                                        connectedUsername={username}
                                    />
                                }
                            />
                        </View>

                        <View style={styles.separator} />

                        <View
                            style={styles.content}
                        >
                            <FlatList 
                                data={unasignedImages}
                                contentContainerStyle={{
                                    alignSelf: unasignedImages.length > 2 ? 'center' : 'flex-start',
                                    maxHeight: deviceHeight * 0.5,
                                    overflow: 'scroll'
                                }}
                                numColumns={3}
                                ListEmptyComponent={() => {
                                    return (
                                        <View
                                            style={styles.NoAlbum}
                                        >
                                            <AppText
                                                size={deviceWidth * 0.04}
                                                weight={'Italic'}
                                                style={{
                                                    textAlign: 'center',
                                                    opacity: 0.5
                                                }}
                                            >
                                                Unasigned pictures are displayed here. You can add them to an album by going into an album, or when you're uploading a brand new picture !
                                            </AppText>
                                        </View>
                                    )
                                }}
                                renderItem={({ item }) =>
                                    <PictureElement
                                        onPress={this.handlePicturePress.bind(this, {
                                            ...item
                                        })}
                                        onLongPress={this.handleLongPicturePress.bind(this, {
                                            ...item
                                        })}
                                        data={item.data}
                                    />
                                }
                            />
                        </View>

                        <TouchableOpacity
                            onPress={this.handleAlbumAddPress.bind(this)}
                            onLongPress={this.handleAlbumAddPress.bind(this)}
                            style={styles.addAlbum}
                        >
                            <PlusSvg />
                        </TouchableOpacity>
                    </>
                }
            </AlbumsLayout>
        )
    }  
}

const mapStatesToProps = ({ search, albums, images }) => {
    return { search, albums, unasignedImages: images.filter(image => !image?.album_id?.length) }
}

const styles = StyleSheet.create({
    content: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    separator: {
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 12,
        width: deviceWidth * 0.9,
        alignSelf: 'center'
    },
    NoAlbum: {
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        alignSelf: 'center',
    },
    addAlbum: {
        position: 'absolute',
        right: deviceWidth * 0.05,
        bottom: deviceHeight * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 46,
        width: deviceWidth * 0.2,
        height: deviceWidth * 0.2,
        borderWidth: 2,
        borderColor: COLORS.turquoise,
    }
})

export default connect(mapStatesToProps, { updateModal, updateAlbums, updateImages })(Albums)