<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        employer: null,
        position: null,
        homepage: null,
        phone: null,
        location: null,
        start_date: null,
        end_date: null,
        notes: null,
    });

    let tableList = [
    {
        name: "Employer",
        id: "employer",
        type: "text",
        required: true
    },
    {
        name: "Position",
        id: "position",
        type: "text",
        required: true
    },
    {
        name: "Homepage",
        id: "homepage",
        type: "text",
        required: true
    },
    {
        name: "Phone",
        id: "phone",
        type: "text",
        required: true
    },
    {
        name: "Location",
        id: "location",
        type: "text",
        required: true
    },
    {
        name: "From Date",
        id: "start_date",
        type: "date",
        required: true
    },
    {
        name: "To Date",
        id: "end_date",
        type: "date",
        required: true
    },
    {
        name: "Notes",
        id: "notes",
        type: "text",
    }
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


  const fetchUrl = '/employee-professional-experience/list';
  const updateUrl = '/employee-professional-experience/update';
  const deleteUrl = '/employee-professional-experience/delete';
  const createUrl = '/employee-professional-experience/create';
  const detailUrl = '/employee-professional-experience/detail';
    const searchUrl = '/employee-professional-experience/search';
    const namePage = 'Employee Professional Experience';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.employer}</td>
            <td class="table-td">{row.position}</td>
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