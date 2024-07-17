<script>
	import { page } from '$app/stores';
    import '../app.css';
</script>

<main class="h-screen w-full flex flex-col justify-center items-center dark:bg-[#1A2238]">
	<h1 class="text-9xl font-extrabold dark:text-white tracking-widest">{$page.status}</h1>
    {#if !$page.error.debug}
	<div class="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
		{$page.error.message}
	</div>
    {/if}
	<button class="mt-5">
      <a
      href="/admin"
        class="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span class="relative block px-8 py-3 bg-[#1A2238] border border-current">
          Go Home
        </span>
      </a>
    </button>

   
</main>

{#if $page.error.debug}
<pre class="mt-5">
    {$page.error.message}
</pre>
{/if}