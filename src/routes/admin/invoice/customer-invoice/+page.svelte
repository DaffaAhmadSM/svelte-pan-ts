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
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
      <svelte:fragment slot="additional-action" let:row>
        <a class="" href="/admin/invoice/customer-invoice/{row.document_number}">
          <div class="flex gap-2">
            <svg fill="#3584e4" width="18px" height="18px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" stroke="#3584e4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="7.872"></g><g id="SVGRepo_iconCarrier"> <title></title> <g> <path d="M18,24H78a6,6,0,0,0,0-12H18a6,6,0,0,0,0,12Z"></path> <path d="M78,42H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path> <path d="M78,72H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path> </g> </g></svg>
            <span>Detail</span>
          </div>
        </a>
      </svelte:fragment>
    </UniversalSetupTable>
</div>