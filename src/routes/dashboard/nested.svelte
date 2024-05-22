<script>
    export let menu;
    export let indent = 0;
	
	let open = true;

    function toggle() {
        open = !open;
    }
</script>

<li style="transform: translate({indent}px);" class="flex w-full hover:bg-gray-100 dark:hover:bg-gray-700 group text-start">
    <a class="pt-1 pr-1 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:underline" href={menu.url}>{menu.name}</a>
    {#if menu.children}
        <button on:click={toggle}>b</button>
    {/if}
</li>

{#if open && menu.children}
        {#each menu.children as item}
            <svelte:self menu={item} indent={indent + 24} />
        {/each}
{/if}