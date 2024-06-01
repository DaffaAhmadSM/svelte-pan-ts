<script>
  import { fade } from 'svelte/transition';
  import { createDialog, melt } from '@melt-ui/svelte';
  import Table from '$lib/components/table.svelte';
  import FormModal from '$lib/components/form-modal.svelte';
  import { openModal } from "$lib/stores/formModal";
  import {getCookie} from '$lib/helpers/getLocalCookies';
  import { getToastStore } from '@skeletonlabs/skeleton';
  export let data;
    const toastStore = getToastStore();
    $: tableData = data.list.data.data;  
    let header = data.list.header;
    let permission = data.permissions.permission;

    /**
     * 
     * @param {string} message
     */
    function toastError (message) {
      /**
       * @type {import('@skeletonlabs/skeleton').ToastSettings}
       */
      const toastSetting = {
        message: message,
        background: 'bg-error-500 text-white',
      };

      toastStore.trigger(toastSetting);
    }

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

  const formData = {
    email: '',
    name: '',
    password: '',
  };

  async function get(){
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
      data.list.data = datajson.data;
      openModal.set(false);
    }

    if(get.status === 400){
      toastError(datajson.message);
    }

    if(get.status === 401){
      window.location.href = '/login';
    }


  }
</script>
<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">User Setup</h1>
    </div>
    <Table tableData={tableData} header={header} permissions={permission}/>
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

        <form>
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
              on:click={get}
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
        </form>
      </div>
    </FormModal>

</div>

