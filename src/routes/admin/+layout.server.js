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

export async function load ({ fetch, cookies }) {
    const response = await fetch(import.meta.env.VITE_API_URL + '/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });
  
    if (response.ok) {
        /**@type {Menu} */
      const data = await response.json();
      return {
         menu: data.menu 
        };
    } else {
      throw new Error(await response.text());
    }
}