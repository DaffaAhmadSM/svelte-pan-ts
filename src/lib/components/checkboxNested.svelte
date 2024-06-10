<script>
	import TreeViewChildren from './treeViewChildren.svelte';
	import { snapValueToStep } from '@melt-ui/svelte/internal/helpers';
	import {TreeView, TreeViewItem, RecursiveTreeView } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
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
     export let checkedNodes = ["2"];
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

</script>

<div class="modal-box">

    <TreeView selection multiple>
        <TreeViewChildren bindGroup={checkedNodes} children={menu} bind:createGroup={createGroup} bind:updateGroup={updateGroup} bind:deleteGroup={deleteGroup} />
    </TreeView>
</div>