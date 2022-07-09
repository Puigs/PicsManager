import React, { PureComponent } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import PropTypes from 'prop-types'
import { Provider } from "react-redux"

import { 
    deviceHeight, 
    deviceWidth,
    COLORS
} from '../../utils/stylesConfig'
import AppText from "../common/AppText"
import BottomBar from "../common/BottomBar"
import SearchButton from "../common/SearchButton"
import LoupeSvg from '../../assets/images/loupe.svg'
import { store } from '../../store'

class TitleLayout extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            searchActive: false,
            searchQuery: '',
            searchFocus: false,
        }
    }

    handleSearchPress() {
        const { searchActive, searchFocus } = this.state

        this.setState({ searchActive: !searchActive, searchFocus: !searchFocus })
    }

    render () {
        const { children, title, bottomBar, searchButton, iconButton, iconOnPress } = this.props
        const { searchActive, searchFocus } = this.state

        return (
            <Provider store={store}>
                <View
                    style={styles.layoutBackground}
                >
                    {title &&
                        <View
                            style={styles.top}
                        >
                            {!searchActive &&
                                <AppText
                                    size={deviceWidth * 0.12}
                                >
                                    {title}
                                </AppText>
                            }

                            {searchButton &&
                                <SearchButton
                                    active={searchActive}
                                    onPress={this.handleSearchPress.bind(this)}
                                    icon={<LoupeSvg />}
                                    searchFocus={searchFocus}
                                />
                            }

                            {iconButton &&
                                <TouchableOpacity
                                    onPress={iconOnPress}
                                >
                                   {iconButton}
                                </TouchableOpacity>
                            }
                        </View>
                    }

                    {children}

                    {bottomBar &&
                        <BottomBar componentId={this.props.componentId} />
                    }
                </View>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    layoutBackground: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: deviceWidth,
        minHeight: deviceHeight,
        backgroundColor: COLORS["black"],
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    }
})

TitleLayout.propTypes = {
    title: PropTypes.string,
    componentId: PropTypes.string,
    bottomBar: PropTypes.bool,
    searchButton: PropTypes.bool,
    iconButton: PropTypes.object,
}

TitleLayout.defaultProps = {
    title: '',
    bottomBar: true,
    searchButton: true,
    iconButton: null,
    iconOnPress: () => {}
}

export default TitleLayout
