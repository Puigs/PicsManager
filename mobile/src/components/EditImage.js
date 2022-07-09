import React, { PureComponent } from "react"
import {
    View,
    StyleSheet
} from "react-native"
import { Navigation } from "react-native-navigation"
import Toast from 'react-native-simple-toast'
import { apiCall } from "../utils/apiCall"

import AppTextInput from "./common/AppTextInput"
import AppButton from "./common/Button"
import TitleLayout from "./layouts/Title"

class EditImage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: props.name || 'Untitled',
            description: props.description || 'No description provided',
            disabled: false,
        }
    }

    async handleEditPress() {
        const { name, description } = this.state
        const { id } = this.props

        try {
            const res = await apiCall({
                method: 'PUT',
                route: `api/image/${id}`,
                body: JSON.stringify({
                    name,
                    description
                })
            })

            if (res.status === 200) {
                Navigation.pop(this.props.componentId)
                    .then(() => Toast.show('Image edited!'))
            }
        } catch (error) {
            console.log(error)
            Toast.show('Error when editing image')
        }
    }

    handleCancelPress() {
        Navigation.pop(this.props.componentId)
    }

    render() {
        const { name, description, disabled } = this.state

        return (
            <TitleLayout
                title="Edit Image"
                bottomBar={false}
                searchButton={false}
            >
                <View
                    style={styles.container}
                >
                    <AppTextInput 
                        label="Name"
                        placeholder="Name"
                        value={name}
                        onChangeText={(v) => this.setState({ name: v })}
                        style={{
                            marginBottom: 12
                        }}
                    />

                    <AppTextInput 
                        label="Description"
                        placeholder="Description"
                        value={description}
                        onChangeText={(v) => this.setState({ description: v })}
                    />
                </View>

                <View style={styles.buttons}>
                    <AppButton 
                        title='Cancel'
                        onPress={this.handleCancelPress.bind(this)}
                        cancel={true}
                        style={{
                            marginRight: 16,
                            maxWidth: 200,
                            width: '45%'
                        }}
                        disabled={disabled}
                    />

                    <AppButton 
                        title='Upload'
                        onPress={this.handleEditPress.bind(this)}
                        style={{
                            maxWidth: 200,
                            width: '45%'
                        }}
                        disabled={disabled}
                    />
                </View>
            </TitleLayout>
        )
    }
}

const styles = StyleSheet.create({
    buttons: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '100%',
        padding: 12
    },
    container: {
        padding: 12
    }
})

export default EditImage