import { Dimensions } from "react-native"

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const COLORS = {
    'black': '#353939',
    'black-blue': '#3F3D56',
    'turquoise': '#1EE6CB',
    'turquoise-light': '#A1E6DC',
    'gray': '#97A4A2',
    'blue-light': '#DFECEA',
    'red': '#E42424',
    'white': '#F2F2F2'
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export {
    deviceHeight,
    deviceWidth,
    COLORS,
    capitalize
}