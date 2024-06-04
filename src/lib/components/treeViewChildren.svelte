<script>
    import {TreeViewItem} from '@skeletonlabs/skeleton';

    /**
     * @type {import('@skeletonlabs/skeleton').TreeViewNode[]}
     */
    export let children;
    export let bindGroup;
</script>

{#each children as child}
    <TreeViewItem bind:group={bindGroup} name="menu" value={child.id}>
        <p>{child.content}</p>
            <svelte:fragment slot="children">
                {#if child.children}
                    <svelte:self children={child.children} bindGroup={bindGroup} />
                {/if}
            </svelte:fragment>
    </TreeViewItem>
{/each}
    