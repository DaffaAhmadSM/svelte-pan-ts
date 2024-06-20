

<script>
  import { fade } from 'svelte/transition';
  import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  import { createDialog, melt } from '@melt-ui/svelte';
  import Table from '$lib/components/table.svelte';
  import FormModal from '$lib/components/form-modal.svelte';
  import EditFormModal from '$lib/components/edit-form-modal.svelte';
  import { editForm, openModal } from "$lib/stores/formModal";
  import {getCookie} from '$lib/helpers/getLocalCookies';
  import { toastTrigger } from '$lib/helpers/toasterTrigger.js';
	import { setContext } from 'svelte';
  import CheckboxNested from '$lib/components/checkboxNested.svelte';
	import {Dialog} from 'bits-ui';
  export let data;

    $: tableData = data.list.data;
    let header = data.list.header;
    let permission = data.permissions.permission;
    let dialogPermis = false;
    

    const {
    elements: {
      overlay,
      content,
      title,
      description,
      close,
    },
  } = createDialog({
    forceVisible: true,
    open: openModal,
  });

  const {
    elements: {
      overlay: editOverlay,
      content: editContent,
      title: editTitle,
      description: editDescription,
      close: editClose,
    },
  } = createDialog({
    forceVisible: true,
    open: editForm,
  });


  let editData = {
    id : null,
    email : null,
    name : null,
    password : null
  };

  async function fetchTable(){
    const get = await fetch(import.meta.env.VITE_API_URL + '/user/list' + '?perpage=' + 50, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
    })
    return await get.json();
  }


  async function getTable(){
    const get = await fetch(import.meta.env.VITE_API_URL + '/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: JSON.stringify(formData),
    })

    const datajson = await get.json();
    if(get.ok){
      let newtable = fetchTable();
      data.list = await newtable;
      openModal.set(false);
      formData = {
        email: '',
        name: '',
        password: '',
      };
    }

    if(get.status === 400){
      toastTrigger(datajson.message, get.status);
    }

    if(get.status === 401){
      window.location.href = '/login';
    }
  }

  async function updateTable(){
    const post = await fetch(import.meta.env.VITE_API_URL + '/user/update/' + editData.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: JSON.stringify(editData),
    })

      const datajson = await post.json();
    if(post.ok){
      editForm.set(false);
      let newtable = fetchTable();
      data.list = await newtable;
      toastTrigger('User updated successfully', 200);
    }

    if(post.status === 400){
      toastTrigger(datajson.message, post.status);
    }

    if(post.status === 401){
      window.location.href = '/login';
    }
  }

  function confirmDelete(id){
    if(confirm('Are you sure you want to delete this user?')){
      deleteList(id);
    }
  }
  /**
   * 
   * @param {number} id
   * @returns {Promise<void>}
   */
  async function deleteList(id){
    const del = await fetch(import.meta.env.VITE_API_URL + '/user/delete/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
    })

    const datajson = await del.json();

    if(del.ok){
      let newtable = fetchTable();
      data.list = await newtable;
      toastTrigger('User deleted successfully', 200);
    }

    if(del.status !== 200){
      toastTrigger(datajson.message, del.status);
    }
  }

  let listMenu;
  let chekcmenu;
  async function openPermisModal(id){
    const menu_list = await fetch(import.meta.env.VITE_API_URL + '/menu/all/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
    });
    /**
     * @typedef {Object} Menu
     * @prop {String} status
     * @prop {String} message
     * @prop {import('@skeletonlabs/skeleton').TreeViewNode[]} menu
     * @prop {String[]} menuChecked
     */

    /**
    * @type {Menu}
    */
    let response = await menu_list.json();
    listMenu = response.menu;
    chekcmenu = response.menuChecked;
    dialogPermis=true
  }

  setContext('crud', {confirmDelete});

  let formData = {
        name: null,
        email: null,
        password: null,
    }

    let tableList = [
      {
        name: "name",
        id: "name",
      
        type: "text"
      },
      {
        name: "email",
        id: "email",
        type: "text"
      },
      {
        name: "password",
        id: "password",
        type: "text"
      },
    ]

  const fetchUrl = '/user/list';
  const updateUrl = '/user/update';
  const deleteUrl = '/user/delete';
  const createUrl = '/user/create';
  const detailUrl = '/user/detail';
  const searchUrl = '/user/search';
</script>
<Dialog.Root bind:open={dialogPermis}>
  <Dialog.Portal>
    <Dialog.Overlay
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
      />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
      <CheckboxNested bind:menu={listMenu} bind:checkedNodes={chekcmenu} />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<div class="table-container">
  <div class="flex w-full flex-col mb-6">
      <h1 class="text-5xl">User Setup</h1>
  </div>
  <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} searchUrl={searchUrl} formData={formData} tableList={tableList}>
    <button slot="user-menu-edit" class="btn" on:click={()=> {openPermisModal(id); }} let:id={id}>Edit Permission</button>

  </UniversalSetupTable>
</div>

<!-- <div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">User Setup</h1>
    </div>
    <Table bind:tableData={tableData} header={header} permissions={permission} bind:editData={editData}>
      <button slot="user-menu-edit" class="btn" on:click={()=> {openPermisModal(row.id); }} let:prop={row}>Edit Permission</button>

      <button slot="delete-row" class="btn btn-primary hover:btn-error" on:click={()=>{confirmDelete(row.id)}} let:prop={row}>Delete</button>
      <div slot="add-row" class="m-2 flex justify-end">
        
        <button class="p-3 bg-info rounded-lg" on:click={() =>  openModal.set(true)}>Add</button>
      </div>
    </Table>



    

    <FormModal>
        
      <div
        use:melt={$overlay}
        class="fixed inset-0 z-50 bg-black/50"
        transition:fade={{ duration: 150 }}
      />
      <div
        class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
              p-6 shadow-lg"
        use:melt={$content}
      >
        <h2 use:melt={$title} class="m-0 text-lg font-medium text-primary-400">
          Add User
        </h2>
        <p use:melt={$description} class="mb-6 text-sm text-black">
            Fill in the form below to add a new user.
        </p>

        
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="name"> Name </label>
            <input
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id="name"
            required
            bind:value={formData.name}
            />
          </fieldset>
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="email">
              Email
            </label>
            <input
            type="email"
              class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
              id="email"
              required
              bind:value={formData.email}
            />
          </fieldset>
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="Password">
            Password
            </label>
            <input
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id="password"
            required
            bind:value={formData.password}
            />
          </fieldset>
        
      
          <div class="mt-6 flex justify-end gap-4">
            <button
              use:melt={$close}
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
            >
              Cancel
            </button>
            <button
            type="submit"
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
              on:click={getTable}
            >
              Save changes
            </button>
          </div>
          <button
            use:melt={$close}
            aria-label="close"
            class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                    items-center justify-center rounded-full p-1 text-magnum-800
                    hover:bg-magnum-100 focus:shadow-magnum-400"
          >
        </button>
      </div>
    </FormModal>

    <EditFormModal>
      <div
        use:melt={$editOverlay}
        class="fixed inset-0 z-50 bg-black/50"
        transition:fade={{ duration: 150 }}
      />
      <div
        class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
              p-6 shadow-lg"
        use:melt={$editContent}
      >
        <h2 use:melt={$editTitle} class="m-0 text-lg font-medium text-primary-400">
          Add User
        </h2>
        <p use:melt={$editDescription} class="mb-6 text-sm text-black">
            Fill in the form below to add a new user.
        </p>
            <fieldset class="mb-4 flex items-center gap-5">
              <label class="w-[90px] text-right text-black" for="name"> Name </label>
              <input
              class="inline-flex h-8 w-full flex-1 items-center justify-center
                          rounded-sm border border-solid px-3 leading-none text-black"
              id="name"
              bind:value={editData.name}
              />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
              <label class="w-[90px] text-right text-black" for="email">
                Email
              </label>
              <input
              type="email"
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                          rounded-sm border border-solid px-3 leading-none text-black"
                id="email"
                bind:value={editData.email}
              />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
              <label class="w-[90px] text-right text-black" for="Password">
              Password
              </label>
              <input
              class="inline-flex h-8 w-full flex-1 items-center justify-center
                          rounded-sm border border-solid px-3 leading-none text-black"
              id="password"
              bind:value={editData.password}
              />
            </fieldset>
            <div class="mt-6 flex justify-end gap-4">
              <button
                use:melt={$editClose}
                class="inline-flex h-8 items-center justify-center rounded-sm bg-primary
                 px-4 font-medium leading-none text-zinc-600"
              >
                Cancel
              </button>
              <button
              type="submit"
                class="inline-flex h-8 items-center justify-center rounded-sm
                          bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
                on:click={updateTable}
              >
                Save changes
              </button>
            </div>
            <button
              use:melt={$editClose}
              aria-label="close"
              class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                      items-center justify-center rounded-full p-1 text-magnum-800
                      hover:bg-magnum-100 focus:shadow-magnum-400"
            >
            </button>
      </div>
    </EditFormModal>

</div> -->

