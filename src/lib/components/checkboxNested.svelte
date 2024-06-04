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
     let checkedNodes = ["2"];
    /**
     * @type {String[]} 
     */
    let indeterminateNodes = ["1"];

    $: {
        console.log('Checked Nodes ' + checkedNodes);
        console.log('Indeterminate Nodes ' + indeterminateNodes);
    }
    /**
     * @type {String[]} 
     */
    let medums = ['books', 'movies'];
    let books = ['2']

    $: {
        console.log('Mediums ' + medums);
        console.log('Books ' + books);
    }
</script>

<div class="modal-box" data-theme="garden">
    <RecursiveTreeView selection 
	multiple 
	relational 
	nodes={menu} 
	bind:checkedNodes={checkedNodes}
    bind:indeterminateNodes={indeterminateNodes}/>

    <!-- <TreeView selection multiple>
        <TreeViewItem bind:group={checkedNodes} name="checkedNodes" value="1">
            <svelte:fragment slot="lead">(icon)</svelte:fragment>
            <p>Books</p>
            <svelte:fragment slot="children">
                <TreeViewItem bind:group={checkedNodes} name="checkedNodes" value="1">
                    <p>Clean Code</p>
                </TreeViewItem>
                <TreeViewItem bind:group={checkedNodes} name="checkedNodes" value="2">
                    <p>The Clean Coder</p>
                </TreeViewItem>
                <TreeViewItem bind:group={checkedNodes} name="checkedNodes" value="3">
                    <p>The Art of Unix Programming</p>
                </TreeViewItem>
            </svelte:fragment>
        </TreeViewItem>
    </TreeView> -->

    <!-- <TreeView selection multiple>
        {#each menu as item}
        <TreeViewItem bind:group={checkedNodes} name="checkedNodes" value="2">
            <p>{item.content}</p>
            <svelte:fragment slot="children">
                {#if item.children}
                        <TreeViewChildren bindGroup={checkedNodes} children={item.children}/>
                {/if}
            </svelte:fragment>
        </TreeViewItem>
        {/each}
    </TreeView> -->
</div>