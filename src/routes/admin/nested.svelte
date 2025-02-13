<script>
	import Nested from './nested.svelte';
	import { slide } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import { page } from '$app/state';
	/**
	 * @typedef {Object} Props
	 * @property {any} menu
	 * @property {boolean} [open]
	 * @property {any} [highlightedquery]
	 */

	/** @type {Props} */
	let { menu, open = $bindable(false), highlightedquery = null } = $props();
	function highlightText(text) {
		if (!highlightedquery) return text;
		const regex = new RegExp(highlightedquery, 'gi');
		return text.replace(regex, '<mark class="highlight">' + highlightedquery + '</mark>');
	}
</script>

{#if menu.children}
	<li>
		<details
			class={page.url.pathname == menu.url ? 'bg-secondary-400' : 'hover:bg-surface-200'}
			{open}
		>
			<summary
				class="flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer"
			>
				<span class="gap-2 text-gray-900" id="highlightcheck">{@html highlightText(menu.name)}</span
				>
				<svg
					class="h-5 w-5 text-gray-500 transition"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
					>
					</path>
				</svg>
			</summary>
			<article class="mx-4">
				<ul class="mt-4 flex flex-col gap-2 border-l pl-2" transition:slide={{ easing: expoInOut }}>
					{#each menu.children as item}
						<Nested menu={item} {highlightedquery} {open} />
					{/each}
				</ul>
			</article>
		</details>
	</li>
{/if}
{#if !menu.children}
	<li class="{page.url.pathname == menu.url ? 'bg-blue-50' : 'hover:bg-blue-50'} block">
		<a class="block rounded-xl p-3" href="{menu.url}?menuid={menu.id}"
			>{@html highlightText(menu.name)}</a
		>
	</li>
{/if}

<style>
	details[open] > summary > svg {
		transform: rotate(90deg);
	}
</style>
