<script>
	import CheckboxNested from '$lib/components/checkboxNested.svelte';
	import TreeViewChildren from './treeViewChildren.svelte';
	import {TreeView} from '@skeletonlabs/skeleton';
    /**
     * @type {import('@skeletonlabs/skeleton').TreeViewNode[]}
     */
    export let menu = [
        {
        id: '0',
        content: 'menu',
        children: [
            {
                id: '1',
                content: 'Item 1',
                children: [
                    {
                        id: '2',
                        content: 'Item 1.1',
                        children: []
                    },
                    {
                        id: '3',
                        content: 'Item 1.2',
                    }
                ]
            },
            {
                id: '4',
                content: 'Item 2',
                children: [
                    {
                        id: '5',
                        content: 'Item 2.1',
                    },
                    {
                        id: '6',
                        content: 'Item 2.2',
                    }
                ]
            }
        ]
    }
];

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
    console.log(checkedNodes);
    
  }
  function isChecked(item) {
    return checkedNodes.includes(item);
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