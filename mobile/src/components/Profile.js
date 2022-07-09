import React, { PureComponent } from 'react'
import { 
    ActivityIndicator,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import Toast from 'react-native-simple-toast'
import { Navigation } from 'react-native-navigation'

import TitleLayout from './layouts/Title'
import { connect } from 'react-redux'
import { store } from '../store'
import ROOTS from '../utils/roots'
import LogoutSvg from '../assets/images/logout.svg'
import { unsetUser } from '../actions/index'
import AppText from './common/AppText'
import Info from './common/Info'
import {
    COLORS,
    deviceHeight,
    deviceWidth
} from '../utils/stylesConfig'
import { apiCall } from '../utils/apiCall'
import { parseDateToWeekDay } from '../utils/dates'

class Login extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            lastPic: null,
            albumsShared: 0,
            albumsCreated: 0,
            albumsReceived: 0,
            imagesShared: 0,
            imagesReceived: 0,
            imagesCreated: 0,
        }
    }

    handleLogOut() {
        store.dispatch(unsetUser())
        Navigation.setRoot(ROOTS.LOGIN)
            .then(() => Toast.show('Disconnected'))
    }

    async componentDidMount() {
        try {
            const res = await apiCall({
                method: 'GET',
                route: 'api/image/last_image'
            })

            if (res.status === 200) {
                const result = await res.json()

                this.setState({
                    lastPic: result
                })
            }

            const resInfos = await apiCall({
                method: 'GET',
                route: 'api/user/info'
            })

            if (resInfos.status === 200) {
                const result = await resInfos.json()

                this.setState({
                    albumsShared: result.nb_album_shared,
                    albumsReceived: result.nb_album_shared_with_me,
                    albumsCreated: result.nb_albums,
                    imagesShared: result.nb_image_shared,
                    imagesReceived: result.nb_image_shared_with_me,
                    imagesCreated: result.nb_images,
                    loading: false
                })
            }
        } catch (error) {
            console.log(error)
            Toast.show('An error has occured')
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    handleLastpicPress(item) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Picture',
                passProps: {
                    ...item
                }
            }
        })
    }
  
    render () {
        const { user } = this.props
        const { imagesCreated, imagesReceived, imagesShared, albumsCreated, lastPic, loading } = this.state
        const connected = parseDateToWeekDay(user?.connectedAt) || 'now'

        return (
            <TitleLayout
                title={user?.username || 'User'}
                searchButton={false}
                iconButton={<LogoutSvg />}
                iconOnPress={this.handleLogOut.bind(this)}
                componentId={this.props.componentId}
            >
                <View
                    style={styles.index}
                >
                    <Info
                        title='Last connection :'
                        subTitle={connected}
                        size={18}
                    />

                    {loading ?
                        <ActivityIndicator 
                            color={COLORS.turquoise}
                            size="large"
                        />
                    :
                        <>
                            <View
                                style={styles.info}
                            >
                                <Info 
                                    title='Picture Uploaded'
                                    subTitle={`${imagesCreated} uploaded`}
                                />

                                <Info 
                                    title='Album Created'
                                    subTitle={`${albumsCreated} created`}
                                /> 
                            </View>

                            <View
                                style={styles.info}
                            >
                                <Info 
                                    title='Picture Shared'
                                    subTitle={`${imagesShared} shared`}
                                />

                                <Info 
                                    title='Picture Received'
                                    subTitle={`${imagesReceived} received`}
                                />
                            </View>

                            <AppText
                                weight='Bold'
                                style={{ marginTop: 12 }}
                            >
                                Last Picture Uploaded :
                            </AppText>

                            <View
                                style={styles.lastpic}
                            >
                                {lastPic ?
                                    <TouchableOpacity
                                        style={styles.lastpic}
                                        onPress={this.handleLastpicPress.bind(this, {...lastPic})}
                                        onLongPress={this.handleLastpicPress.bind(this, {...lastPic})}
                                    >
                                        <Image
                                            resizeMode='contain'
                                            source={{ 
                                                uri: `data:image/jpeg;base64,${lastPic?.data}`,
                                                height: '100%',
                                                width: '100%'
                                            }}
                                            onError={({ nativeEvent: {error} }) => {
                                                this.setState({ error: true })
                                                console.log('Erreur:', error)
                                            }}
                                        />
                                    </TouchableOpacity>
                                :
                                    <AppText
                                        style={styles.noPicture}
                                        size={deviceWidth * 0.05}
                                    >
                                        Aucune image publiée
                                    </AppText>
                                }
                            </View>
                        </>
                    }
                </View>
            </TitleLayout>
        )
    }
}

const mapStatesToProps = ({ user }) => {
    return { user }
}

const styles = StyleSheet.create({
    index: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 16,
        width: '100%',
    },
    password: {
        display: 'flex',
        width: '80%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 16,
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    lastpic: {
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight * 0.25,
        width: deviceWidth * 0.925,
        marginTop: 12
    },
    noPicture: {
        height: '40%',
        opacity: 0.5
    }
})

export default connect(mapStatesToProps, { unsetUser })(Login)
