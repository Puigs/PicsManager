import React, { PureComponent } from 'react'
import { 
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import {
    COLORS,
    deviceWidth
} from '../../utils/stylesConfig'
import AlbumsLayout from '../layouts/Title'
import Album from '../common/Album'
import AppText from '../common/AppText'

class Albums extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            albums: [],
            loading: false
        }
    }

    componentDidMount() {
        //TODO: Appel API au back pour récupérer les albums d'un User avec un ID
        this.setState({ albums: [
            {
                id: 1,
                name: 'Vacances',
                description: 'Vacances de mon superbe été 2022',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: [
                    {
                        id: 1,
                        name: 'Brayan'
                    }
                ]
            },
            {
                id: 2,
                name: 'Ecole',
                description: 'Etudes 2022',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: []
            },
            {
                id: 3,
                name: 'Cevennes',
                description: 'Beauté des Cévennes',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: []
            },
            {
                id: 4,
                name: 'Pas d\'inspi',
                description: 'J\'ai vraiment pas d\'inspiration pour des descriptions',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: []
            },
            {
                id: 5,
                name: 'Cevennes',
                description: 'Beauté des Cévennes',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: []
            },
            {
                id: 6,
                name: 'Pas d\'inspi',
                description: 'J\'ai vraiment pas d\'inspiration pour des descriptions',
                created_at: new Date(),
                last_update: new Date(),
                authorized_users: []
            },
        ]})
    }

    handleAlbumPress(album) {
        console.log('Album clicked:', album.name)
        Navigation.push(this.props.componentId, {
            component: {
                name: 'AlbumContent',
                passProps: {
                    title: album.name,
                    description: album.description
                }
            }
        })
    }

    handleAlbums() {
        const { albums } = this.state
        const { search } = this.props

        return search ? albums.filter(album => album.name.indexOf(search)) : albums
    }
  
    render () {
        const { loading, albums } = this.state
        const { search } = this.props

        return (
            <AlbumsLayout
                title={'Albums'}
                componentId={this.props.componentId}
            >
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
                                data={albums.filter(album => album.name.indexOf(search) !== -1 )}
                                ListEmptyComponent={
                                    <View
                                        style={styles.NoAlbum}
                                    >
                                        <AppText
                                            size={deviceWidth * 0.05}
                                            weight={'Bold'}
                                            style={{
                                                textAlign: 'center'
                                            }}
                                        >
                                            {search ? `No album available for :\n\n${search}` : "No album available"}
                                        </AppText>
                                    </View>
                                }
                                contentContainerStyle={{
                                    alignSelf: 'center'
                                }}
                                numColumns={3}
                                renderItem={({ item: { id, name, authorized_users, description} }) => 
                                    <Album
                                        key={id}
                                        title={name}
                                        onPress={this.handleAlbumPress.bind(this, { name, id, description })}
                                        authorized_users={authorized_users.length > 0}
                                    />
                                }
                            />
                        </View>

                        <View style={styles.separator} />
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
    content: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12
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
    }
})

export default connect(mapStatesToProps, {})(Albums)