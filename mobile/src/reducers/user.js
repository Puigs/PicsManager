'use strict'

const initialState = null

export default (state = initialState, action) => {
    switch (action.type) {
        case 'USER_SET':
            return action.payload

        case 'USER_UPDATE':
            return { ...state, ...action.payload }

        case 'USER_UNSET':
            return null

        default:
            return state
    }
}
