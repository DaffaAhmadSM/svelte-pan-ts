

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
    <button slot="user-menu-edit" class="btn" on:click={()=> {openPermisModal(id); setUserSelected(id)}} let:id={id}>
      <svg fill="#ed333b" width="18px" height="18px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#ed333b">

        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        
        <g id="SVGRepo_iconCarrier"> <path d="M1600 1066.667c117.653 0 213.333 95.68 213.333 213.333v106.667H1920V1760c0 88.213-71.787 160-160 160h-320c-88.213 0-160-71.787-160-160v-373.333h106.667V1280c0-117.653 95.68-213.333 213.333-213.333ZM800 0c90.667 0 179.2 25.6 254.933 73.6 29.867 18.133 58.667 40.533 84.267 66.133 49.067 49.067 84.8 106.88 108.053 169.814 11.307 30.4 20.8 61.44 25.814 94.08l2.24 14.613 3.626 20.16-.533.32v.213l-52.693 32.427c-44.694 28.907-95.467 61.547-193.067 61.867-.427 0-.747.106-1.173.106-24.534 0-46.08-2.133-65.28-5.653-.64-.107-1.067-.32-1.707-.427-56.32-10.773-93.013-34.24-126.293-55.68-9.6-6.293-18.774-12.16-28.16-17.6-27.947-16-57.92-27.306-108.16-27.306h-.32c-57.814.106-88.747 15.893-121.387 36.266-4.48 2.88-8.853 5.44-13.44 8.427-3.093 2.027-6.72 4.16-9.92 6.187-6.293 4.053-12.693 8.106-19.627 12.16-4.48 2.666-9.493 5.013-14.293 7.573-6.933 3.627-13.973 7.147-21.76 10.453-6.613 2.987-13.76 5.547-21.12 8.107-6.933 2.347-14.507 4.267-22.187 6.293-8.96 2.347-17.813 4.587-27.84 6.187-1.173.213-2.133.533-3.306.747v57.6c0 17.066 1.066 34.133 4.266 50.133C454.4 819.2 611.2 960 800 960c195.2 0 356.267-151.467 371.2-342.4 48-14.933 82.133-37.333 108.8-54.4v23.467c0 165.546-84.373 311.786-212.373 398.08h4.906a1641.19 1641.19 0 0 1 294.08 77.76C1313.28 1119.68 1280 1195.733 1280 1280h-106.667v480c0 1.387.427 2.667.427 4.16-142.933 37.547-272.427 49.173-373.76 49.173-345.493 0-612.053-120.32-774.827-221.333L0 1576.32v-196.373c0-140.054 85.867-263.04 218.667-313.28 100.373-38.08 204.586-64.96 310.186-82.347h4.8C419.52 907.413 339.2 783.787 323.2 640c-2.133-17.067-3.2-35.2-3.2-53.333V480c0-56.533 9.6-109.867 27.733-160C413.867 133.333 592 0 800 0Zm800 1173.333c-58.773 0-106.667 47.894-106.667 106.667v106.667h213.334V1280c0-58.773-47.894-106.667-106.667-106.667Z" fill-rule="evenodd"/> </g>
        
        </svg>
    </button>

  </UniversalSetupTable>
</div>
