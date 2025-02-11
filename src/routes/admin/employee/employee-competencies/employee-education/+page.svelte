<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        education_level_id: null,
        employee_id: null,
        institution: null,
        grade_point_avg: null,
        grade_point_scale: null,
        from_year: null,
        to_year: null,
        notes: null,
    })

    let tableList = [
        {
            name: "Institution",
            id: "institution",
            type: "text",
            required: true,
        },
        {
            name: "Grade Point Avg",
            id: "grade_point_avg",
            type: "number",
            required: true,
        },
        {
            name: "Grade Point Scale",
            id: "grade_point_scale",
            type: "number",
            required: true,
        },
        {
            name: "From Year",
            id: "from_year",
            type: "text",
            required: true,
        },
        {
            name: "To Year",
            id: "to_year",
            type: "text",
            required: true,
        },
        {
            name: "Notes",
            id: "notes",
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

    let educationLevelAll = $state();

    async function getEducationLevelAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/education-level/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        educationLevelAll = await res.json();
    }

    


  const fetchUrl = '/employee-education/list';
  const updateUrl = '/employee-education/update';
  const deleteUrl = '/employee-education/delete';
  const createUrl = '/employee-education/create';
  const detailUrl = '/employee-education/detail';
  const namePage = 'Employee Education';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.education_level.level}</td>
            <td class="table-td">{row.institution}</td>
        </svelte:fragment>

        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getEducationLevelAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Last Education"
                        items={educationLevelAll.data}
                        labelFieldName="level"
                        valueFieldName="id"
                        bind:bindValue={formData.education_level_id}
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

        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
            {#await getEducationLevelAll() then _} 
            <AutocompleteComponents
                fieldLable="Last Education"
                items={educationLevelAll.data}
                labelFieldName="level"
                valueFieldName="id"
                bind:bindValue={formData.education_level_id}
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

        <!-- @migration-task: migrate this slot by hand, `add-row` is an invalid identifier -->
  <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <button class="button-table-add" onclick={() =>  {openAddRow(); nullform(); getEducationLevelAll(); getEmployeeAll();}}><p>Add</p></button>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `edit-row` is an invalid identifier -->
  <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" onclick={() =>  {detailTable(row.id); getEducationLevelAll(); getEmployeeAll();}}>Edit</button>
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>