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
</script>

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
            </tr>
        {/each}
    </tbody>
</table>

