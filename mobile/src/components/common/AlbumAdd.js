import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Toast from 'react-native-simple-toast'

import { apiCall } from '../../utils/apiCall'
import {
    deviceHeight,
    deviceWidth
} from '../../utils/stylesConfig'
import { addAlbum } from '../../actions'
import TitleLayout from '../layouts/Title'
import AppTextInput from './AppTextInput'
import AppButton from './Button'
import { store } from '../../store'

class AlbumAdd extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            description: '',
            disabled: false
        }
    }

    async handleAddAlbum() {
        const { name, description } = this.state

        if (name && description) {
            apiCall({
                method: 'POST',
                route: 'api/album/create',
                body: JSON.stringify({
                    name,
                    description,
                    tags: [],
                    authorized_user: [],
                    image_id: []
                })
            }).then(async res => {
                if (res.status === 200) {
                    const album = await res.json()

                    store.dispatch(addAlbum({
                        id: album.id,
                        name,
                        description,
                        tags: [],
                        authorized_users: []    
                    }))

                    Navigation.pop(this.props.componentId)
                        .then(() => Toast.show('Album added successfully'))
                }
            })
        } else {
            Toast.show('Please fill all fields')
        }
    }

    render() {
        const { name, description, disabled } = this.state
        const { title } = this.props

        return (
            <TitleLayout
                title={title}
                bottomBar={false}
                searchButton={false}
            >
                <View
                    style={styles.container}
                >
                    <>
                        <AppTextInput 
                            label='Album title'
                            placeholder='Album title...'
                            value={name}
                            onChangeText={(text) => this.setState({ name: text })}
                            style={styles.input}
                        />

                        <AppTextInput 
                            label='Album description'
                            placeholder='Album description...'
                            value={description}
                            onChangeText={(text) => this.setState({ description: text })}
                            style={styles.input}
                            numberOfLines={3}
                        />
                    </>

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
                            onPress={() => {
                                this.handleAddAlbum()
                            }}
                            disabled={disabled}
                        />
                    </View>
                </View>
            </TitleLayout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: 20,
        height: deviceHeight * 0.875,
    },
    buttons: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: deviceWidth,
        padding: 12,
        bottom: 0
    },
    input: {
        width: deviceWidth * 0.8,
    }
})

export default AlbumAdd