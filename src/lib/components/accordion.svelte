<script>
	import { slide } from 'svelte/transition';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet<[any]>} [parent]
     * @property {import('svelte').Snippet} [child]
     */

    /** @type {Props} */
    let { parent, child } = $props();
    let open = $state();
    let classOpen = $derived((open == true)? 'bg-red-100' : '');
    function handleClick() {
        open = !open
    }
</script>

<tr class="{classOpen}">
    {@render parent?.({ handleClick, open, })}
</tr>
{#if open}
<tr transition:slide={{duration: 300, easing: (t) => t * (2 - t)}}>
    {@render child?.()}
</tr>
{/if}
