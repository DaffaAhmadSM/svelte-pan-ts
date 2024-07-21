

<script>
  import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  import {getCookie} from '$lib/helpers/getLocalCookies';
  import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger.js';
	import { setContext } from 'svelte';
  import CheckboxNested from '$lib/components/checkboxNested.svelte';
	import {Dialog} from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { menuData } from '$lib/stores/menu';
	import { get } from 'svelte/store';
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
  let userSelected;
  function setUserSelected(id){
    userSelected = id;
  }

  async function openPermisModal(id){
    menuCreate = [];
    menuUpdate = [];
    menuDelete = [];
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
      menuCreate = response.menuCreate;
      menuUpdate = response.menuUpdate;
      menuDelete = response.menuDelete;
      dialogPermis=true;
      return toastTrigger("Data Loaded", toastId, 200, 500);
    }

    if(!menu_list.ok){
      return toastTrigger(response.message, toastId, menu_list.status, 2000);
    }
  }

  let menuCreate;
  let menuUpdate;
  let menuDelete;

  async function updatePermiss(){
    const toastId = toastTriggerLoading('Loading...');
    let array = [];

    chekcmenu.forEach(id => {
      array.push({
        user_id : userSelected,
        menu_id: id,
        create: menuCreate.includes(id) ? 1 : 0,
        update: menuUpdate.includes(id) ? 1 : 0,
        delete: menuDelete.includes(id) ? 1 : 0
      });
    });

    const update = await fetch(import.meta.env.VITE_API_URL + '/update-menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('token')
      },
      body: JSON.stringify({data: array, user_id: userSelected})
    }).then((res) => {
      if(res.ok){
        dialogPermis = false;
        return toastTrigger("Permission updated", toastId, res.status, 2000);
      }
      return res.json().then((err) => {
        toastTrigger(err.message, toastId, res.status, 2000);
      });
    }).catch((err) => {
      toastTrigger("Failed to update permission", toastId, 500, 2000);
    });



    if (userSelected == data.menu.user.id){
      updateMenu();
    }
  }

  async function updateMenu(){
    const menu_list = await fetch(import.meta.env.VITE_API_URL + '/menu', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
    });
    let response = await menu_list.json();
    if(menu_list.ok){
      console.log("oke");
      menuData.set(response);
    }
  }

  let formData = {
        name: null,
        email: null,
        password: null,
    }

    let tableList = [
      {
        name: "name",
        id: "name",
        required: true,

        type: "text"
      },
      {
        name: "email",
        id: "email",
        required: true,
        type: "text"
      },
      {
        name: "password",
        id: "password",
        required: true,
        type: "text"
      },
    ]

  const fetchUrl = '/user/list';
  const updateUrl = '/user/update';
  const deleteUrl = '/user/delete';
  const createUrl = '/user/create';
  const detailUrl = '/user/detail';
  const searchUrl = '/user/search';
  const namePage = 'User Setup';
</script>
<Dialog.Root bind:open={dialogPermis}>
  <Dialog.Portal>
    <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
      />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <div class="flex flex-col">
          <CheckboxNested bind:menu={listMenu} bind:checkedNodes={chekcmenu} bind:createGroup={menuCreate} bind:updateGroup={menuUpdate} bind:deleteGroup={menuDelete} />
          <div class="mt-6 flex justify-end gap-4">
            <button
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                on:click={() => {
                    dialogPermis = false;
                }}
            >
              Cancel

            </button>
            <button
            type="submit"
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
              on:click={() => {
                updatePermiss();
              }}
            >
              Save changes
            </button>
                </div>
        </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<div class="table-container">
  <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} searchUrl={searchUrl} formData={formData} tableList={tableList} {namePage}>
    <button slot="user-menu-edit" class="btn" on:click={()=> {openPermisModal(id); setUserSelected(id)}} let:id={id}>Permission</button>

  </UniversalSetupTable>
</div>
