import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const email = data.get('email');
        const password = data.get('password');
        const response = await event.fetch(import.meta.env.VITE_API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            // Save the token in cookies
            event.cookies.set('token', token, {
                path: '/',
                httpOnly: false,
            });
            redirect(301, '/admin');
        }

        if (response.status == 401) {
            return { error: 'Invalid credentials' };
        }

        return { error: 'Invalid credentials' };
	}
}