import Config from 'react-native-config'
import { store } from '../store'

function getToken() {
    const { accessToken = '' } = store.getState().user || {}

    return accessToken || ''
}

export async function apiCall({
    route,
    method = 'GET', 
    headers = { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body,
    flask = false
}) {
    try {
        console.log((flask ? Config.FLASK_HOST : Config.BACK_HOST) + route)

        const res = body ? await fetch(`${flask ? Config.FLASK_HOST : Config.BACK_HOST}${route}`, {
            method: method,
            headers: {
                ...headers,
                'x-access-token': getToken()
            },
            body: body
        }) : await fetch(`${Config.BACK_HOST}${route}`, {
            method: method,
            headers: {
                ...headers,
                'x-access-token': getToken()
            }, 
        })

        if (!res.ok)
            throw new Error({ message: res.status })

        return res
    } catch (error) {
        console.log(error)
        return { message: error }
    }
}
