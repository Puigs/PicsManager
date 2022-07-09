export default ROOTS = {
    LOGIN: {
        root: {
            stack: {
                children: [
                    {
                        component: {
                            id: 'Login',
                            name: 'Login'
                        }
                    }
                ]
            }
        }
    },

    ALBUMS: {
        root: {
            stack: {
                children: [
                    {
                        component: {
                            id: 'Albums',
                            name: 'Albums'
                        }
                    }
                ],
            }
        }
    },

    PROFILE: {
        root: {
            stack: {
                children: [
                    {
                        component: {
                            id: 'Profile',
                            name: 'Profile'
                        }
                    }
                ],
            }
        }
    },
}
