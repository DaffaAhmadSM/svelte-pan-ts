<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        job_skill_id: null,
        employee_id: null,
        notes: null,
    }

    let tableList = [
        {
            name: "Notes",
            id: "notes",
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

    let jobSkillALL;

    async function getJobSkillAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/job-skill/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        jobSkillALL = await res.json();
    }


  const fetchUrl = '/employee-skill/list';
  const updateUrl = '/employee-skill/update';
  const deleteUrl = '/employee-skill/delete';
  const createUrl = '/employee-skill/create';
  const detailUrl = '/employee-skill/detail';
  const searchUrl = '/employee-skill/search';
</script>

<div class="w-full overflow-auto">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Employee education</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.employee.no}</td>
            <td class="table-td">{row.job_skill.skill}</td>
            <td class="table-td">{row.description}</td>
            <td class="table-td">{row.type}</td>
        </svelte:fragment>

        <svelte:fragment slot="aditional-form-create">
            {#await getJobSkillAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Job Skill"
                        items={jobSkillALL.data}
                        labelFieldName="skill"
                        valueFieldName="id"
                        bind:bindValue={formData.job_skill_id}
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
            {#await getJobSkillAll() then _} 
            <AutocompleteComponents
                fieldLable="Job Skill"
                items={jobSkillALL.data}
                labelFieldName="skill"
                valueFieldName="id"
                bind:bindValue={formData.job_skill_id}
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
            <button class="button-table-add" on:click={() =>  {openAddRow(); nullform(); getJobSkillAll(); getEmployeeAll();}}><p>Add</p></button>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getJobSkillAll(); getEmployeeAll();}}>Edit</button>
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>