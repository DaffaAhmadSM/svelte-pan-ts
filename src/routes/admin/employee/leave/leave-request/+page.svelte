<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        number_sequence_id: null,
        leave_category_id: null,
        date_request: null, // type date
        from_date_time: null, // type date
        to_date_time: null, // type date
        adress_during_leave: null,
        contact_no: null,
        remark: null,
    })

    let tableList = [
        {
            name: "Date Request",
            id: "date_request",
            type: "date",
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
            name: "Adress During Leave",
            id: "adress_during_leave",
            type: "text",
        },
        {
            name: "Contact No",
            id: "contact_no",
            type: "text",
        },
        {
            name: "Remark",
            id: "remark",
            type: "text",
        },
    ]

    let detailMeta = [
        {
            name: "Employee",
            id: "employee.no",
            type: "text",
        },
        {
            name: "No",
            id: "no",
            type: "text",
        },
        {
            name: "Date Request",
            id: "date_request",
            type: "text",
        },
        {
            name: "From Date Time",
            id: "from_date_time",
            type: "text",
        },
        {
            name: "To Date Time",
            id: "to_date_time",
            type: "text",
        },
        {
            name: "Adress During Leave",
            id: "adress_during_leave",
            type: "text",
        },
        {
            name: "Paid",
            id: "paid",
            type: "text",
        },
        {
            name: "Deduct",
            id: "deduct",
            type: "text",
        },
        {
            name: "Amount",
            id: "amount",
            type: "text",
        },
        {
            name: "Contact No",
            id: "contact_no",
            type: "text",
        },
        {
            name: "Remark",
            id: "remark",
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

    let leaveCategoryAll = $state();
    async function getLeaveCategoryAll (employeeId){
        const res = await fetch(import.meta.env.VITE_API_URL + '/leave-category/all/employee/' + employeeId, {
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

  const fetchUrl = '/leave-request/list';
  const updateUrl = '/leave-request/update';
  const deleteUrl = '/leave-request/delete';
  const createUrl = '/leave-request/create';
  const detailUrl = '/leave-request/detail';
  const searchUrl = '/leave-request/search';
  const namePage = 'Leave Request';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {detailMeta} {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.no}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.employee.name}</td>
            <td class="table-td">{row.from_date_time}</td>
            <td class="table-td">{row.to_date_time}</td>
            <td class="table-td">{row.amount}</td>
            <td class="table-td">{row.remark}</td>
            <td class="table-td">{row.posted}</td>
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
            {#await getLeaveCategoryAll(formData.employee_id)}
                <div class="loading"></div>
            {:then _} 
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
            {#await getLeaveCategoryAll(formData.employee_id)}
                <div class="loading"></div>
            {:then _} 
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