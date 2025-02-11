<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        status: null, // enum active, inactive
        employment_type_id: null,
        from_date: null,
        to_date: null,
        duration: null,
        last_date_worked: null,
        terminated: null, // enum yes, no
        termination_date: null,
        termination_reason: null
    });

    let tableList = [
    {
        name: "Status",
        id: "status",
        type: "select",
        options: [
            {
                name: "Contract",
                value: "contract"
            },
            {
                name: "Permanent",
                value: "permanent"
            }
        ],
        required: true
    },
    {
        name: "From Date",
        id: "from_date",
        type: "date",
        required: true
    },
    {
        name: "To Date",
        id: "to_date",
        type: "date",
        required: true
    },
    {
        name: "Duration",
        id: "duration",
        type: "number",
        required: true
    },
    {
        name: "Last Date Worked",
        id: "last_date_worked",
        type: "date",
        required: true
    },
    {
        name: "Terminated",
        id: "terminated",
        type: "select",
        options: [
            {
                name: "Yes",
                value: "yes"
            },
            {
                name: "No",
                value: "no"
            }
        ],
    },
    {
        name: "Termination Date",
        id: "termination_date",
        type: "date",
    },
    {
        name: "Termination Reason",
        id: "termination_reason",
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

    let employmentTypeAll = $state();
    async function getemploymentTypeAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/employment-type/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        employmentTypeAll = await res.json();
    }


  const fetchUrl = '/employment/list';
  const updateUrl = '/employment/update';
  const deleteUrl = '/employment/delete';
  const createUrl = '/employment/create';
  const detailUrl = '/employment/detail';
  const searchUrl = '/employment/search';
    const namePage = 'Employment Data';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.employee.name}</td>
            <td class="table-td">{row.from_date}</td>
            <td class="table-td">{row.to_date}</td>
            <td class="table-td">{row.employment_type.code}</td>
            <td class="table-td">{row.status.toUpperCase()}</td>
            <td class="table-td">{row.permanent}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
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
            {#await getemploymentTypeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Employment Type"
                        items={employmentTypeAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.employment_type_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>

        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
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
            {#await getemploymentTypeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Employment Type"
                        items={employmentTypeAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.employment_type_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>