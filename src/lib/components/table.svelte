<script>
	import { openModal, editForm } from "$lib/stores/formModal";
    import { getContext } from "svelte";

    const {confirmDelete} = getContext("crud");
	export let tableData = [
			{
				id : "dolorem",
				name : "ipsum",
				email : "quia"
			},
			{
				id : "amet",
				name : "consectetur",
				email : "adipisci"
			}
		];
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
    
</script>

{#if permissions.create}
        <slot name="add">
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
            {#each tableData as row}
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
                            <slot name="user-menu-edit"></slot>
                    {/if}
                    {#if permissions.delete}
                            <button class="btn btn-primary hover:btn-error" on:click={()=>{confirmDelete(row.id)}}>Delete</button>
                    {/if}
    
                        </td>
    
                </tr>
            {/each}
        </tbody>
    </table>
</div>

