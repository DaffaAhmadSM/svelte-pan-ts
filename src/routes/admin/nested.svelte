<script>
	import {slide } from "svelte/transition";
    import arrow_menu from '$lib/assets/arrow_menu.svg'
	import { expoInOut } from "svelte/easing";
	import { page } from "$app/stores";
    export let menu;
    export let indent = 0;
	
	let open = false;

    function toggle() {
        open = !open;
    }

</script>


{#if menu.children}
    <li>
        <details style="padding-left: {indent}px;" class="dark:hover:bg-gray-700 group text-start max-w-flil px-3 py-2 rounded-xl{$page.url.pathname == menu.url ? 'bg-secondary-400' : 'hover:bg-surface-200'}" open>
            <summary class='flex'>
                {#if menu.url !== null && $page.url.pathname !== menu.url}
                    <a class="pt-1 pr-1 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:underline" href='{menu.url}?menuid={menu.id}'>{menu.name}</a>
                {:else}
                    <button class="pt-1 pr-1 flex items-center p-2 rounded-lg dark:text-white w-max text-start {$page.url.pathname == menu.url ? 'text-surface-50 dark:text-surface-700' : ''}" on:click={toggle}>{menu.name}</button>
                {/if}
            </summary>
                <ul class="flex flex-col w-full group text-start" transition:slide={{easing: expoInOut}}>
                    {#each menu.children as item}
                        <svelte:self menu={item} indent={indent + 20}/>
                    {/each}
                </ul>
        </details>
    </li>
{/if}
{#if !menu.children}
    <li>
        <a class="dark:hover:bg-gray-700 group text-start max-w-flil px-3 py-2 rounded-xl{$page.url.pathname == menu.url ? 'bg-secondary-400' : 'hover:bg-surface-200'}" href='{menu.url}?menuid={menu.id}'>{menu.name}</a>
    </li>
{/if}




