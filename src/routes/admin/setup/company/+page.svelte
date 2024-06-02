<script>
    import { fade } from 'svelte/transition';
    import { openModal, editForm } from '$lib/stores/formModal';
    import FormModal from '$lib/components/form-modal.svelte';
    import EditFormModal from '$lib/components/edit-form-modal.svelte';
    import Table from '$lib/components/table.svelte';
    import { createDialog, melt } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
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
        binding : editFormData.code,
        type: "text"
      },
      {
        name: "name",
        id: "name",
        binding : editFormData.name,
        type: "text"
      },
      {
        name: "country",
        id: "country",
        binding : editFormData.country,
        type: "text"
      },
      {
        name: "city",
        id: "city",
        binding : editFormData.city,
        type: "text"
      },
      {
        name: "Post Code",
        id: "post_code",
        binding : editFormData.post_code,
        type: "text"
      },
      {
        name: "address",
        id: "address",
        binding : editFormData.address,
        type: "text",
      },
      {
        name: "phone",
        id: "phone",
        binding : editFormData.phone,
        type: "text",
      },
      {
        name: "fax",
        id: "fax",
        binding : editFormData.fax,
        type: "text",
      },
      {
        name: "email",
        id: "email",
        binding : editFormData.email,
        type: "text",
      },
      {
        name: "homepage",
        id: "homepage",
        binding : editFormData.homepage,
        type: "text",
      },
      {
        name: "Picture",
        id: "img",
        binding : editFormData.img,
        type: "file",
      },
      {
        name: "Bank Name",
        id: "bank_name",
        binding : editFormData.bank_name,
        type: "text",
      },
      {
        name: "Bank Account Number",
        id: "bank_account",
        binding : editFormData.bank_account,
        type: "text",
      }
    ]

    let AddTableList = [
      {
        name: "code",
        id: "code",
        binding : formData.code,
        type: "text"
      },
      {
        name: "name",
        id: "name",
        binding : formData.name,
        type: "text"
      },
      {
        name: "country",
        id: "country",
        binding : formData.country,
        type: "text"
      },
      {
        name: "city",
        id: "city",
        binding : formData.city,
        type: "text"
      },
      {
        name: "Post Code",
        id: "post_code",
        binding : formData.post_code,
        type: "text"
      },
      {
        name: "address",
        id: "address",
        binding : formData.address,
        type: "text",
      },
      {
        name: "phone",
        id: "phone",
        binding : formData.phone,
        type: "text",
      },
      {
        name: "fax",
        id: "fax",
        binding : formData.fax,
        type: "text",
      },
      {
        name: "email",
        id: "email",
        binding : formData.email,
        type: "text",
      },
      {
        name: "homepage",
        id: "homepage",
        binding : formData.homepage,
        type: "text",
      },
      {
        name: "Picture",
        id: "img",
        binding : formData.img,
        type: "file",
      },
      {
        name: "Bank Name",
        id: "bank_name",
        binding : formData.bank_name,
        type: "text",
      },
      {
        name: "Bank Account Number",
        id: "bank_account",
        binding : formData.bank_account,
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
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Company Setup</h1>
    </div>
    <Table bind:tableData={tableData} bind:header={header} permissions={permission} editData={editFormData}>
        <div class="m-2 flex justify-end" slot="add">
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
        class="fixed left-1/2 top-1/2 z-50 max-h-[70vh] w-[90vw]
              max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
              p-6 shadow-lg overflow-scroll"
        use:melt={$content}
      >
        <h2 use:melt={$title} class="m-0 text-lg font-medium text-primary-400">
          Add Company
        </h2>
        <p use:melt={$description} class="mb-6 text-sm text-black">
            Fill in the form below to add a new Company setup.
        </p>
        {#each AddTableList as list}
          {#if list.type === "file" && list.id === "img"}
            <fieldset class="mb-4 flex items-center gap-5">
              <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
              <input
              type="file"
              class="inline-flex h-8 w-full flex-1
                          rounded-sm px-3 leading-none text-black input input-bordered"
              id={list.id}
              required
              bind:value={list.binding}
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
              required
              bind:value={list.binding}
              />
            </fieldset>
          {/if}
        {/each}
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
            on:click={() => {
              console.log(formData);
            }}
          >
            Save changes
          </button>
        </div>
        <button
          use:melt={$close}
          aria-label="close"
          class="absolute right-4 top-4
                  items-center justify-center rounded-full p-1 btn btn-circle btn-outline"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
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
          class="fixed left-1/2 top-1/2 z-50 max-h-[70vh] w-[90vw]
                  max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
                  p-6 shadow-lg overflow-scroll"
          use:melt={$editContent}
        >
        <h2 use:melt={$editTitle} class="m-0 text-lg font-medium text-primary-400">
          Edit Company
        </h2>
        <p use:melt={$editDescription} class="mb-6 text-sm text-black">
            Fill in the form below to edit Company setup.
        </p>
        {#each EditTableList as list}
        {#if list.type === "file" && list.id === "img"}
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            type="file"
            accept="image/*"
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id={list.id}
            required
            bind:value={list.binding}
            />
          </fieldset>
        {/if}
        {#if list.type === "text"}
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id={list.id}
            required
            bind:value={list.binding}
            />
          </fieldset>
        {/if}
        {/each}
        <div class="mt-6 flex justify-end gap-4">
          <button
            use:melt={$editClose}
            class="inline-flex h-8 items-center justify-center rounded-sm
                      bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
          >
            Cancel
          </button>
          <button
          type="submit"
            class="inline-flex h-8 items-center justify-center rounded-sm
                      bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
            on:click={() => {
              console.log(formData);
            }}
          >
            Save changes
          </button>
        </div>
        <button
          use:melt={$editClose}
          aria-label="close"
          class="absolute right-4 top-4
                  items-center justify-center rounded-full p-1 btn btn-circle btn-outline"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
  </EditFormModal>
</div>