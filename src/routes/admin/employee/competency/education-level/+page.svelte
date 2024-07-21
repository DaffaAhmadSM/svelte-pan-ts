<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        level: null,
        description: null,
    }

    let tableList = [
        {
            name: "level",
            id: "level",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]


  const fetchUrl = '/education-level/list';
  const updateUrl = '/education-level/update';
  const deleteUrl = '/education-level/delete';
  const createUrl = '/education-level/create';
  const detailUrl = '/education-level/detail';
  const namePage = 'Education Level';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>