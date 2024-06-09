import { redirect } from '@sveltejs/kit';

export async function load ({ fetch, cookies }) {
    const response = await fetch(import.meta.env.VITE_API_URL + '/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });
    
     /**@type {import('$lib/types/menu.d.js').Menu} */
    let menu = null;
  
    if (response.ok) {
     menu = await response.json();
    } else {
      throw redirect(302, '/');
    }

    const reqSetting = await fetch(import.meta.env.VITE_API_URL + '/app-setting/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });

    return {
      menu: menu,
      setting: await reqSetting.json()
    }; 
}