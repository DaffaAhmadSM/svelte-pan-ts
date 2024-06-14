<script>
	import { getCookie } from '$lib/helpers/getLocalCookies';
    import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import { toastTrigger } from '$lib/helpers/toasterTrigger';
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
    let updateModal;
    let deleteModal;


    let observer;
    let loading = false;
    async function loadMore() {
        try {
        if(!tableData.next_page_url) return;
		// @ts-ignore
        loading = true
		const loadMoreTableData = await fetch(tableData.next_page_url, {
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
            console.log(error)
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
    const get = await fetch(import.meta.env.VITE_API_URL + fetchUrl + '?perpage=' + setting.sizePage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
    })
    return await get.json();
  }

    async function createTable(){

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
      addModal.close();
    }

    if(createData.status === 400){
      toastTrigger(datajson.message, );
    }

    if(createData.status === 401){
      window.location.href = '/login';
    }
  }

    async function updateTable(){
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
        if(updateData.ok){
          let newtable = fetchTable();
          dataTab = await newtable;
          updateModal.close();
    }
}

    async function deleteTable(){
        const deleteData = await fetch(import.meta.env.VITE_API_URL + deleteUrl + '/' +rowId, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },
        })
        const datajson = await deleteData.json();
        if(deleteData.ok){
        let newtable = fetchTable();
        dataTab = await newtable;
        deleteModal.close();

        if (datajson.status !== 200) {
            toastTrigger(datajson.message, datajson.status);
        }
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
          updateModal.showModal();
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
    async function searchTable(){
        clearTimeout(timer);
        timer = setTimeout(async() => {
          if(search == ''){
            let newtable = await fetchTable();
            dataTab = newtable;
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
            })
        }, 750);
    }
    
</script>
<div class='max-w-md mx-auto'>
  <div class="relative flex items-center w-full h-12 rounded-lg">
      

      <input
      class="input input-bordered w-full max-w-xs bg-white"
      type="text"
      id="search"
      bind:value={search}
      on:input={searchTable}
      placeholder="Search something.." /> 
      <button class="grid place-items-center h-full w-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
  </div>
</div>
{#if permissions.create}
        <slot name="add-row" prop={addModal} nullform={nullForm}>
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  {addModal.showModal(); nullForm();}}>Add</button>
            </div>
        </slot>
{/if}

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                {#each Object.values(header) as columnHeading}
                    <th>{columnHeading}</th>
                {/each}
                    <th>Action</th>
            <tr/>
        </thead>
        <tbody>
            {#each tableData.data as row, i}
                    <tr class="hover">
                        {#each Object.entries(row) as [title, column]}
                            {#if title !== "id"}
                                <td>{column}</td>
                            {/if}
                        {/each}
                            <td>
                        {#if permissions.update}
                                
                                <slot name="edit-row" prop={row} detailTable={detailTable} rowId={rowId}>
                                    <button class="btn btn-warning hover:btn-error" on:click={() => {
                                      detailTable(row.id)
                                    }}
                                    >Edit</button>
                                </slot>
                        {/if}
                        {#if permissions.delete}
                                <slot name="delete-row" prop={row}>
                                    <button class="btn btn-primary hover:btn-error" on:click={()=> {rowId=row.id; deleteModal.showModal();}}>Delete</button>
                                </slot>
                        {/if}
        
                            </td>
        
                    </tr>
            {/each}
        </tbody>
        <div id="observer" class="h-3" bind:this={observer}></div>
        
    </table>
    {#if loading}
        <div class="loading"></div>
    {/if}
</div>

<dialog id="confirm-delete" class="modal" bind:this={deleteModal}>
    <div class="modal-box">
        <h1>Are you sure you want to delete this?</h1>
        <div class="flex justify-end items-end gap-3">
            <button class="btn btn-error" on:click={deleteTable}>Yes</button>
            <button class="btn btn-base-200" on:click={() => {deleteModal.close(); rowId=null}}>No</button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog id="add-modal" class="modal" bind:this={addModal}>
    <div
        class="overflow-scroll modal-box"
      >
        <h2 class="m-0 text-lg font-medium text-primary-400">
          Add Company
        </h2>
        <p class="mb-6 text-sm text-black">
            Fill in the form below to add a new Company setup.
        </p>
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
                        addModal.close();
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
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
</dialog>


<dialog id="update-modal" class="modal" bind:this={updateModal}>
  <div
      class="overflow-scroll modal-box"
    >
      <h2 class="m-0 text-lg font-medium text-primary-400">
        Add Company
      </h2>
      <p class="mb-6 text-sm text-black">
          Fill in the form below to add a new Company setup.
      </p>
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
                      updateModal.close();
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
          </div>
          <form method="dialog" class="modal-backdrop">
              <button>close</button>
          </form>
</dialog>

