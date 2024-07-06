<script>
	import CheckboxNested from '$lib/components/checkboxNested.svelte';
    export let menu;

    /**
     * @type {String[]} 
     */
     export let checkedNodes = [];
    /**
     * @type {number[]} 
     */
    let createGroup = [];
    /**
     * @type {number[]} 
     */
    let updateGroup = [];
    /**
     * @type {number[]} 
     */
    let deleteGroup = [];
    function toggleItem(item, isChecked) {
        if (isChecked) {
            if (!checkedNodes.includes(item.id)) {
                checkedNodes = [...checkedNodes, item.id];
            }
        } else {
            checkedNodes = checkedNodes.filter(id => id !== item.id);
        }
        if (item.children) {
        item.children.forEach(child => toggleItem(child, isChecked));
        }
    
  }
</script>

    <!-- <TreeView selection multiple>
        <TreeViewChildren bind:bindGroup={checkedNodes} children={menu} bind:createGroup={createGroup} bind:updateGroup={updateGroup} bind:deleteGroup={deleteGroup} />
    </TreeView> -->

    <ul>
        {#each menu as item}
            <li>
                {#if item.children}
                <details>
                <summary>
                    <input type="checkbox" checked={checkedNodes.includes(item.id)} on:change={e => toggleItem(item, e.target.checked)} />
                    {item.content}
                </summary>
                <CheckboxNested menu={item.children} {checkedNodes}/>
                </details>
                {:else}
                    <label>
                    <input type="checkbox" checked={checkedNodes.includes(item.id)} on:change={e => toggleItem(item, e.target.checked)} />
                    {item.content}
                  </label>
                {/if}
            </li>
        {/each}
    </ul>