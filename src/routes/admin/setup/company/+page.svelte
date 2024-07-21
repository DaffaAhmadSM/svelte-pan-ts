<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        code: null,
        name: null,
        country: null,
        city: null,
        post_code: null,
        address: null,
        phone: null,
        fax: null,
        email: null,
        homepage: null,
        img: null,
        bank_name: null,
        bank_account: null,
    }

    let tableList = [
      {
        name: "code",
        id: "code",
      
        type: "text"
      },
      {
        name: "name",
        id: "name",
      
        type: "text"
      },
      {
        name: "country",
        id: "country",
        type: "text"
      },
      {
        name: "city",
        id: "city",
      
        type: "text"
      },
      {
        name: "Post Code",
        id: "post_code",
        type: "text"
      },
      {
        name: "address",
        id: "address",
        type: "text",
      },
      {
        name: "phone",
        id: "phone",
        type: "text",
      },
      {
        name: "fax",
        id: "fax",
        type: "text",
      },
      {
        name: "email",
        id: "email",
        type: "text",
      },
      {
        name: "homepage",
        id: "homepage",
        type: "text",
      },
      {
        name: "Picture",
        id: "img",
        type: "file",
      },
      {
        name: "Bank Name",
        id: "bank_name",
        type: "text",
      },
      {
        name: "Bank Address",
        id: "bank_address",
        type: "text",
      },
      {
        name: "Bank Account Number",
        id: "bank_account_no",
        type: "text",
      }
    ]


  const fetchUrl = '/company/list';
  const updateUrl = '/company/update';
  const deleteUrl = '/company/delete';
  const createUrl = '/company/create';
  const detailUrl = '/company/detail';
  const searchUrl = '/company/search';
  const namePage = 'Company Setup';
</script>

<div class="table-container">
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} searchUrl={searchUrl} formData={formData} tableList={tableList} {namePage}></UniversalSetupTable>
</div>