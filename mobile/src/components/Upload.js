import React, { PureComponent } from 'react'
import { 
    StyleSheet,
    View,
    Image,
    ScrollView
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { launchCamera } from 'react-native-image-picker'
import Toast from 'react-native-simple-toast'
import { connect } from 'react-redux'

import CustomSelect from './common/CustomSelect'
import AppButton from './common/Button'
import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../utils/stylesConfig'
import AppText from './common/AppText'
import Layout from './layouts/Layout'
import AppTextInput from './common/AppTextInput'
import { apiCall } from '../utils/apiCall'
import { store } from '../store'
import { addImage } from '../actions'
import { getImageSize } from '../utils/image'

class Upload extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            tags: [],
            desc: '',
            loading: false,
            selectedAlbum: props.selectedAlbum || '',
            clusters: '12',
            image: this.props.image || undefined,
            compressedImage: null,
            isUploaded: false,
            disabled: false
        }
    }

    handleCancelPress() {
        Navigation.pop(this.props.componentId)
    }

    async handleUploadPress() {
        const { name, desc, tags, image, selectedAlbum, clusters } = this.state

        if (image) {
            this.setState({
                disabled: true
            })

            try {
                const resFlask = await apiCall({
                    method: 'POST',
                    route: 'compress',
                    flask: true,
                    body: JSON.stringify({
                        nbClusters: parseInt(clusters),
                        imageData: image.base64
                    })
                })

                if (resFlask.status === 200) {
                    const result = await resFlask.json()
                    const res = await apiCall({
                        method: 'POST',
                        route: 'api/image/create',
                        body: JSON.stringify({
                            name,
                            description: desc,
                            tags,
                            data: result.compressedData,
                            authorized_user: [],
                            album_id: selectedAlbum ? [selectedAlbum] : []
                        })
                    })
    
                    if (res.status === 200) {
                        const resultBack = await res.json()

                        if (!selectedAlbum) {                            
                            store.dispatch(addImage(resultBack))
                        }

                        this.setState({
                            compressedImage: 'data:image/png;base64,' + result.compressedData,
                            isUploaded: true
                        })
                    } else {
                        console.log('Erreur lors de la création de l\'image');
                        Toast.show('Error while uploading image')
                    }
                } else {
                    console.log('Erreur lors de la compression, flask status not 200');
                }

            } catch (error) {
                Toast.show(error.message)
            }

            this.setState({
                disabled: false
            })
        } else {
            Toast.show('No image loaded, please take a new picture')
        }
    }

    async handleRetryPress() {
        console.log("Camera pressed");

        const res = await launchCamera(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxWidth: deviceWidth,
                maxHeight: deviceHeight
            }
        )

        if (res.assets) {
            this.setState({ image: res.assets[0] })
        } else if (res.didCancel) {
            console.log('Taking photo canceled')
        } else {
            console.log(`Error ${res.errorCode} when taking photo: ${res.errorMessage}`)
        }
    }

    render () {
        const { image, name, desc, selectedAlbum, disabled, compressedImage, isUploaded, clusters } = this.state
        const { albums } = this.props

        return (
            <Layout
                ellipses={false}
            >
                <View style={styles.retryButton}>
                    <AppButton
                        title='Retry'
                        onPress={this.handleRetryPress.bind(this)}
                        cancel={true}
                        disabled={isUploaded}
                    >
                        Retry
                    </AppButton>
                </View>

                <View style={image ? 
                        { ...styles.image, aspectRatio: ( image.width / image.height ) } 
                        : styles.image
                    }>
                    {image ?
                        <>
                            <Image
                                resizeMode="contain"
                                onLoadStart={() => this.setState({ loading: true })}
                                source={{
                                    uri: image?.uri || '../assets/icon.png',
                                    height: '100%',
                                    width: '100%'
                                }}
                                style={{
                                    borderRadius: 8
                                }}
                                onLoadEnd={() => this.setState({ loading: false })}
                                onError={e => console.log('Error loading image:', e)}
                            />

                            <AppText
                                style={{
                                    color: COLORS.turquoise,
                                    alignSelf: 'center',
                                }}
                                weight='Bold'
                                size={12}
                            >
                                {Math.round(Number(getImageSize('data:image/png;base64,' + image.base64 )))} KOs
                            </AppText>
                        </>
                    :
                        <View style={styles.errorText}>
                            <AppText
                                color={COLORS.black}
                            >
                                An error has appeared. Please try again.
                            </AppText>
                        </View>
                    }                    
                </View>

                {compressedImage ?
                    <View
                        style={styles.compressedImage}
                    >
                        <Image
                            resizeMode="contain"
                            source={{
                                uri: compressedImage,
                                height: '100%',
                                width: '100%'
                            }}
                            style={{
                                borderRadius: 8,
                            }}
                            onError={e => Toast.show('Error showing compressed image')}
                        />

                        <AppText
                            style={{
                                color: COLORS.turquoise,
                                alignSelf: 'center',
                            }}
                            weight='Bold'
                            size={12}
                        >
                            {Math.round(Number(getImageSize(compressedImage)))} KOs
                        </AppText>
                    </View>
                :
                    <ScrollView
                        style={styles.basic}
                    >
                        <AppTextInput
                            label='Photo Name'
                            placeholder='Name of your picture'
                            value={name}
                            onChangeText={v => this.setState({ name: v })}
                        />

                        <CustomSelect 
                            label="Album Destination"
                            value={selectedAlbum}
                            selectionValues={albums}
                            onValueChange={v => this.setState({ selectedAlbum: v })}
                            disabled={albums?.length === 0}
                        />

                        <AppTextInput 
                            label='Number of Clusters'
                            placeholder='Enter the number of clusters'
                            value={clusters}
                            onChangeText={v => {
                                if (parseInt(v) > 60)
                                    this.setState({ clusters: "60" })
                                else if (parseInt(v) < 2)
                                    this.setState({ clusters: "2" })
                                else if (!v)
                                    this.setState({ clusters: "12" })
                                else
                                    this.setState({ clusters: v.replace(/[^0-9]/g, '')})
                            }}
                            style={{
                                marginBottom: 10
                            }}
                            keyboardType='numeric'
                        />

                        <AppTextInput
                            label='Description of your Picture'
                            placeholder='Content of your description'
                            value={desc}
                            onChangeText={v => this.setState({ desc: v })}
                            multiline={true}
                            numberOfLines={3}
                        />
                    </ScrollView>
                }

                <View style={styles.buttons}>
                    <AppButton 
                        title='Cancel'
                        onPress={this.handleCancelPress.bind(this)}
                        cancel={true}
                        style={{
                            marginRight: isUploaded ? 0 : 16,
                            maxWidth: 200,
                            width: '45%'
                        }}
                        disabled={disabled}
                    />

                    {!isUploaded &&
                        <AppButton 
                            title='Upload'
                            onPress={this.handleUploadPress.bind(this)}
                            style={{
                                maxWidth: 200,
                                width: '45%'
                            }}
                            disabled={disabled}
                        />
                    }
                </View>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    basic: {
        display: 'flex',
        flexDirection: 'column',
        width: deviceWidth * 0.85,
        paddingHorizontal: 8,
        maxHeight: deviceHeight * 0.42,
        overflow: 'scroll'
    },
    image: {
        display: 'flex',
        height: deviceHeight * 0.35,
        width: deviceWidth * 0.8,
        margin: 12,
        backgroundColor: COLORS["blue-light"],
        borderWidth: 1,
        borderColor: COLORS.turquoise,
        borderRadius: 8
    },
    retryButton: {
        alignSelf: 'flex-end',
        width: '50%'
    },
    buttons: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '100%'
    },
    errorText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: "justify"
    },
    compressedImage: {
        display: 'flex',
        alignSelf: 'center',
        width: deviceWidth * 0.8,
        height: deviceHeight * 0.35,
        paddingVertical: 8
    },
})

const mapStatesToProps = ({ albums }) => {
    return { albums: albums.filter(album => album.id !== 'shared') }
}

export default connect(mapStatesToProps, {})(Upload)