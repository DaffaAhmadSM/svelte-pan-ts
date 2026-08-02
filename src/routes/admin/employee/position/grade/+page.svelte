<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

    let formData = $state({
        name: null,
        code: null,
        grade: null,
    })

    let tableList = [
        {
            name: "Name",
            id: "name",
            type: "text"
        },
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "Grade",
            id: "grade",
            type: "text"
        },
    ]


  const fetchUrl = '/grade/list';
  const updateUrl = '/grade/update';
  const deleteUrl = '/grade/delete';
  const createUrl = '/grade/create';
  const detailUrl = '/grade/detail';
  const namePage = 'Grade';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}></UniversalSetupTable>
</div>