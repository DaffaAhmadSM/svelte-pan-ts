<script>
	import { getCookie } from '$lib/helpers/getLocalCookies';
  import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
  import {Dialog} from 'bits-ui';
	import { toast } from 'svelte-sonner';
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
    function openAddRow(){
        addModal = true;
    }
    let updateModal;
    function openEditRow(){
        updateModal = true;
    }
    let deleteModal;
    function openDeleteRow(){
        deleteModal = true;
    }


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

    const datajson = await createData.json();
    if(createData.ok){
      let newtable = fetchTable();
      dataTab = await newtable;
      addModal = false;
      return toastTrigger(datajson.message, toastId, 200);
    }
    if(createData.status !== 200){
      toastTrigger(datajson.message, toastId, createData.status);
    }

    if(createData.status === 401){
      window.location.href = '/login';
    }
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

    async function detailTable(row){
      const detailData = await fetch(import.meta.env.VITE_API_URL + detailUrl + '/' + row, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          },
          })
          updateModal = true;
        let data = await detailData.json();
        if(detailData.ok){
          rowId = row;
          formData = data.data;
        }
    }

    function nullForm(){
        for (const key in formData) {
            formData[key] = null;
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

{#if permissions.create}
        <slot name="add-row" prop={addModal} nullform={nullForm} openAddRow={openAddRow}>
            <div class="flex justify-between m-2">
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
                <button class=" px-5 py-3 gap-x-2 text-sm font-normal text-emerald-800 bg-emerald-100/90 dark:bg-gray-800" on:click={() =>  {addModal = true; nullForm();}}><p class="font-sans font-bold uppercase whitespace-nowrap">Add</p></button>
            </div>
        </slot>
{/if}
{#if tableLoading}
<div class="fixed left-0 top-0 z-99 w-full h-full flex items-center justify-center">
  <div class="loading" />
</div>
  {:else}
  <div class="p-5 shadow">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
        <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                    <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">No</p>
                    </th>
                {#each Object.values(header) as columnHeading}
                    <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">{columnHeading}</p>
                    </th>
                {/each}
                     <slot name="table-header"></slot>
                    <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Action</p>
                    </th>
            <tr/>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            {#each tableData.data as row, i}
                    <tr class="hover">
                        <slot name="table-row" row={row} index={i}>
                            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{i+1}</td>
                          {#each Object.entries(row) as [title, column]}
                              {#if title !== "id"}
                                  <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{column}</td>
                              {/if}
                          {/each}
                        </slot>
                            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {#if permissions.update}
                                <slot name="user-menu-edit" id={row.id}></slot>
                                
                                <slot name="edit-row" prop={row} detailTable={detailTable} rowId={rowId}>
                                    <button class="btn btn-warning hover:btn-error" on:click={() => {
                                      detailTable(row.id)
                                    }}
                                    >Edit</button>
                                </slot>
                        {/if}
                        {#if permissions.delete}
                                <slot name="delete-row" prop={row}>
                                    <button class="btn btn-primary hover:btn-error" on:click={()=> {rowId=row.id; deleteModal=true;}}>Delete</button>
                                </slot>
                        {/if}
        
                            </td>
        
                    </tr>
            {/each}
        </tbody>
        <div id="observer" class="h-3" bind:this={observer}></div>
        
    </table>
    {#if loading}
    <div class="loading" />
    {/if}
</div>
{/if}

<Dialog.Root bind:open={deleteModal}>
    <Dialog.Portal>
      <Dialog.Overlay
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
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
      />
        <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
          <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
            Add Company
          </Dialog.Title>
          <Dialog.Description class="mb-6 text-sm text-black">
              Fill in the form below to add a new Company setup.
          </Dialog.Description>
          <slot name="aditional-form-create"></slot>
          {#each tableList as list}
              {#if list.type === "file" || list.id === "img"}
                  <fieldset class="mb-4 flex items-center gap-5">
                    <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                    <input
                    type="file"
                    class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered"
                    id={list.id}
                    on:change={(e) => {
                      // @ts-ignore
                      formData[list.id] = e.target.files[0];
                    }}
                    />
                  </fieldset>
                {/if}
                {#if list.type === "text"}
                  <fieldset class="mb-4 flex items-center gap-5">
                    <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                    <input
                    class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered"
                    id={list.id}
                    disabled={list.disabled}
                    bind:value={formData[list.id]}
                    />
                  </fieldset>
                {/if}
                {#if list.type === "number"}
                  <fieldset class="mb-4 flex items-center gap-5">
                    <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                    <input
                    type="number"
                    class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered"
                    id={list.id}
                    placeholder="1.00"
                    step="0.01"
                    min="1.00"
                    bind:value={formData[list.id]}
                    />
                  </fieldset>
                {/if}
                {#if list.type === "date"}
                  <fieldset class="mb-4 flex items-center gap-5">
                    <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                    <input
                    type="date"
                    class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered"
                    id={list.id}
                    bind:value={formData[list.id]}
                    />
                  </fieldset>
                {/if}
          {/each}
        

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
      transitionConfig={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/50"
    />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
          Add Company
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-sm text-black">
            Fill in the form below to add a new Company setup.
        </Dialog.Description>
        <slot name="aditional-form-update"></slot>
        {#each tableList as list}
            {#if list.type === "file" || list.id === "img"}
                <fieldset class="mb-4 flex items-center gap-5">
                  <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                  <input
                  type="file"
                  class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered"
                  id={list.id}
                  on:change={(e) => {
                    // @ts-ignore
                    formData[list.id] = e.target.files[0];
                  }}
                  />
                </fieldset>
              {/if}
              {#if list.type === "text"}
                <fieldset class="mb-4 flex items-center gap-5">
                  <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                  <input
                  class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered"
                  id={list.id}
                  disabled={list.disabled}
                  bind:value={formData[list.id]}
                  />
                </fieldset>
              {/if}
              {#if list.type === "number"}
                <fieldset class="mb-4 flex items-center gap-5">
                  <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                  <input
                  type="number"
                  class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered"
                  id={list.id}
                  placeholder="1.00"
                  step="0.01"
                  min="1.00"
                  bind:value={formData[list.id]}
                  />
                </fieldset>
              {/if}
              {#if list.type === "date"}
                <fieldset class="mb-4 flex items-center gap-5">
                  <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
                  <input
                  type="date"
                  class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered"
                  id={list.id}
                  bind:value={formData[list.id]}
                  />
                </fieldset>
              {/if}
        {/each}
      

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

