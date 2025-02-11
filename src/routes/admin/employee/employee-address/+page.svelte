<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        employee_id: null,
        address: null,
        type: null, // ID, Domicile
        rt: null,
        rw: null,
        kelurahan: null,
        kab_kota: null,
        provinsi: null,
        kecamatan: null,
    });

    let tableList = [
    {
        name: "Address",
        id: "address",
        type: "text",
        required: true
    },
    {
        name: "Type",
        id: "type",
        type: "select",
        options: [
            {
                name: "ID",
                value: "ID"
            },
            {
                name: "Domicile",
                value: "Domicile"
            }
        ],
        required: true
    },
    {
        name: "RT",
        id: "rt",
        type: "text",
        required: true
    },
    {
        name: "RW",
        id: "rw",
        type: "text",
        required: true
    },
    {
        name: "Kelurahan",
        id: "kelurahan",
        type: "text",
        required: true
    },
    {
        name: "Kabupaten/Kota",
        id: "kab_kota",
        type: "text",
        required: true
    },
    {
        name: "Kecamatan",
        id: "kecamatan",
        type: "text",
        required: true
    },
    {
        name: "Provinsi",
        id: "provinsi",
        type: "text",
        required: true
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

  const fetchUrl = '/employee-address/list';
  const updateUrl = '/employee-address/update';
  const deleteUrl = '/employee-address/delete';
  const createUrl = '/employee-address/create';
  const detailUrl = '/employee-address/detail';
    const namePage = 'Employee Address';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.address}</td>
            <td class="table-td">{row.type}</td>
            <td class="table-td">{row.rt}</td>
            <td class="table-td">{row.rw}</td>
            <td class="table-td">{row.kelurahan}</td>
            <td class="table-td">{row.kecamatan}</td>
            <td class="table-td">{row.kab_kota}</td>
            <td class="table-td">{row.provinsi}</td>
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