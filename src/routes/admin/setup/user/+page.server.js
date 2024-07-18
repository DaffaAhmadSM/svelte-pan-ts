import { redirect } from '@sveltejs/kit'

export  async function load({ fetch, cookies, url }) {
    const list = await fetch(import.meta.env.VITE_API_URL + '/user/list', {
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

    const currentUser = await fetch(import.meta.env.VITE_API_URL + '/user/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        }
    })

    return { list: await list.json(), permissions: await permission.json(), user: await currentUser.json()}
}
