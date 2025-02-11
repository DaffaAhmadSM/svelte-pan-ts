<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { getValueByPath } from '$lib/helpers/getObjectValue';
	import { name } from '@melt-ui/svelte';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        date: null,
        trans_type: null, // Leave, Entitle
        amount: null, // required = false
        deduct: null, // enum yes, no
        paid: null, // enum yes, no
        from_date_time: null, //date
        to_date_time: null, //date
        remarks: null,
    })

    let tableList = [
        {
            name: "Date",
            id: "date",
            type: "date",
            required: true
        },
        {
            name: "Transaction Type",
            id: "trans_type",
            type: "select",
            options: [
                {
                    name: "Leave",
                    value: "Leave"
                },
                {
                    name: "Entitle",
                    value: "Entitle"
                }
            ],
            required: true
        },
        {
            name: "Amount",
            id: "amount",
            type: "number",
            required: false
        },
        {
            name: "Deduct",
            id: "deduct",
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
            required: true
        },
        {
            name: "Paid",
            id: "paid",
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
            required: true
        },
        {
            name: "From Date Time",
            id: "from_date_time",
            type: "date",
            required: true
        },
        {
            name: "To Date Time",
            id: "to_date_time",
            type: "date",
            required: true
        },
        {
            name: "Remarks",
            id: "remarks",
            type: "text",
        },

    ]

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


  const fetchUrl = '/leave-history/list';
  const updateUrl = '/leave-history/update';
  const deleteUrl = '/leave-history/delete';
  const createUrl = '/leave-history/create';
  const detailUrl = '/leave-history/detail';
//   const searchUrl = '/leave-history/search';
  const namePage = 'Leave History';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:header let:index let:row>
            <td class="table-td">{index + 1}</td>
            {#each Object.entries(header) as [key, value]}
                <td class="table-td">{getValueByPath(row, key)}</td>
            {/each}
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
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>