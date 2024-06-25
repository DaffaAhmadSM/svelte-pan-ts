<script>
	import Nested from './nested.svelte';
    import { navigating } from '$app/stores';
    import {Toaster} from 'svelte-sonner'
    import { initializeStores, Modal } from '@skeletonlabs/skeleton';

    initializeStores();
    import { menuData } from '$lib/stores/menu';
	import { onMount } from 'svelte';
    /**
     * @type {import('./$types').LayoutData} 
     * */
    export let data;
    let menu = data.menu.menu;
    menuData.set(data.menu);
</script>
<div class="flex flex-row">
    <aside class="min-w-60 max-w-72 h-screen overflow-scroll fixed">
        <div class="flex flex-col h-full px-3 py-4 overflow-y-auto">
            {#each menu as item}
            <ul class="font-medium flex flex-col menu text-lg">
                <Nested menu={item}/>
            </ul>
            {/each}
        </div>
    </aside>
    <div class="ml-72 w-full">
    {#if $navigating}
        <div class="flex flex-col items-center justify-center w-full h-screen">
            <span class="loading loading-spinner loading-sm"></span>
        </div>
    {:else}
    <slot/>
    {/if}
    </div>
    <Modal />
    <Toaster expand={true} position="top-center" richColors/>
</div>