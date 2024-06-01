<script>
	import Nested from './nested.svelte';
    import { navigating } from '$app/stores';
    import { initializeStores, Toast } from '@skeletonlabs/skeleton';
    /**
     * @type {import('./$types').LayoutData} 
     * */
    export let data;
    let menu = data.menu;
    initializeStores();
</script>
<div class="flex flex-row">
    <aside class="min-w-60 max-w-60 h-screen overflow-scroll fixed">
        <div class="flex flex-col h-full px-3 py-4 overflow-y-auto bg-surface-50 dark:bg-gray-800">
            {#each menu as item}
            <ul class="space-y-2 font-medium flex flex-col menu">
                <Nested menu={item}/>
            </ul>
            {/each}
        </div>
    </aside>
    <div class="ml-60 w-full">
    {#if $navigating}
        <div class="flex flex-col items-center justify-center w-full h-screen">
            <div class="loader">Loading</div>
        </div>
    {:else}
    <slot/>
    {/if}
    </div>
    <div data-theme="wintry"><Toast position='br'/></div>
</div>