<script>
	import { fade, slide } from "svelte/transition";
    import arrow_menu from '$lib/assets/arrow_menu.svg'
	import { spring } from "svelte/motion";
	import { expoInOut } from "svelte/easing";
    export let menu;
    export let indent = 0;
	
	let open = false;

    function toggle() {
        open = !open;
    }
</script>

<li style="margin-left: {indent}px;" class="flex  hover:bg-gray-100 dark:hover:bg-gray-700 group text-start max-w-full">
    {#if menu.url !== null}
    <a class="pt-1 pr-1 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:underline" href={menu.url}>{menu.name}</a>
    {:else}
    <button class="pt-1 pr-1 flex items-center p-2 text-gray-900 rounded-lg dark:text-white w-max" on:click={toggle}>{menu.name}</button>
    {/if}
    {#if menu.children}
        {#if open}
            <button on:click={toggle}><img src="{arrow_menu}" alt="arrow"></button>
        {:else}
            <button on:click={toggle}><img src="{arrow_menu}" alt="arrow" class="rotate-90"></button>
        {/if}
    {/if}
</li>

{#if open && menu.children}
        <ul class="flex flex-col w-full group text-start" transition:slide={{easing: expoInOut}}>
            {#each menu.children as item}
                <svelte:self menu={item} indent={indent + 20}/>
            {/each}
        </ul>
{/if}

