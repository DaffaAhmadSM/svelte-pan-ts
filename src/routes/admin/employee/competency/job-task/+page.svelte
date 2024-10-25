<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies';
  let { data } = $props();

    let formData = $state({
        responsibility: null,
        description: null,
        note: null,
        job_responsibility_id: null
    })

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

    let responsibilityAll = $state();

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
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{index + 1}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.job_task}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.description}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.job_responsibility.responsibility}</td>
        </svelte:fragment>

        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getResponsibilityAll() then _}
            <AutocompleteComponents
            fieldLable="Responsibility"
            items={responsibilityAll.data.data}
            labelFieldName="responsibility"
            valueFieldName="id"
            bind:bindValue={formData.job_responsibility_id}
            required={true}
            
            />
            {/await}
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
            {#await getResponsibilityAll() then _}
            <AutocompleteComponents
            fieldLable="Responsibility"
            items={responsibilityAll.data.data}
            labelFieldName="responsibility"
            valueFieldName="id"
            bind:bindValue={formData.job_responsibility_id}
            required={true}
            
            />
            {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>