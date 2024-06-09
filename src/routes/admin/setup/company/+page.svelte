<script>
    import { fade } from 'svelte/transition';
    import { openModal, editForm } from '$lib/stores/formModal';
    import FormModal from '$lib/components/form-modal.svelte';
    import EditFormModal from '$lib/components/edit-form-modal.svelte';
    import Table from '$lib/components/table.svelte';
    import { createDialog, melt } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let tableData = data.list.data.data;
    let header = data.list.header;
    let permission = data.permissions.permission;

    setContext("crud", {
        confirmDelete
    });

    const {elements: {overlay, content, title, description, close}} = createDialog({
        forceVisible: true,
        open: openModal
    });

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

    const {elements: {overlay: editOverlay, content: editContent, title: editTitle, description: editDescription, close: editClose}} = createDialog({
        forceVisible: true,
        open: editForm
    });

    let editFormData = {
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
    
    let EditTableList = [
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
        name: "Bank Account Number",
        id: "bank_account",
        type: "text",
      }
    ]

    let AddTableList = [
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

    /**
     * 
     * @param {number} id
     */
    function deleteList(id) {
        console.log(id);
    }

    /**
     * 
     * @param {number} id
     */
    async function updateTable(id) {
      const post = fetch (import.meta.env.VITE_API_URL + `/api/company/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    }

    function confirmDelete(id){
    if(confirm('Are you sure you want to delete this user?')){
      deleteList(id);
    }
  }

  let addModal;

  const fetchUrl = '/company/list';
  const updateUrl = '/company/update';
  const deleteUrl = '/company/delete';
  const createUrl = '/company/create';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Company Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} createUrl={createUrl} formData={formData} AddTableList={AddTableList}></UniversalSetupTable>
    
</div>