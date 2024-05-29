<script>
    import { createDialog, melt } from '@melt-ui/svelte';
    import Table from '$lib/components/table.svelte';
	import FormModal from '$lib/components/form-modal.svelte';
    export let data;

    let tableData = data.list.data.data;
    let header = data.list.header;
    let permission = data.permissions.permission;
</script>
<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">User Setup</h1>
    </div>
    <Table tableData={tableData} header={header} permissions={permission}/>
    <FormModal />
</div>

