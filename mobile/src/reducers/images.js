'use strict'

const initialState = []

export default (state = initialState, action) => {
    switch (action.type) {
        case 'IMAGES_ADD':
            return [ ...state, action.payload ]

        case 'IMAGES_UPDATE':
            return action.payload

        case 'IMAGES_DELETE':
            return []

        default:
            return state
    }
}
