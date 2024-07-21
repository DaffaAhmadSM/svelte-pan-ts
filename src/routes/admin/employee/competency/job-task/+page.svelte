<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies';
    export let data;

    let formData = {
        responsibility: null,
        description: null,
        note: null,
        job_responsibility_id: null
    }

    let tableList = [
        {
            name: "Job Task",
            id: "job_task",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
        {
            name: "Note",
            id: "note",
            type: "text"
        },
    ];

    let responsibilityAll;

    async function getResponsibilityAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/job-resposibility/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        responsibilityAll = await res.json();
    }


  const fetchUrl = '/job-task/list';
  const updateUrl = '/job-task/update';
  const deleteUrl = '/job-task/delete';
  const createUrl = '/job-task/create';
  const detailUrl = '/job-task/detail';
  const namePage = 'Job Task Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{index + 1}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.job_task}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.description}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.job_responsibility.responsibility}</td>
        </svelte:fragment>

        <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  {openAddRow(); nullform(); getResponsibilityAll();}}>Add</button>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getResponsibilityAll();}}>Edit</button>
        </svelte:fragment>

        <svelte:fragment slot="aditional-form-create">
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Responsibility</div>
                <select name="number_sequence" bind:value={formData.job_responsibility_id} class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if responsibilityAll}
                        {#each responsibilityAll.data.data as responsibility}
                            <option value={responsibility.id}>{responsibility.responsibility}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-update">
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Responsibility</div>
                <select name="number_sequence" bind:value={formData.job_responsibility_id} class="inline-flex h-8 w-full flex-1
                                rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if responsibilityAll}
                        {#each responsibilityAll.data.data as responsibility}
                            <option value={responsibility.id}>{responsibility.responsibility}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
    </UniversalSetupTable>
</div>