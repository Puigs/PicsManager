'use strict'

const initialState = {}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'MODAL_UPDATE':
            return {... action.payload}

        default:
            return state
    }
}
