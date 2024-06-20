<script>
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { openModal, editForm } from "$lib/stores/formModal";
    import { getContext, onMount } from "svelte";
    import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	export let tableData;
    export let header = [
        "name",
        "email"
    ];
    export let permissions = {
        "create" : 1,
        "update" : 1,
        "delete" : 1
    };

    

    export let editData = null;

    let observer;
    let loading = false;
    
    async function loadMore() {
        try {
        if(!tableData.next_page_url) return;
		// @ts-ignore
        loading = true
		const loadMoreTableData = await fetch(tableData.next_page_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
        });
        const data = await loadMoreTableData.json();
        tableData.data = [...tableData.data, ...data.data.data];
        tableData.next_page_url = data.data.next_page_url;

        loading = false
        } catch (error) {
            loading = false
        }
        
	}
    
	$: {
        if (observer) {
            infiniteScroll({
                fetch: loadMore,
                element: observer,
            });
        }
    }
    
</script>

{#if permissions.create}
        <slot name="add-row">
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  openModal.set(true)}>Add</button>
            </div>
        </slot>
{/if}

<div class="overflow-x-auto">
    <table class="table">
        <thead>
            <tr>
                {#each Object.values(header) as columnHeading}
                    <th>{columnHeading}</th>
                {/each}
                    <th>Action</th>
            <tr/>
        </thead>
        <tbody>
            {#each tableData.data as row, i}
                    <tr class="hover">
                        {#each Object.entries(row) as [title, column]}
                            {#if title !== "id"}
                                <td>{column}</td>
                            {/if}
                        {/each}
                            <td>
                        {#if permissions.update}
                                <button class="btn btn-warning hover:btn-error" on:click={() => { 
                                    editForm.set(true)
                                    editData = row
                                }}
                                >Edit</button>
                                <slot name="user-menu-edit" prop={row}></slot>
                        {/if}
                        {#if permissions.delete}
                                <slot name="delete-row" prop={row}></slot>
                        {/if}
        
                            </td>
        
                    </tr>
            {/each}
        </tbody>
        <div id="observer" class="h-3" bind:this={observer}></div>
        
    </table>
    {#if loading}
        <div class="loading"></div>
    {/if}
</div>

