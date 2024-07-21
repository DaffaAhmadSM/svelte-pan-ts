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


  const fetchUrl = '/classification-of-tax-payer/list';
  const updateUrl = '/classification-of-tax-payer/update';
  const deleteUrl = '/classification-of-tax-payer/delete';
  const createUrl = '/classification-of-tax-payer/create';
  const detailUrl = '/classification-of-tax-payer/detail';
  const namePage = 'Classification of Tax Payer Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>