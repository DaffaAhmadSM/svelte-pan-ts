<script>
	import { fade } from 'svelte/transition';
	import { openModal, editForm } from '$lib/stores/formModal';
    import FormModal from '$lib/components/form-modal.svelte';
    import Table from '$lib/components/table.svelte';
    import { createDialog, melt } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
    export let data;

    let tableData = data.list.data.data;
    let header = data.list.header;
    let permission = data.permissions.permission;

    setContext("deleteList", {
        confirmDelete: deletetList
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

    function deletetList(id) {
        console.log(id);
    }
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Company Setup</h1>
    </div>
    <Table bind:tableData={tableData} bind:header={header} permissions={permission} editData={formData}/>
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

        
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> code </label>
            <input
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id="code"
            required
            bind:value={formData.code}
            />
          </fieldset>
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="name">
              name
            </label>
            <input
            type="name"
              class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
              id="name"
              required
              bind:value={formData.name}
            />
          </fieldset>
          <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="country">
            country
            </label>
            <input
            class="inline-flex h-8 w-full flex-1 items-center justify-center
                        rounded-sm border border-solid px-3 leading-none text-black"
            id="country"
            required
            bind:value={formData.country}
            />
          </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="city">
                city
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="city"
                required
                bind:value={formData.city}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="post_code">
                post code
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="post_code"
                required
                bind:value={formData.post_code}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="address">
                address
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="address"
                required
                bind:value={formData.address}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="phone">
                phone
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="phone"
                required
                bind:value={formData.phone}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="fax">
                fax
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="fax"
                required
                bind:value={formData.fax}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="email">
                email
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="email"
                required
                bind:value={formData.email}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="homepage">
                homepage
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="homepage"
                required
                bind:value={formData.homepage}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="img">
                Picture
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="img"
                required
                bind:value={formData.img}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="bank_name">
                bank name
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="bank_name"
                required
                bind:value={formData.bank_name}
                />
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black" for="bank_account">
                bank account
                </label>
                <input
                class="inline-flex h-8 w-full flex-1 items-center justify-center
                            rounded-sm border border-solid px-3 leading-none text-black"
                id="bank_account"
                required
                bind:value={formData.bank_account}
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
            class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                    items-center justify-center rounded-full p-1 text-magnum-800
                    hover:bg-magnum-100 focus:shadow-magnum-400"
          >
        </button>
      </div>
    </FormModal>
</div>