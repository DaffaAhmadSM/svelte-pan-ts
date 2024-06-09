<script>
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { openModal, editForm } from "$lib/stores/formModal";
    import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import { toastTrigger } from '$lib/helpers/toasterTrigger';
    export let fetchUrl;
    export let deleteUrl;
    export let updateUrl;
    export let setting;
    export let formData;
    export let dataTab;


    let tableData = dataTab.data
    export let header = [
        "name",
        "email"
    ];
    export let permissions = {
        "create" : 1,
        "update" : 1,
        "delete" : 1
    };

    


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
    const createData = await fetch(import.meta.env.VITE_API_URL + '/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: JSON.stringify(formData),
    })

    const datajson = await createData.json();
    if(createData.ok){
      let newtable = fetchTable();
      dataTab = await newtable;
      console.log(dataTab);
      openModal.set(false);
      formData = {
        email: '',
        name: '',
        password: '',
      };
    }

    if(createData.status === 400){
      toastTrigger(datajson.message, );
    }

    if(createData.status === 401){
      window.location.href = '/login';
    }
  }

    async function updateTable(){
        const updateData = await fetch(import.meta.env.VITE_API_URL + updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify(formData),
        })
        const datajson = await updateData.json();
        if(updateData.ok){
        let newtable = fetchTable();
        dataTab = await newtable;
        console.log(dataTab);
        editForm.set(false);
        formData = null;
    }
}
    /**
     * @type {HTMLDialogElement}
    */
    // @ts-ignore
    let deleteModal = document.getElementById('confirm-delete');
    async function confirmDelete(){
        deleteModal.showModal();
}

    async function deleteTable(){
        const deleteData = await fetch(import.meta.env.VITE_API_URL + deleteUrl, {
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
        console.log(dataTab);
        deleteModal.close();

        if (datajson.status !== 200) {
            toastTrigger(datajson.message, datajson.status);
        }
    }
}
    
</script>

{#if permissions.create}
        <slot name="add-row">
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  openModal.set(true)}>Add</button>
            </div>
        </slot>
{/if}

<div class="overflow-x-auto">
    <table class="table">
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
                                <button class="btn btn-warning hover:btn-error" on:click={() => { 
                                    editForm.set(true)
                                    formData = row
                                }}
                                >Edit</button>
                                <slot name="user-menu-edit" prop={row}></slot>
                        {/if}
                        {#if permissions.delete}
                                <slot name="delete-row" prop={row}></slot>
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

<dialog id="confirm-delete" class="modal">
    <div class="modal-content">
        <h1>Are you sure you want to delete this?</h1>
        <button class="btn btn-error" on:click={confirmDelete}>Yes</button>
        <button class="btn btn-success" on:click={() => {}}>No</button>
    </div>
</dialog>

