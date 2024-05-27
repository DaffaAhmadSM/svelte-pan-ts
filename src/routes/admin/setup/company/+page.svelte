<script>
    import { page } from "$app/stores";
    import TableData from "$lib/components/table.svelte";
</script>
<div class="table-container">
    <div class="flex w-full flex-col justify-center items-center">
        <button>Dashboard</button>
        <p>This is a dashboard route</p>
        <p>Only authenticated users can access this page</p>
    </div>
    <TableData/>
</div>