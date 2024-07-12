<script>
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import Nested from './nested.svelte';
    import { navigating } from '$app/stores';
    import {Toaster} from 'svelte-sonner';
    import { menuData } from '$lib/stores/menu';
    /**
     * @type {import('./$types').LayoutData} 
     * */
    export let data;
    menuData.set(data.menu);
    $: menu = $menuData.menu;
</script>
<div class="flex flex-row font-sans text-start text-wrap">
        <aside class="min-w-64 max-w-64 fixed left-0 top-0 bg-slate-50 h-screen p-2 overflow-y-scroll flex flex-col justify-between">
            <div class="flex flex-col px-3 py-4 overflow-y-scroll">
                {#each menu as item}
                <ul class="font-medium flex flex-col menu text-md">
                    <Nested menu={item}/>
                </ul>
                {/each}
            </div>
            <div class="flex flex-row items-center justify-between mt-6">
                <div class="flex flex-col items-start gap-x-2">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">{data.menu.user.name}</div>
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">{data.menu.user.email}</div>
                </div>
                
                <div class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </div>
            </div>
        </aside>
        
    <div class="ml-64 w-full flex-1 content-start">
    {#if $navigating}
        <div class="flex flex-col items-center justify-center w-full h-screen">
            <span class="loading loading-spinner loading-sm"></span>
        </div>
    {:else}

    <div class="flex flex-col">
        <Breadcrumbs/>
        <slot/>
    </div>
    {/if}
    </div>
    <Toaster expand={true} position="top-center" richColors/>
</div>