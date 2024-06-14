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


  const fetchUrl = '/number-sequence/all';
  const updateUrl = '/number-sequence/update';
  const deleteUrl = '/number-sequence/delete';
  const createUrl = '/number-sequence/create';
  const detailUrl = '/number-sequence/detail';
  const searchUrl = '/number-sequence/search';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Number sequence Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} searchUrl={searchUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>