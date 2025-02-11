<!-- @migration-task Error while migrating Svelte code: Cannot use explicit children snippet at the same time as implicit children content. Remove either the non-whitespace content or the children snippet block
https://svelte.dev/e/snippet_conflict -->
<script>
    import TreeViewChildren from './treeViewChildren.svelte';
    import {TreeViewItem} from '@skeletonlabs/skeleton';
    

    
    
    
    
    /**
     * @typedef {Object} Props
     * @property {import('@skeletonlabs/skeleton').TreeViewNode[]} children
     * @property {any} bindGroup
     * @property {number[]} [createGroup]
     * @property {number[]} [updateGroup]
     * @property {number[]} [deleteGroup]
     */

    /** @type {Props} */
    let {
        children,
        bindGroup = $bindable(),
        createGroup = $bindable([]),
        updateGroup = $bindable([]),
        deleteGroup = $bindable([])
    } = $props();
</script>

{#each children as child}
    <TreeViewItem bind:group={bindGroup} name="menu" value={child.id}>
        <p>{child.content}</p>
        {#snippet children()}
            
                <div class="flex gap-2">
                    <label><input type="checkbox" value={child.id} bind:group={createGroup}>create</label>
                    <label><input type="checkbox" value={child.id} bind:group={updateGroup}>update</label>
                    <label><input type="checkbox" value={child.id} bind:group={deleteGroup}>delete</label>
                </div>
            {#if child.children}
                <TreeViewChildren children={child.children} bind:bindGroup={bindGroup} bind:createGroup={createGroup} bind:updateGroup={updateGroup} bind:deleteGroup={deleteGroup} />
            {/if}
            
            {/snippet}
    </TreeViewItem>
{/each}
    