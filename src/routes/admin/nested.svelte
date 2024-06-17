<script>
	import {slide } from "svelte/transition";
    import arrow_menu from '$lib/assets/arrow_menu.svg'
	import { expoInOut } from "svelte/easing";
	import { page } from "$app/stores";
    export let menu;
	
	let open = false;

    function toggle() {
        open = !open;
    }

</script>


{#if menu.children}
    <li>
        <details style="" class="group {$page.url.pathname == menu.url ? 'bg-secondary-400' : 'hover:bg-surface-200'}" open>
            <summary class='flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer'>
                <span class="text-gray-900 gap-2">{menu.name}</span>
                <svg class="w-5 h-5 text-gray-500 transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg"
                width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                </path>
            </svg>
            </summary>
                <article class="mx-4">
                    <ul class="flex flex-col gap-2 pl-2 mt-4" transition:slide={{easing: expoInOut}}>
                        {#each menu.children as item}
                            <svelte:self menu={item}/>
                        {/each}
                    </ul>
                </article>
        </details>
    </li>
{/if}
{#if !menu.children}    
    <li class="{$page.url.pathname == menu.url ? 'bg-blue-50' : 'hover:bg-blue-50'} block">
        <a class="rounded-xl block p-3" href='{menu.url}?menuid={menu.id}'>{menu.name}</a>
    </li>
{/if}




