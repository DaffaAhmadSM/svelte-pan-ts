<script>
	import Nested from './nested.svelte';
    import { navigating } from '$app/stores';
    /**
     * @type {import('./$types').LayoutData} 
     * */
    export let data;
    let menu = data.menu;
</script>
<div class="flex flex-row selection:bg-primary-300" data-theme="wintry">
    <aside class="min-w-60 max-w-60 h-screen overflow-scroll">
        <div class="flex flex-col h-full px-3 py-4 overflow-y-auto bg-surface-50 dark:bg-gray-800">
            {#each menu as item}
            <ul class="space-y-2 font-medium flex flex-col">
                <Nested menu={item}/>
            </ul>
            {/each}
        </div>
    </aside>
    {#if $navigating}
        <div class="flex flex-col items-center justify-center w-full h-screen">
            <div class="loader">Loading</div>
        </div>
    {:else}
    <slot/>
    {/if}
</div>