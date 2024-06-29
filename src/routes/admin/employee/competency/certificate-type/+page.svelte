<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger.js';
    export let data;

    let formData = {
        type: null,
        description: null,
        certificate_classification_id: null,
        required_renewal: null
    }

    let tableList = [
        {
            name: "Type",
            id: "type",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]

  let classificationAll;

  async function getCertificationAll(){

        const res = await fetch(import.meta.env.VITE_API_URL + '/certificate-classification/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        classificationAll = await res.json();
    }

  const fetchUrl = '/certificate-type/list';
  const updateUrl = '/certificate-type/update';
  const deleteUrl = '/certificate-type/delete';
  const createUrl = '/certificate-type/create';
  const detailUrl = '/certificate-type/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Certificate Classification</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{index + 1}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.type}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.description}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.classification.classification}</td>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-create">
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Classification</div>
                <select name="number_sequence" bind:value={formData.certificate_classification_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if classificationAll}
                        {#each classificationAll.data.data as classification}
                            <option value={classification.id}>{classification.classification}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Renewal</div>
                <select name="number_sequence" bind:value={formData.required_renewal} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-update">
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Classification</div>
                <select name="number_sequence" bind:value={formData.certificate_classification_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if classificationAll}
                        {#each classificationAll.data.data as classification}
                            <option value={classification.id}>{classification.classification}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  {openAddRow(); nullform(); getCertificationAll();}}>Add</button>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getCertificationAll();}}>Edit</button>
        </svelte:fragment>
    </UniversalSetupTable>
</div>