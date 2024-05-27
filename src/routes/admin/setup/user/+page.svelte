<script>
    import Table from '$lib/components/table.svelte';
    export let data;

    let tableData = data.users.data.data;
    let header = data.users.header;
</script>
<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">User Setup</h1>
    </div>
    <Table tableData={tableData} header={header}/>
</div>