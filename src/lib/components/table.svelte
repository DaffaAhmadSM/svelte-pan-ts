<script>
	import { openModal, editForm } from "$lib/stores/formModal";
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

    export let editData = {
        id : null,
        email : null,
        name : null,
        password : null
    };
</script>

{#if permissions.create}
    <div class="m-2 flex justify-end">
        <button class="p-3 bg-info rounded-lg" on:click={() =>  openModal.set(true)}>Add</button>
    </div>
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
                                editData.id = row.id;
                                editData.email = row.email;
                                editData.name = row.name;
                                editData.password = row.password;
                            } 
                        }>Edit</button>
                    {/if}
                    {#if permissions.delete}
                            <button class="btn btn-primary hover:btn-error">Delete</button>
                    {/if}
    
                        </td>
    
                </tr>
            {/each}
        </tbody>
    </table>
</div>

