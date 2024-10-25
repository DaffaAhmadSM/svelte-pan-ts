<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        customer_id: null,
        note: null,
    });

    let tableList = [
        {
            name: 'Note',
            id: 'note',
            type: 'text',
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

    let customerAll = $state();
    async function getCustomerAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/customer/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        customerAll = await res.json();
    }

  const fetchUrl = '/employee-customer/list';
  const updateUrl = '/employee-customer/update';
  const deleteUrl = '/employee-customer/delete';
  const createUrl = '/employee-customer/create';
  const detailUrl = '/employee-customer/detail';
  const searchUrl = '/employee-customer/search';
    const namePage = 'Employee Customer';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {searchUrl} {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.name}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.customer.name}</td>
            <td class="table-td">{row.customer.no}</td>
            <td class="table-td">{row.note}</td>
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
            {#await getCustomerAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Customer"
                        items={customerAll.data}
                        labelFieldName="no"
                        valueFieldName="id"
                        bind:bindValue={formData.customer_id}
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
            {#await getCustomerAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Customer"
                        items={customerAll.data}
                        labelFieldName="no"
                        valueFieldName="id"
                        bind:bindValue={formData.customer_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>