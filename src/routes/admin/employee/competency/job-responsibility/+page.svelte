<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        responsibility: null,
        description: null,
        note: null,
    }

    let tableList = [
        {
            name: "Responsibility",
            id: "responsibility",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
        {
            name: "Note",
            id: "note",
            type: "text"
        },
    ]


  const fetchUrl = '/job-resposibility/list';
  const updateUrl = '/job-resposibility/update';
  const deleteUrl = '/job-resposibility/delete';
  const createUrl = '/job-resposibility/create';
  const detailUrl = '/job-resposibility/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Certificate Classification</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}></UniversalSetupTable>
</div>