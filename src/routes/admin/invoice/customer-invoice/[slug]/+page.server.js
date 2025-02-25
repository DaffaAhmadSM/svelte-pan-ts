import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, url, params }) {
	const paramsurl = url.searchParams.get('menuid');
	const list = await fetch(
		import.meta.env.VITE_SERVER_API_URL + '/customer-invoice/detail/' + params.slug,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		}
	);
	if (!list.ok) {
		if (import.meta.env.VITE_DEBUG == 'true') {
			return error(500, {
				message: await list.text(),
				debug: true
			});
		}
		return error(500, {
			message: 'Error'
		});
	}

	return {
		list: await list.json(),
		permissions: {
			permission: {
				create: false,
				update: false,
				delete: false
			}
		},
		slug: params.slug,
		paramsurl: paramsurl
	};
}
