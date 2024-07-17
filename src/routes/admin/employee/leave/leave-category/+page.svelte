<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        description: null,
        employee_id: null,
        deduct: null, // enum yes, no
        paid: null, // enum yes, no
        note: null,
    }

    let tableList = [
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
            name: "Description",
            id: "description",
            type: "text",
            required: true
        },
        {
            name: "Note",
            id: "note",
            type: "text",
        },
    ]

    let employeeAll;
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


  const fetchUrl = '/leave-category/list';
  const updateUrl = '/leave-category/update';
  const deleteUrl = '/leave-category/delete';
  const createUrl = '/leave-category/create';
  const detailUrl = '/leave-category/detail';
  const searchUrl = '/leave-category/search';
</script>

<div class="w-full overflow-auto">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Leave Category</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.description}</td>
            <td class="table-td">{row.deduct}</td>
            <td class="table-td">{row.paid}</td>
            <td class="table-td">{row.note}</td>
        </svelte:fragment>

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

        <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <button class="button-table-add" on:click={() =>  {openAddRow(); nullform(); getEmployeeAll();}}><p>Add</p></button>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getEmployeeAll();}}>Edit</button>
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>