'use strict'

const initialState = null

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ROOT_UPDATE':
            return { ...state, ...action.payload }

        case 'ROOT_DELETE':
            return null

        default:
            return state
    }
}
