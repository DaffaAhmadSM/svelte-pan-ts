<script>
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
</script>

<div class="m-2 flex justify-end text-white">
    <button class="p-3 bg-primary-500 rounded-lg">Add</button>
</div>
<table class="table table-hover">
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
            <tr>
                {#each Object.entries(row) as [title, column]}
                    {#if title !== "id"}
                        <td>{column}</td>
                    {/if}
                {/each}
                    <td>
                {#if permissions.update}
                        <button class="btn btn-primary">Edit</button>
                    
                {/if}
                {#if permissions.delete}
                        <button class="btn btn-danger">Delete</button>
                {/if}

                    </td>
                
            </tr>
        {/each}
    </tbody>
</table>

