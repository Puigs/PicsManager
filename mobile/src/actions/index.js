/**
 * Module that exports all the redux store actions
 * @module actions
 */

/**
 * Sets user logged in
 * @param {Object} user
 * @return {Object} SetUser action
 */
export const setUser = user => {
    return {
        type: 'USER_SET',
        payload: user
    }
}

/**
 * Logs out the user
 * @return {Object} UnsetUser action
 */
export const unsetUser = () => {
    return {
        type: 'USER_UNSET',
        payload: null
    }
}

/**
 * Updates user logged in
 * @param {Object} data
 * @return {Object} SetUser action
 */
export const updateUser = data => {
    return {
        type: 'USER_UPDATE',
        payload: data
    }
}

/**
 * Updates search in query
 * @param {Object} data
 * @return {Object} setSearch action
 */
 export const updateSearch = data => {
    return {
        type: 'SEARCH_UPDATE',
        payload: data
    }
}

/**
 * Deletes search in query
 * @param {Object} data
 * @return {Object} deleteSearch action
 */
 export const deleteSearch = data => {
    return {
        type: 'SEARCH_DELETE',
        payload: data
    }
}

/**
 * Deletes root in query
 * @param {Object} data
 * @return {Object} deleteRoot action
 */
 export const deleteRoot = data => {
    return {
        type: 'ROOT_DELETE',
        payload: data
    }
}

/**
 * Updates search in query
 * @param {Object} data
 * @return {Object} updateRoot action
 */
 export const updateRoot = data => {
    return {
        type: 'ROOT_UPDATE',
        payload: data
    }
}

/**
 * Updates modal with content
 * @param {Object} data
 * @return {Object} updateModal action
 */
 export const updateModal = data => {
    return {
        type: 'MODAL_UPDATE',
        payload: data
    }
}

/**
 * Updates albums with content
 * @param {Object} data
 * @return {Object} updateAlbums action
 */
 export const updateAlbums = data => {
    return {
        type: 'ALBUMS_UPDATE',
        payload: data
    }
}

/**
 * Adds an album 
 * @param {Object} data
 * @return {Object} addAlbum action
 */
 export const addAlbum = data => {
    return {
        type: 'ALBUMS_ADD',
        payload: data
    }
}

/**
 * Deletes albums with content
 * @param {Object} data
 * @return {Object} deleteAlbums action
 */
 export const deleteAlbums = data => {
    return {
        type: 'ALBUMS_DELETE',
        payload: data
    }
}

/**
 * Updates images with content
 * @param {Object} data
 * @return {Object} updateImages action
 */
 export const updateImages = data => {
    return {
        type: 'IMAGES_UPDATE',
        payload: data
    }
}

/**
 * Adds an image 
 * @param {Object} data
 * @return {Object} addImage action
 */
 export const addImage = data => {
    return {
        type: 'IMAGES_ADD',
        payload: data
    }
}

/**
 * Deletes images with content
 * @param {Object} data
 * @return {Object} deleteImages action
 */
 export const deleteImages = data => {
    return {
        type: 'IMAGES_DELETE',
        payload: data
    }
}
