<script>
	import { page } from '$app/state';
	import '../app.css';
</script>

<main class="flex h-screen w-full flex-col items-center justify-center dark:bg-[#1A2238]">
	<h1 class="text-9xl font-extrabold tracking-widest dark:text-white">{page.status}</h1>
	{#if !page.error.debug}
		<div class="absolute rotate-12 rounded bg-[#FF6A3D] px-2 text-sm">
			{page.error.message}
		</div>
	{/if}
	<button class="mt-5">
		<a
			href="/admin"
			class="group relative inline-block text-sm font-medium text-[#FF6A3D] focus:ring-3 focus:outline-hidden active:text-orange-500"
		>
			<span
				class="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
			></span>

			<span class="relative block border border-current bg-[#1A2238] px-8 py-3"> Go Home </span>
		</a>
	</button>
</main>

{#if page.error.debug}
	<pre class="mt-5">
    {page.error.message}
</pre>
{/if}
