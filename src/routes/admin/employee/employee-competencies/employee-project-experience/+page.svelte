<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        project_name: null,
        role: null,
        start_date: null,
        end_date: null,
    });

    let tableList = [
    {
        name: "Project Name",
        id: "project_name",
        type: "text",
        required: true
    },
    {
        name: "Role",
        id: "role",
        type: "text",
        required: true
    },
    {
        name: "Start Date",
        id: "start_date",
        type: "date",
        required: true
    },
    {
        name: "End Date",
        id: "end_date",
        type: "date",
        required: true
    },
];

    let employeeAll = $state();
    async function getEmployeeAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/employee-data/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        employeeAll = await res.json();
    }


  const fetchUrl = '/employee-project-experience/list';
  const updateUrl = '/employee-project-experience/update';
  const deleteUrl = '/employee-project-experience/delete';
  const createUrl = '/employee-project-experience/create';
  const detailUrl = '/employee-project-experience/detail';
  const searchUrl = '/employee-project-experience/search';
    const namePage = 'Employee Project Experience';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.project_name}</td>
            <td class="table-td">{row.role}</td>
            <td class="table-td">{row.start_date}</td>
            <td class="table-td">{row.end_date}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getEmployeeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Employee"
                        items={employeeAll.data}
                        labelFieldName="no"
                        valueFieldName="id"
                        bind:bindValue={formData.employee_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>

        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
            {#await getEmployeeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Employee"
                        items={employeeAll.data}
                        labelFieldName="no"
                        valueFieldName="id"
                        bind:bindValue={formData.employee_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>