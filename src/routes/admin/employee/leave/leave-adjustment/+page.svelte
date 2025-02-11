<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        no: null,
        leave_category_id: null, // enum yes, no
        beginning_balance: null, // enum yes, no
        ending_balance: null,
        date : null,
        remark: null,
        posted: null,
    })

    let tableList = [
        {
            name: "Beginning Balance",
            id: "beginning_balance",
            type: "number",
            required: true
        },
        {
            name: "Ending Balance",
            id: "ending_balance",
            type: "number",
            required: true
        },
        {
            name: "Remark",
            id: "remark",
            type: "text",
            required: true
        },
        {
            name: "Date",
            id: "date",
            type: "date",
            required: true
        },
        {
            name: "Posted",
            id: "posted",
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

    let leaveCategoryAll = $state();
    async function getLeaveCategoryAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/leave-category/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        leaveCategoryAll = await res.json();
    }

    let numberSequenceAll = $state();
    async function getNumberSequenceAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        numberSequenceAll = await res.json();
    }

  const fetchUrl = '/leave-adjustment/list';
  const updateUrl = '/leave-adjustment/update';
  const deleteUrl = '/leave-adjustment/delete';
  const createUrl = '/leave-adjustment/create';
  const detailUrl = '/leave-adjustment/detail';
  const searchUrl = '/leave-adjustment/search';
  const namePage = 'Leave Adjustment';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.no}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.leave_category.description}</td>
            <td class="table-td">{row.date}</td>
            <td class="table-td">{row.beginning_balance}</td>
            <td class="table-td">{row.ending_balance}</td>
            <td class="table-td">{row.adjust_balance}</td>
            <td class="table-td">{row.remark}</td>
            <td class="table-td">{row.posted}</td>
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
            {#await getLeaveCategoryAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Leave Category"
                        items={leaveCategoryAll.data}
                        labelFieldName="description"
                        valueFieldName="id"
                        bind:bindValue={formData.leave_category_id}
                        required={true}
                    />
            {/await}
            {#await getNumberSequenceAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Number Sequence"
                        items={numberSequenceAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.number_sequence_id}
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
            {#await getLeaveCategoryAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Leave Category"
                        items={leaveCategoryAll.data}
                        labelFieldName="description"
                        valueFieldName="id"
                        bind:bindValue={formData.leave_category_id}
                        required={true}
                    />
            {/await}
            {#await getNumberSequenceAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Number Sequence"
                        items={numberSequenceAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.number_sequence_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>