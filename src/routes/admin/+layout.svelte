<script>
	import Nested from './nested.svelte';
    /**
     * @type {import('./$types').LayoutData} 
     * */
    export let data;
    let menu = data.menu;
</script>

<div class="flex flex-row">
    <aside class="min-w-14 w-60 h-screen overflow-scroll">
        <div class="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {#each menu as item}
            <ul class="space-y-2 font-medium flex flex-col">
                <Nested menu={item}/>
            </ul>
            {/each}
        </div>
    </aside>
    <slot/>
</div>