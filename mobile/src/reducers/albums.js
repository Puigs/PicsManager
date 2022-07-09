'use strict'

const initialState = []

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ALBUMS_ADD':
            return [ ...state, action.payload ]

        case 'ALBUMS_UPDATE':
            return action.payload

        case 'ALBUMS_DELETE':
            return []

        default:
            return state
    }
}
