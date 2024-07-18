import { error, redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    console.log("Handle")
	let token = event.cookies.get('token');
    if(event.url.pathname.startsWith('/admin')) {
        if(!token) {
            error(401, 'Unauthorized');
        }
        let fetchAuthCheck = await fetch(import.meta.env.VITE_API_URL + '/check-auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        
        if(fetchAuthCheck.status === 401) {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/'
                }
            })
        }
    }
	const response = await resolve(event);

	return response;
}