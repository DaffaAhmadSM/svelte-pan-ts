<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        classification: null,
        description: null,
    }

    let tableList = [
        {
            name: "Classification",
            id: "classification",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]


  const fetchUrl = '/certificate-classification/list';
  const updateUrl = '/certificate-classification/update';
  const deleteUrl = '/certificate-classification/delete';
  const createUrl = '/certificate-classification/create';
  const detailUrl = '/certificate-classification/detail';
  const namePage = 'Certificate Classification';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>