<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

    let formData = {
        code: null,
        description: null,
        starting_number: null,
        ending_number: null,
        prefix: null,
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
            name: "Starting Number",
            id: "starting_number",
            type: "number"
        },
        {
            name: "Ending Number",
            id: "ending_number",
            type: "number"
        },
        {
            name: "Prefix",
            id: "prefix",
            type: "text"
        },
    ]


  const fetchUrl = '/number-sequence/list';
  const updateUrl = '/number-sequence/update';
  const deleteUrl = '/number-sequence/delete';
  const createUrl = '/number-sequence/create';
  const detailUrl = '/number-sequence/detail';
  const searchUrl = '/number-sequence/search';
  const namePage = 'Number Sequence Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} searchUrl={searchUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>