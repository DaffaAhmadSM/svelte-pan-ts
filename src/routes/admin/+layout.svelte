<script>
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import Nested from './nested.svelte';
	import { navigating } from '$app/stores';
	import { Toaster } from 'svelte-sonner';
	import { menuData } from '$lib/stores/menu';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').LayoutData} data
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { data, children } = $props();
	menuData.set(data.menu);
	let menu = $derived($menuData.menu);

	let timer;
	let search = $state();
	let loading = false;
	let dataMenuSearch = $state([]);

	// Filter function
    function searchMenu(menu, query) {
        if (!query) return menu;

        function search(items) {
			if (!Array.isArray(items)) return [];
            return items
                .map(item => {
                    if (item.name.toLowerCase().includes(query.toLowerCase())) {
                        return item;
                    }
                    if (item.children) {
                        const filteredChildren = search(item.children);
                        if (filteredChildren.length) {
                            return { ...item, children: filteredChildren };
                        }
                    }
                    return null;
                })
                .filter(item => item !== null);
        }

        return search(menu);
    }

	async function handleSearchMenu() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (search === '') {
                dataMenuSearch = [];
                loading = false;
                return;
            }

            loading = true;

            // Perform search
            dataMenuSearch = searchMenu(menu, search);
            loading = false;
        }, 500);
    }
</script>

<div class="flex flex-row text-wrap text-start font-poppins">
	<aside
		class="fixed left-0 top-0 flex h-screen min-w-64 max-w-64 flex-col overflow-y-scroll bg-slate-100"
	>
		<div class="flex items-center justify-center mt-3 border-b-2 pb-6">
			<p>
				LOGO HERE
			</p>
		</div>
		<div id="profile" class="space-y-3 p-6">
			<img
			src={"https://api.dicebear.com/9.x/initials/svg?seed=" + data.menu.user.name}
			alt="Avatar user"
			class="w-10 md:w-16 rounded-full mx-auto"
			/>
			<div>
			<h2
				class="font-medium text-xs md:text-sm text-center text-teal-500"
			>
			{data.menu.user.name}
			</h2>
			<p class="text-xs text-gray-500 text-center">{data.menu.user.email}</p>
			</div>
		</div>
		<div
            class="flex rounded-md focus-within:ring-2 p-2"
          >
            <input
              type="text"
              class="w-full rounded-tl-md rounded-bl-md px-2 py-3 text-sm text-gray-600 focus:outline-hidden"
              placeholder="Search"
			  bind:value={search}
			  oninput={handleSearchMenu}
            />
          </div>
		<div class="flex flex-col overflow-y-scroll px-3 py-4">
			{#if dataMenuSearch.length > 0}
				{#each dataMenuSearch as item}
					<ul class="menu text-md flex flex-col font-medium">
						<Nested menu={item} open={true} highlightedquery={search}/>
					</ul>
				{/each}
			{:else}
			{#each menu as item}
				<ul class="menu text-md flex flex-col font-medium">
					<Nested menu={item} />
				</ul>
			{/each}
			{/if}
		</div>
		<div class="mt-auto flex flex-row items-center justify-between bg-slate-50 py-3 px-2">
			<div class="flex flex-col items-start gap-x-2">
				<div class="text-sm font-medium text-gray-700 dark:text-gray-200">
					{data.menu.user.name}
				</div>
				<div class="text-sm font-medium text-gray-700 dark:text-gray-200">
					{data.menu.user.email}
				</div>
			</div>
			<!-- <button on:click={toggleMode}>Toggle Mode</button> -->
			<div
				class="rotate-180 text-gray-500 transition-colors duration-200 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rtl:rotate-0"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
			</div>
		</div>
	</aside>

	<div class="ml-64 w-full flex-1 content-start">
		{#if $navigating}
			<div class="flex h-screen w-full flex-col items-center justify-center">
				<span class="loading loading-spinner loading-sm"></span>
			</div>
		{:else}
			<div class="flex flex-col">
				<!-- <Breadcrumbs /> -->
				{@render children?.()}
			</div>
		{/if}
	</div>
	<Toaster expand={true} position="top-center" richColors />
</div>
