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
  const namePage = 'Working Hour Setup';
</script>

<div class="table-container">
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList} {namePage}></UniversalSetupTable>
</div>