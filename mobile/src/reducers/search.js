'use strict'

const initialState = ''

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_UPDATE':
            return action.payload

        case 'SEARCH_DELETE':
            return ''

        default:
            return state
    }
}
