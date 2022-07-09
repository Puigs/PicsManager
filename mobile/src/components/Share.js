import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { 
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
} from 'react-native'
import Toast from 'react-native-simple-toast'
import { Navigation } from 'react-native-navigation'

import { apiCall } from '../utils/apiCall'
import AppText from './common/AppText'
import TitleLayout from './layouts/Title'
import AppTextInput from './common/AppTextInput'
import AppButton from './common/Button'
import {
    deviceWidth,
    deviceHeight,
    COLORS
} from '../utils/stylesConfig'
import { store } from '../store'
import UserElement from './common/UserElement'

class Share extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            query: '',
            disabled: false,
            users: [],
            selectedUsername: '',
            myUsername: store.getState().user.username,
        }
    }

    async handleAlbumShare() {
        const { id } = this.props
        const { selectedUsername } = this.state

        this.setState({
            loading: true
        })

        try {
            const res = await apiCall({
                method: 'PUT',
                route: `api/album/${id}/add/${selectedUsername}`,
            })

            if (res.status === 200) {
                Toast.show('Album shared successfully')
                Navigation.pop(this.props.componentId)
            } else {
                Toast.show('Error while sharing album')
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    async handleShare() {
        const { id } = this.props
        const { selectedUsername, myUsername } = this.state

        if (selectedUsername === myUsername) {
            Toast.show('You can\'t share it with yourself!')

            return
        }

        this.setState({
            disabled: true
        })

        try {
            const res = await apiCall({
                method: 'PUT',
                route: `api/image/${id}/authorize/add/${selectedUsername}`,
            })

            if (res.status === 200) {
                Navigation.pop(this.props.componentId)
                    .then(() => Toast.show('Image shared successfully'))
            } else {
                Toast.show('Error while sharing image')
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({
                loading: false,
                query: '',
                disabled: false
            })
        }
    }

    async handleQueryChanged(q) {
        const { myUsername } = this.state

        this.setState({
            query: q,
            loading: q ? true : false
        })

        if (q) {
            try {
                const res = await apiCall({
                    method: 'GET',
                    route: `api/user/search/${q}`,
                })
    
                if (res.status === 200) {
                    const result = await res.json()
    
                    this.setState({
                        users: result.filter(u => u.username !== myUsername),
                        loading: false
                    })
                }
            } catch (error) {
                console.log(error)
            } finally {
                const { loading } = this.state
    
                if (loading)
                    this.setState({
                        loading: false
                    })
            }
        }
    }

    async handleRemoveAccess(username) {
        const { id } = this.props

        this.setState({
            disabled: true
        })

        try {
            const res = await apiCall({
                method: 'PUT',
                route: `api/image/${id}/authorize/remove/${username}`,
            })

            if (res.status === 200) {
                Toast.show('User access removed successfully')
            } else {
                Toast.show('Error while removing access')
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({
                loading: false,
                query: '',
                disabled: false
            })
        }
    }

    render() {
        const { query, loading, disabled, users, selectedUsername } = this.state
        const { type, authorized_user, isAlbum } = this.props

        return (
            <TitleLayout
                title='Share'
                searchButton={false}
                bottomBar={false}
            >
                <View
                    style={styles.container}
                >
                    {authorized_user.length > 0 &&
                        <>
                            <AppText
                                size={deviceWidth * 0.05}
                            >
                                Who can see this picture ?
                            </AppText>
                            <FlatList 
                                data={authorized_user}
                                style={styles.list}
                                renderItem={({ item }) => 
                                    <UserElement
                                        username={item}
                                        onDeletePress={this.handleRemoveAccess.bind(this, item)}
                                        deletable={true}
                                    />
                                }
                            />
                        </>
                    }

                    <AppTextInput
                        label="Search for a user"
                        placeholder="Please enter username..."
                        value={query}
                        onChangeText={(q) => this.handleQueryChanged(q)}
                        style={styles.searchButton}
                    />

                    {loading ?
                        <ActivityIndicator 
                            size="large"
                            color={COLORS.turquoise}
                            style={{
                                padding: 12
                            }}
                        />    
                    :
                        <FlatList 
                            data={query ? users.filter(user => !authorized_user.find(u => u === user.username)) : []}
                            style={styles.list}
                            ListEmptyComponent={() => query ?
                                <View
                                    style={styles.NoAlbum}
                                >
                                    <AppText
                                        size={deviceWidth * 0.05}
                                        weight={'Bold'}
                                        style={{
                                            textAlign: 'center',
                                            opacity: query ? 1 : 0.5
                                        }}
                                    >
                                        {`No user found for :\n\n${query}`}
                                    </AppText>
                                </View>
                                : null
                            }
                            keyExtractor={(item) => item.username}
                            renderItem={({ item }) => 
                                <UserElement 
                                    username={item.username}
                                    selectedUsername={selectedUsername}
                                    onPress={() => this.setState({
                                        selectedUsername: selectedUsername === item.username ? '' : item.username
                                    })}
                                />
                            }
                        />
                    }
                </View>

                <View
                    style={styles.buttons}
                >
                    <AppButton 
                        title='Cancel'
                        cancel={true}
                        onPress={() => Navigation.pop(this.props.componentId)}
                        disabled={disabled}
                    />

                    <AppButton 
                        title='Add'
                        onPress={isAlbum ? 
                            this.handleAlbumShare.bind(this)
                            : this.handleShare.bind(this)
                        }
                        disabled={disabled || !query || !selectedUsername}
                    />
                </View>
            </TitleLayout>
        )
    }
}

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: deviceWidth,
        padding: 12,
        bottom: 0
    },
    searchButton: {
        paddingVertical: 12
    },
    list: {
        alignSelf: 'center',
        width: deviceWidth * 0.95,
        overflow: 'scroll',
        marginVertical: 8
    },
    container: {
        padding: 12,
    }
})

Share.propTypes = {
    name: PropTypes.string,
    uri: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    date: PropTypes.string,
    username: PropTypes.string,
    isAlbum: PropTypes.bool,
    authorized_user: PropTypes.array,
}

Share.defaultProps = {
    name: 'Photo',
    uri: '',
    description: 'No description provided',
    tags: [],
    date: '',
    username: '',
    isAlbum: false,
    authorized_user: []
}

export default Share
