<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        code: null,
        description: null,
    }

    let tableList = [
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "description",
            id: "description",
            type: "text"
        }
    ]


  const fetchUrl = '/working-hour/list';
  const updateUrl = '/working-hour/update';
  const deleteUrl = '/working-hour/delete';
  const createUrl = '/working-hour/create';
  const detailUrl = '/working-hour/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Working Hour Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>