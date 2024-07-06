

<script>
  import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  import {getCookie} from '$lib/helpers/getLocalCookies';
  import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger.js';
	import { setContext } from 'svelte';
  import CheckboxNested from '$lib/components/checkboxNested.svelte';
	import {Dialog} from 'bits-ui';
  export let data;
    let dialogPermis = false;

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
    const toastId = toastTriggerLoading('Loading...');
    const menu_list = await fetch(import.meta.env.VITE_API_URL + '/menu/all/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
    });
    let response = await menu_list.json();
    if(menu_list.ok){
      listMenu = response.menu;
      chekcmenu = response.menuChecked;
      dialogPermis=true;
      return toastTrigger("Data Loaded", toastId, 200, 500);
    }

    if(!menu_list.ok){
      return toastTrigger(response.message, toastId, menu_list.status, 2000);
    }
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

