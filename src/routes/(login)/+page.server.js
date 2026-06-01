import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const response = await event.fetch(import.meta.env.VITE_API_URL + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		const body = await response.json();

		if (!response.ok) {
			return fail(response.status, {
				error: body.error ?? 'Invalid email or password. Please try again.'
			});
		}

		event.cookies.set('token', body.token, {
			path: '/',
			httpOnly: false,
			sameSite: 'lax'
		});

		// Store menu in cookie for server-side access
		if (body.menu) {
			event.cookies.set('menu', JSON.stringify(body.menu), {
				path: '/',
				httpOnly: false,
				sameSite: 'lax'
			});
		}

		throw redirect(303, '/admin');
	}
};
