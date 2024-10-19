import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let token = event.cookies.get('token');
    if(event.url.pathname.startsWith('/admin')) {
        if(!token) {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/'
                }
            })
        }
        let fetchAuthCheck = await fetch(import.meta.env.VITE_API_URL + '/check-auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        
        if(fetchAuthCheck.status === 401) {
            event.cookies.getAll().forEach(cookie => {
                event.cookies.delete(cookie.name, {path: '/'});
            });
            throw redirect(307, '/');
        }
    }
	const response = await resolve(event);

	return response;
}