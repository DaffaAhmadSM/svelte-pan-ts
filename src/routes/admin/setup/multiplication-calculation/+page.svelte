<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

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
  const namePage = 'Multiplication Calculation Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>