import { error } from '@sveltejs/kit'

export  async function load({ fetch, cookies, url }) {
    const list = await fetch(import.meta.env.VITE_API_URL + '/employee-project-experience/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        }
    })

    const paramsurl = url.searchParams.get('menuid')
    const permission = await fetch(import.meta.env.VITE_API_URL + '/menu-user-permission/menu/' + paramsurl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        }
    })

    if (!list.ok) {
        if (import.meta.env.VITE_DEBUG == "true") {
            return error(500, { 
                message: await list.text(),
                debug: true
            })
        }
        return error(500, { 
            message: 'Error',
        })
    }

    if (!permission.ok) {
        if (import.meta.env.VITE_DEBUG == "true") {
            return error(500, { 
                message: await permission.text(),
                debug: true
            })
        }
        return error(500, { 
            message: 'Error',
        })
    }

    return { list: await list.json(), permissions: await permission.json() }
}
