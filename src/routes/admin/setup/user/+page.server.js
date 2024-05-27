import { redirect } from '@sveltejs/kit';

export  async function load({ fetch, cookies }) {
    const user = await fetch(import.meta.env.VITE_API_URL + '/user/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        }
    })
    return { users: await user.json() }
}
