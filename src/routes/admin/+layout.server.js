/**
 * @typedef Menu
 * @prop {Data[]} menu
 * 
 * @typedef Data
 * @prop {number} id
 * @prop {string} name
 * @prop {string} url
 * @prop {number} parent_id
 * @prop {Data[]?} children
 */

import { redirect } from '@sveltejs/kit';

export async function load ({ fetch, cookies }) {
    const response = await fetch(import.meta.env.VITE_API_URL + '/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });
    
     /**@type {Menu} */
    let menu = null;
  
    if (response.ok) {
     menu = await response.json();
    } else {
      throw redirect(302, '/');
    }

    return {
      menu: menu.menu 
    }; 
}