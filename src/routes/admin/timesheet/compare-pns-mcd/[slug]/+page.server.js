import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, params }) {
	const list = await fetch(import.meta.env.VITE_SERVER_API_URL + '/timesheet/list-pns-mcd', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + cookies.get('token')
		}
	});

	const detailTempTimesheet = await fetch(
		import.meta.env.VITE_SERVER_API_URL + '/timesheet/detail-temp-timesheet/' + params.slug,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		}
	);

	if (!detailTempTimesheet.ok) {
		if (import.meta.env.VITE_DEBUG == 'true') {
			return error(detailTempTimesheet.status, {
				message: await list.text(),
				debug: true
			});
		}
		return error(detailTempTimesheet.status, {
			message: 'Error'
		});
	}

	let timesheet = await detailTempTimesheet.json();

	const pns = await fetch(
		import.meta.env.VITE_SERVER_API_URL + '/timesheet/list-pns-temp/' + timesheet.data.id,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		}
	);
	const mcd = await fetch(
		import.meta.env.VITE_SERVER_API_URL + '/timesheet/list-mcd-temp/' + timesheet.data.id,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		}
	);

	const diff = await fetch(
		import.meta.env.VITE_SERVER_API_URL + '/timesheet/list-diff/' + timesheet.data.id,
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

	if (!pns.ok) {
		if (import.meta.env.VITE_DEBUG == 'true') {
			return error(pns.status, {
				message: await pns.text(),
				debug: true
			});
		}
		let message = await pns.json();
		return error(pns.status, {
			message: message.message
		});
	}

	if (!mcd.ok) {
		if (import.meta.env.VITE_DEBUG == 'true') {
			return error(mcd.status, {
				message: await mcd.text(),
				debug: true
			});
		}
		let message = await mcd.json();
		return error(mcd.status, {
			message: message.message
		});
	}

	return {
		list: await list.json(),
		slug: params.slug,
		timesheet: timesheet.data,
		dataPns: {
			list: await pns.json(),
			permissions: {
				permission: {
					create: false,
					update: false,
					delete: false
				}
			},
			setting: {
				sizePage: 75
			}
		},
		dataMcd: {
			list: await mcd.json(),
			permissions: {
				permission: {
					create: false,
					update: false,
					delete: false
				}
			},
			setting: {
				sizePage: 75
			}
		},

		diff: await diff.json()
	};
}
