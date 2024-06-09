<script>
    import {TreeViewItem} from '@skeletonlabs/skeleton';
    

    /**
     * @type {import('@skeletonlabs/skeleton').TreeViewNode[]}
     */
    export let children;
    export let bindGroup;
    /**
     * @type {number[]} 
     */
    export let createGroup = [];
    /**
     * @type {number[]} 
     */
    export let updateGroup = [];
    /**
     * @type {number[]} 
     */
    export let deleteGroup = [];
</script>

{#each children as child}
    <TreeViewItem bind:group={bindGroup} name="menu" value={child.id}>
        <p>{child.content}</p>
        <svelte:fragment slot="children">
            <div class="flex gap-2">
                <label><input type="checkbox" value={child.id} bind:group={createGroup}>create</label>
                <label><input type="checkbox" value={child.id} bind:group={updateGroup}>update</label>
                <label><input type="checkbox" value={child.id} bind:group={deleteGroup}>delete</label>
            </div>
        {#if child.children}
            <svelte:self children={child.children} bindGroup={bindGroup} bind:createGroup={createGroup} bind:updateGroup={updateGroup} bind:deleteGroup={deleteGroup} />
        {/if}
        </svelte:fragment>
    </TreeViewItem>
{/each}
    