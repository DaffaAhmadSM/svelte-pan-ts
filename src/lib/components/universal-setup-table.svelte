<script>
	import UniversalDetailMeta from './universal-detail-meta.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies';
  import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
  import {Dialog} from 'bits-ui';
	import { fade } from 'svelte/transition';
	import UniversalTableField from './universal-table-field.svelte';
  export let namePage = "Table";
    /**
     * @type {String}
     */
    export let fetchUrl;
    /**
     * @type {String}
     */
    export let deleteUrl;
    /**
     * @type {String}
     */
    export let updateUrl;
    export let createUrl;
    export let detailUrl = null;
    export let searchUrl = null;
    export let data;
    export let formData;
    export let tableList;

    let setting = data.setting
    $: dataTab = data.list
    $: tableData = dataTab.data
    let header = data.list.header
    let permissions = data.permissions.permission

    let rowId;

    let addModal;
    function openAddRow(func = null){
        const ToastId = toastTriggerLoading('Loading...');
        if(func !== null){
          for (let i = 0; i <func.length; i++) {
            func[i]();
          }
        }
        addModal = true;
        toastTrigger('Loaded', ToastId, 200, 500);
    }
    let updateModal;

    let deleteModal;

    let detailModal;
    export let detailMeta = null;

    let observer;
    let loading = false;
    async function loadMore() {
      let page = setting.sizePage ? setting.sizePage : 70;
        try {
        if(!tableData.next_page_url) return;
		// @ts-ignore
        loading = true
		const loadMoreTableData = await fetch(tableData.next_page_url+ '&perpage=' + page, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
        });
        const data = await loadMoreTableData.json();
        tableData.data = [...tableData.data, ...data.data.data];
        tableData.next_page_url = data.data.next_page_url;

        loading = false
        } catch (error) {
            loading = false
        }
        
	}
	$: {
        if (observer) {
            infiniteScroll({
                fetch: loadMore,
                element: observer,
            });
        }
    }

    async function fetchTable(){
    let page = setting.sizePage ? setting.sizePage : 70;
    const get = await fetch(import.meta.env.VITE_API_URL + fetchUrl + '?perpage=' + page, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
    })
    return await get.json();
  }

    async function createTable(){
    const toastId = toastTriggerLoading('Creating...');
    let data = new FormData();
    for (const key in formData) {
      // check if the value not null
      if(formData[key] !== null){
        data.append(key, formData[key]);
      }
    }
    const createData = await fetch(import.meta.env.VITE_API_URL + createUrl, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: data,
    })
    if(createData.status === 500){
      return toastTrigger('Internal Server Error', toastId, createData.status);
    }
    if(createData.status === 401){
      window.location.href = '/login';
    }
    const datajson = await createData.json();
    if (!createData.ok){
      return toastTrigger(datajson.message, toastId, createData.status);
    }
    
    let newtable = fetchTable();
    dataTab = await newtable;
    addModal = false;
    return toastTrigger(datajson.message, toastId, 200);
  }

    async function updateTable(){
        const toastId = toastTriggerLoading('Updating...');

        let data = new FormData();
        for (const key in formData) {
          // check if the value not null
          if(formData[key] !== null){
            data.append(key, formData[key]);
          }
        }
        const updateData = await fetch(import.meta.env.VITE_API_URL + updateUrl + '/' + rowId, {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + getCookie('token')
        },
        body: data,
        })
        let datajson = await updateData.json();
        if(updateData.ok){
          let newtable = fetchTable();
          dataTab = await newtable;
          updateModal=false;
          return toastTrigger(datajson.message, toastId, 200);
      }
      if (updateData.status !== 200) {
        toastTrigger(datajson.message, toastId, updateData.status);
      }
}

    async function deleteTable(){
        const toastId = toastTriggerLoading('Deleting...');
        const deleteData = await fetch(import.meta.env.VITE_API_URL + deleteUrl + '/' +rowId, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },
        })
        let datajson = await deleteData.json();
        if(deleteData.ok){
        let newtable = fetchTable();
        dataTab = await newtable;
        deleteModal=false;
        return toastTrigger(datajson.message, toastId, 200);
      }
      if (deleteData.status !== 200) {
        toastTrigger(datajson.message, toastId, deleteData.status);
      }
}

    async function updateDetailTable(row){
      nullForm();
      const toastId = toastTriggerLoading('Loading...');
      const detailData = await fetch(import.meta.env.VITE_API_URL + detailUrl + '/' + row, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          },
          })
          
        let data = await detailData.json();
        if(detailData.ok){
          rowId = row;
          formData = data.data;
          updateModal = true;
          return toastTrigger("Data Loaded", toastId, 200, 500);
        }

        if(detailData.status !== 200){
          toastTrigger(data.message, toastId, detailData.status);
        }
    }

    let detailTableData;
    async function detailTable(row){
      nullForm();
      const toastId = toastTriggerLoading('Loading...');
      const detailData = await fetch(import.meta.env.VITE_API_URL + detailUrl + '/' + row, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          },
          })
          
        detailTableData = await detailData.json();
        if(detailData.ok){
          detailModal=true;
          return toastTrigger("Data Loaded", toastId, 200, 500);
        }

        if(detailData.status !== 200){
          toastTrigger(data.message, toastId, detailData.status);
        }
    }

    function nullForm(){
        for (const key in formData) {
            formData[key] = null;
        }
    }


  function getValueByPath(obj, path) {
    try {
      let keys = path.split('.');
      let currentLevel = obj;
      for (let key of keys) {
        if (currentLevel && typeof currentLevel === 'object' && key in currentLevel) {
          currentLevel = currentLevel[key];
        } else {
          currentLevel = undefined;
          break;
        }
      }

      if (currentLevel === null) {
        return "N/A";
      }
      return currentLevel !== undefined && currentLevel !== null ? currentLevel : "No data";
    } catch (error) {
      console.error("Error accessing nested property:", error);
      return "No data";
    }
  }

    let search;
    let timer;
    let tableLoading = false;
    async function searchTable(){
      clearTimeout(timer);
      timer = setTimeout(async() => {
        tableLoading = true;
          if(search == ''){
            let newtable = await fetchTable();
            dataTab = newtable;
            tableLoading = false;
            return;
        }
        const searchTable = fetch(import.meta.env.VITE_API_URL + searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            },
            body: JSON.stringify({search: search})
            })
            searchTable.then(res => res.json())
            .then(data => {
                dataTab = data;
                tableLoading = false;
              })
        }, 750);

    }
</script>
<div class="flex w-full flex-col mb-6 font-poppins p-5">
  <h1 class="text-5xl">{namePage}</h1>
</div>


        
        <div class="flex justify-between px-5">
          {#if searchUrl != null}
            <div id="search-bar" class="w-96 bg-white rounded-md shadow-lg z-10">
              <div class="flex items-center justify-center p-2">
                  <input type="text" placeholder="Search here"
                      bind:value={search}
                      on:input={searchTable}
                      class="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent">
                  <button
                      on:click={searchTable}
                      class="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                      Search
                  </button>
              </div>
            </div>
          {/if}
    {#if permissions.create}
          <slot name="add-row" prop={addModal} nullform={nullForm} openAddRow={openAddRow}>
            <button class="button-table-add" on:click={() =>  {addModal = true; nullForm();}}><p>Add</p></button>
          </slot>
    {/if}
        </div>
{#if tableLoading}
<div class="fixed left-0 top-0 z-99 w-full h-full flex items-center justify-center">
  <div class="loading" />
</div>
  {:else}
  <div class="container-table">
    <table class="table-style">
        <thead class="table-thead">
            <tr>
                    <th scope="col" class="table-header">
                      <p>No</p>
                    </th>
                {#each Object.values(header) as columnHeading}
                    <th scope="col" class="table-header">
                      <p>{columnHeading}</p>
                    </th>
                {/each}
                     <slot name="table-header"></slot>
                    <th scope="col" class="table-header">
                      <p>Action</p>
                    </th>
            <tr/>
        </thead>
        <tbody class="table-tbody">
            {#each tableData.data as row, i}
                    <tr class="hover">
                        <slot name="table-row" row={row} index={i}>
                            <td class="table-td">{i+1}</td>
                          {#each Object.entries(row) as [title, column]}
                              {#if title !== "id"}
                                  <td class="table-td">{column}</td>
                              {/if}
                          {/each}
                            <slot name="additional-table-row" row={row}></slot>
                        </slot>
                            <td class="table-td">
                        {#if permissions.update}
                                <slot name="user-menu-edit" id={row.id}></slot>
                                
                                <slot name="edit-row" prop={row} detailTable={updateDetailTable} rowId={rowId}>
                                    <button class="btn btn-warning hover:btn-error" on:click={() => {
                                      updateDetailTable(row.id)
                                    }}>
                                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                                      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                      
                                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                      
                                      <g id="SVGRepo_iconCarrier"> <path d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z" stroke="#3584e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
                                      
                                    </svg>
                                    
                                    </button>
                                </slot>
                        {/if}
                        {#if permissions.delete}
                                <slot name="delete-row" prop={row}>
                                    <button class="btn btn-primary hover:btn-error" on:click={()=> {rowId=row.id; deleteModal=true;}}>
                                      <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                        
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                        
                                        <g id="SVGRepo_iconCarrier"> <path d="M8 1.5V2.5H3C2.44772 2.5 2 2.94772 2 3.5V4.5C2 5.05228 2.44772 5.5 3 5.5H21C21.5523 5.5 22 5.05228 22 4.5V3.5C22 2.94772 21.5523 2.5 21 2.5H16V1.5C16 0.947715 15.5523 0.5 15 0.5H9C8.44772 0.5 8 0.947715 8 1.5Z" fill="#e01b24"/> <path d="M3.9231 7.5H20.0767L19.1344 20.2216C19.0183 21.7882 17.7135 23 16.1426 23H7.85724C6.28636 23 4.98148 21.7882 4.86544 20.2216L3.9231 7.5Z" fill="#e01b24"/> </g>
                                        
                                        </svg>
                                    </button>
                                </slot>
                        {/if}

                        {#if detailMeta !== null}
                            <button class="btn btn-primary hover:btn-error" on:click={()=> {detailTable(row.id);}}>
                               Detail
                            </button>
                        {/if}
        
                            </td>
        
                    </tr>
            {/each}
            <tr id="observer" class="h-4" bind:this={observer}></tr>
        </tbody>
        
    </table>
    {#if loading}
    <div class="loading" />
    {/if}
</div>
{/if}

<Dialog.Root bind:open={deleteModal}>
    <Dialog.Portal>
      <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
      />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
          <Dialog.Title>Are you sure you want to delete this?</Dialog.Title>
            <div class="flex flex-row items-end justify-end">
              <button class="btn btn-error" on:click={deleteTable}>Yes</button>
              <button class="btn btn-base-200" on:click={() => {deleteModal=false; rowId=null}}>No</button>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={addModal} closeOnEscape closeOnOutsideClick>
    <Dialog.Portal>
        <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
      />
        <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
          <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
            Add
          </Dialog.Title>
          <Dialog.Description class="mb-6 text-sm text-black">
              Fill in the form below to add a new data.
          </Dialog.Description>
          <slot name="aditional-form-create"></slot>
          <UniversalTableField {tableList} formData={formData} />
        

          <div class="mt-6 flex justify-end gap-4">
              <button
                class="inline-flex h-8 items-center justify-center rounded-sm
                          bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                  on:click={() => {
                      addModal = false;
                  }}
              >
                Cancel
                
              </button>
              <button
              type="submit"
                class="inline-flex h-8 items-center justify-center rounded-sm
                          bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
                on:click={() => {
                  createTable();
                }}
              >
                Save changes
              </button>
          </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>


<Dialog.Root bind:open={updateModal} closeOnEscape closeOnOutsideClick>
  <Dialog.Portal>
    <Dialog.Overlay
    transition={fade}
    transitionConfig={{ duration: 150 }}
    class="fixed inset-0 z-50 bg-black/50"
  />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
          Edit
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-sm text-black">
            Fill in the form below to edit data.
        </Dialog.Description>
        <slot name="aditional-form-update"></slot>
        <UniversalTableField {tableList} {formData} />

        <div class="mt-6 flex justify-end gap-4">
            <button
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                on:click={() => {
                    updateModal = false;
                }}
            >
              Cancel
              
            </button>
            <button
            type="submit"
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
              on:click={() => {
                updateTable();
              }}
            >
              Save changes
            </button>
        </div>
      </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={detailModal} closeOnEscape closeOnOutsideClick>
  <Dialog.Portal>
    <Dialog.Overlay
    transition={fade}
    transitionConfig={{ duration: 150 }}
    class="fixed inset-0 z-50 bg-black/50"
  />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
          Detail
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-sm text-black">
            Detail {namePage}
        </Dialog.Description>

        {#each detailMeta as data}
          {#if data.type == "array"}
            <UniversalDetailMeta
            detailname={data.name}
            detailData={getValueByPath(detailTableData.data, data.id)}
            detailType={data.type}
            arrayGuide={data.arrayGuide}
          />
          {:else}
          <UniversalDetailMeta
            detailname={data.name}
            detailData={getValueByPath(detailTableData.data, data.id)}
            detailType={data.type}
          />
          {/if}
        {/each}

      </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

