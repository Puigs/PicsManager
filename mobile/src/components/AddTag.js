import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet,
    View,
} from 'react-native'
import Toast from 'react-native-simple-toast'
import { Navigation } from 'react-native-navigation'
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker'

import { apiCall } from '../utils/apiCall'
import AppText from './common/AppText'
import TitleLayout from './layouts/Title'
import AppTextInput from './common/AppTextInput'
import AppButton from './common/Button'
import {
    deviceWidth
} from '../utils/stylesConfig'
import Tag from './common/Tag'

class AddTag extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: 'Tag',
            color: '#ff0000',
            disabled: false,
            loading: false
        }
    }

    handleCancelPress() {
        Navigation.pop(this.props.componentId)
    }

    async handleAddTagPress() {
        this.setState({
            disabled: true,
            loading: true
        })

        try {
            const { name } = this.state
            const { id } = this.props
    
            const res = await apiCall({
                method: 'PUT',
                route: `api/image/${id}/tag/add/${name}`,
            })
    
            if (res.status === 200) {
                Navigation.pop(this.props.componentId)
                    .then(() => Toast.show('Tag added!'))
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({
                disabled: false,
                loading: false
            })
        }
    }

    render() {
        const { name, color, disabled } = this.state

        return (
            <TitleLayout
                title="Add a Tag"
                searchButton={false}
                bottomBar={false}
            >
                <AppTextInput
                    label="Tag name"
                    placeholder="Tag Color"
                    value={name}
                    onChangeText={(v) => this.setState({ name: v })}
                    style={styles.searchButton}
                />
                
                <AppText
                    style={styles.chooseTitle}
                    weight="Bold"
                    size={deviceWidth * 0.05}
                >
                    Choose a Tag Color by rotating the triangle below...
                </AppText>

                <TriangleColorPicker 
                    onColorChange={(rgb) => 
                        this.setState({ color: fromHsv({h: rgb.h, s: rgb.s, v: rgb.v}) })
                    }
                    style={styles.colorPicker}
                />

                <View
                    style={styles.example}
                >
                    <Tag
                        name={name}
                        color={color}
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
                        }}
                        disabled={disabled}
                    />

                    <AppButton 
                        title='Upload'
                        onPress={this.handleAddTagPress.bind(this)}
                        style={{
                            maxWidth: 200,
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
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: deviceWidth,
        padding: 12,
        bottom: 0
    },
    colorPicker: {
        alignSelf: 'center',
        width: '80%',
        height: '40%',
        paddingBottom: 12
    },
    chooseTitle: {
        padding: 12,
        opacity: 0.5
    },
    buttons: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        padding: 12
    },
    example: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        marginHorizontal: 12
    }
})

AddTag.propTypes = {}

AddTag.defaultProps = {}

export default AddTag
