<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
    }

    let tableList = [
    ]


  const fetchUrl = '/customer-invoice/list';
  const updateUrl = '';
  const deleteUrl = '';
  const createUrl = '';
  const detailUrl = '';
  const namePage = 'Customer Invoice';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}></UniversalSetupTable>
</div>