<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        code: null,
        description: null,
        multiplier: null,
    }

    let tableList = [
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
        {
            name: "Multiplier",
            id: "multiplier",
            type: "number"
        }
    ]


  const fetchUrl = '/multiplication-calculation/all';
  const updateUrl = '/multiplication-calculation/update';
  const deleteUrl = '/multiplication-calculation/delete';
  const createUrl = '/multiplication-calculation/create';
  const detailUrl = '/multiplication-calculation/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Multiplication Calculation Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>