<script>
    import { getModalStore} from '@skeletonlabs/skeleton';
			
    const modalStore = getModalStore();
    import Table from '$lib/components/table.svelte';
    export let data;

    let tableData = data.users.data.data;
    let header = data.users.header;
    let permission = data.permissions.permission;

    /**
     * @type {import('@skeletonlabs/skeleton').ModalSettings}
     */
    const modal = {
        type: 'prompt',
	// Data
	    title: 'Enter Name',
        
    }

    function openModal(){
        modalStore.trigger(modal);
    }
</script>
<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">User Setup</h1>
    </div>
    <Table tableData={tableData} header={header} permissions={permission}/>
    <button on:click={openModal}>click</button>
</div>