<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        certificate_type_id: null,
        employee_id: null,
        description: null,
        required_renewal: null,
        certificate_number: null,
        issued_date: null,
        issued_by: null,
    }

    let tableList = [
        {
            name: "Required Renewal",
            id: "required_renewal",
            type: "select",
            options: [
                {name: "Yes", value: "yes"},
                {name: "No", value: "no"},
            ],
            required:true
        },
        {
            name: "issued By",
            id: "issued_by",
            type: "text",
            required: true
        },
        {
            name: "Issued Date",
            id: "issued_date",
            type: "date",
            required: true
        },
        {
            name: "Certificate Number",
            id: "certificate_number",
            type: "text",
            required: true
        },
    ]

    let employeeAll;
    let certificateTypeAll;

    async function getCertificateTypeAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/certificate-type/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        certificateTypeAll = await res.json();
    }

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

    $:console.log(formData)

    


  const fetchUrl = '/employee-certificate/list';
  const updateUrl = '/employee-certificate/update';
  const deleteUrl = '/employee-certificate/delete';
  const createUrl = '/employee-certificate/create';
  const detailUrl = '/employee-certificate/detail';
</script>

<div class="w-full overflow-auto">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Employee Certificate</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.certificate_type.type}</td>
            <td class="table-td">{row.description}</td>
            <td class="table-td">{row.required_renewal}</td>
            <td class="table-td">{row.certificate_number}</td>
            <td class="table-td">{row.issued_date}</td>
            <td class="table-td">{row.issued_by}</td>
        </svelte:fragment>

        <svelte:fragment slot="aditional-form-create">
            {#await getCertificateTypeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Certificate Type"
                        items={certificateTypeAll.data}
                        labelFieldName="type"
                        valueFieldName="id"
                        bind:bindValue={formData.certificate_type_id}
                        required={true}
                    />
            {/await}
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
            {#await getCertificateTypeAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Certificate Type"
                        items={certificateTypeAll.data}
                        labelFieldName="type"
                        valueFieldName="id"
                        bind:bindValue={formData.certificate_type_id}
                        required={true}
                    />
            {/await}
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
            <button class="button-table-add" on:click={() =>  {openAddRow(); nullform(); getCertificateTypeAll(); getEmployeeAll();}}><p>Add</p></button>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getCertificateTypeAll(); getEmployeeAll();}}>Edit</button>
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>