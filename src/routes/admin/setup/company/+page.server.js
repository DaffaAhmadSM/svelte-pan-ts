export  async function load({ fetch, cookies, url }) {
    const user = await fetch(import.meta.env.VITE_API_URL + '/company/list', {
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

    return { users: await user.json(), permissions: await permission.json() }
}
