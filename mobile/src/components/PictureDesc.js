import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet,
    Image,
    View,
    TouchableOpacity
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Navigation } from 'react-native-navigation'

import {
    deviceHeight,
    deviceWidth,
    COLORS
} from '../utils/stylesConfig'
import TitleLayout from './layouts/Title'
import AppText from './common/AppText'
import Tag from './common/Tag'
import PlusSvg from '../assets/images/plus.svg'
import ShareSvg from '../assets/images/share.svg'
import EditSvg from '../assets/images/edit.svg'
import { parseDateToWeekDay } from '../utils/dates'
import { store } from '../store'

class PictureDesc extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            error: false
        }
    }
    
    handleSharePicPress(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Share',
                passProps: {
                    ...item
                }
            }
        })
    }

    handleAddTagPress(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'AddTag',
                passProps: {
                    ...item
                }
            }
        })
    }

    handleEditPress(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'EditImage',
                passProps: {
                    ...item
                }
            }
        })
    }

    render() {
        const { description, createdAt, username, title, tags, id, data, owner, authorized_user } = this.props
        const { error } = this.state
        const myUsername = store.getState().user.username

        return (
            <TitleLayout
                title={title || 'Untitled'}
                searchButton={false}
                bottomBar={false}
            >
                {!error ? 
                    <ImageZoom
                        cropWidth={deviceWidth * 0.9}
                        cropHeight={deviceHeight * 0.4}
                        imageWidth={deviceWidth * 0.9}
                        imageHeight={deviceHeight * 0.4}
                        useNativeDriver={true}
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <Image 
                            source={{
                                uri: `data:image/jpeg;base64,${data}`,
                                height: '100%',
                                width: '100%'
                            }}
                            resizeMode='contain'
                            onError={({ nativeEvent: {error} }) => {
                                this.setState({ error: true })
                                console.log('Erreur:', error)
                            }}
                        />
                    </ImageZoom>
                : 
                    <AppText style={{alignSelf: 'center'}}>
                        An error has occured
                    </AppText>
                }

                <View
                    style={styles.content}
                >
                    <AppText
                        size={deviceWidth * 0.03}
                        weight='Italic'
                    >
                        {`${parseDateToWeekDay(createdAt) || 'Some times ago'}, by ${owner || 'another user'}`}
                    </AppText>

                    <View
                        style={styles.tags}
                    >
                        {tags.map((tag, index) => 
                            <Tag
                                name={tag}
                                color={tag.color}
                                key={index}
                            /> 
                        )}
                    </View>

                    <AppText
                        size={deviceWidth * 0.04}
                    >
                        {description}
                    </AppText>

                </View>

                {owner === myUsername &&
                    <>
                        <TouchableOpacity
                            onPress={this.handleEditPress.bind(this, {
                                id,
                                name: title,
                                description
                            })}
                            onLongPress={this.handleEditPress.bind(this, {
                                id,
                                name: title,
                                description
                            })}
                            style={styles.editImage}
                            disabled={owner !== myUsername}
                        >
                            <EditSvg />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.handleAddTagPress.bind(this, {
                                id
                            })}
                            onLongPress={this.handleAddTagPress.bind(this, {
                                id
                            })}
                            style={styles.addTag}
                            disabled={owner !== myUsername}
                        >
                            <PlusSvg />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.handleSharePicPress.bind(this, {
                                description,
                                createdAt,
                                username,
                                title,
                                id,
                                authorized_user
                            })}
                            onLongPress={this.handleSharePicPress.bind(this, {
                                description,
                                createdAt,
                                username,
                                title,
                                id,
                                authorized_user
                            })}
                            style={styles.shareButton}
                            disabled={owner !== myUsername}
                        >
                            <ShareSvg />
                        </TouchableOpacity>
                    </>
                }
            </TitleLayout>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        margin: 12,
    },
    tags: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 12,
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
    addTag: {
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
    editImage: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: deviceWidth * 0.55,
        bottom: deviceHeight * 0.04,
        backgroundColor: COLORS.white,
        borderRadius: 46,
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: COLORS.turquoise,
    }
})

PictureDesc.propTypes = {
    title: PropTypes.string,
    uri: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    createdAt: PropTypes.string,
    username: PropTypes.string
}

PictureDesc.defaultProps = {
    title: 'Photo',
    uri: '',
    description: 'No description provided',
    tags: [],
    createdAt: '',
    username: ''
}

export default PictureDesc
