import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, params }) {
	const detail = await fetch(import.meta.env.VITE_API_URL + '/employee-rates/detail/' + params.id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + cookies.get('token')
		}
	});

	if (!detail.ok) {
		if (detail.status === 404) {
			throw error(404, { message: 'Employee rate not found' });
		}
		throw error(500, { message: 'Failed to load rate detail' });
	}

	const details = await fetch(
		import.meta.env.VITE_API_URL + '/employee-rate-details/list/' + params.id + '?perpage=100',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		}
	);

	if (!details.ok) {
		throw error(500, { message: 'Failed to load rate details' });
	}

	return {
		rate: await detail.json(),
		details: await details.json()
	};
}
