<script>
	import { slide } from 'svelte/transition';
    let open;
    $: classOpen = (open == true)? 'bg-red-100' : '';
    function handleClick() {
        open = !open
    }
</script>

<tr class="{classOpen}">
    <slot name="parent" handleClick={handleClick} open={open}/>
</tr>
{#if open}
<tr transition:slide={{duration: 300, easing: (t) => t * (2 - t)}}>
    <slot name="child"/>
</tr>
{/if}
