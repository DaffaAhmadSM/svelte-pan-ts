import { writable } from "svelte/store";


/**
 * @type {import('$lib/types/menu.d.js').Menu}
 */
let menu = null;
export const menuData = writable(menu);