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
            name: "Description",
            id: "description",
            type: "text"
        }
    ]


  const fetchUrl = '/unit-of-measure/all';
  const updateUrl = '/unit-of-measure/update';
  const deleteUrl = '/unit-of-measure/delete';
  const createUrl = '/unit-of-measure/create';
  const detailUrl = '/unit-of-measure/detail';
  const namePage = 'Unit Of Measure Setup';
</script>

<div class="table-container">
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList} {namePage}></UniversalSetupTable>
</div>