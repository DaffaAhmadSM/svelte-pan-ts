
<script>
	import {slide } from "svelte/transition";
	import { expoInOut } from "svelte/easing";
	import { page } from "$app/stores";
    export let menu;

    export let open = false;
    export let highlightedquery = null;

    function highlightText(text) {
        if (!highlightedquery) return text;
        const regex = new RegExp(highlightedquery, 'gi');
        return text.replace(regex, '<mark class="highlight">' + highlightedquery + '</mark>');
    }
</script>


{#if menu.children}
    <li>
        <details class="{$page.url.pathname == menu.url ? 'bg-secondary-400' : 'hover:bg-surface-200'}" open={open}>
            <summary class='flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer'>
                <span class="text-gray-900 gap-2" id="highlightcheck">{@html highlightText(menu.name)}</span>
                <svg class="w-5 h-5 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg"
                width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                </path>
            </svg>
            </summary>
                <article class="mx-4">
                    <ul class="flex flex-col gap-2 pl-2 mt-4 border-l" transition:slide={{easing: expoInOut}}>
                        {#each menu.children as item}
                            <svelte:self menu={item} highlightedquery={highlightedquery} open={open}/>
                        {/each}
                    </ul>
                </article>
        </details>
    </li>
{/if}
{#if !menu.children}    
    <li class="{$page.url.pathname == menu.url ? 'bg-blue-50' : 'hover:bg-blue-50'} block">
        <a class="rounded-xl block p-3" href='{menu.url}?menuid={menu.id}'>{@html highlightText(menu.name)}</a>
    </li>
{/if}

<style>
    details[open] > summary > svg {
        transform: rotate(90deg);
    }
</style>




