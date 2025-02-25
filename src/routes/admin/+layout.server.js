import { redirect } from '@sveltejs/kit';

export async function load({ fetch, cookies }) {
	const response = await fetch(import.meta.env.VITE_SERVER_API_URL + '/menu', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + cookies.get('token')
		}
	});

	/**@type {import('$lib/types/menu.d.js').Menu} */
	let menu = null;

	if (response.ok) {
		menu = await response.json();
		cookies.set('user_id', String(menu.user.id), { path: '/', httpOnly: false });
	} else {
		redirect(302, '/');
	}

	const reqSetting = await fetch(import.meta.env.VITE_SERVER_API_URL + '/app-setting/all', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + cookies.get('token')
		}
	});

	let setting = await reqSetting.json();
	if (reqSetting.ok) {
		cookies.set('setting', setting, { path: '/', httpOnly: false });
	}

	return {
		menu: menu,
		setting: setting
	};
}
