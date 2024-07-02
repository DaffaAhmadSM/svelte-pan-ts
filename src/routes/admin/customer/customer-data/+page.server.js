export  async function load({ fetch, cookies, url }) {
    const list = await fetch(import.meta.env.VITE_API_URL + '/customer/list', {
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

    return { list: await list.json(), permissions: await permission.json() }
}
