<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        name: null,
        code: null,
        grade: null,
    }

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
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Grade</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}></UniversalSetupTable>
</div>