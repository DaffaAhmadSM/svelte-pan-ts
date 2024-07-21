<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        name: null,
        code: null,
        grade: null,
    }

    let gradeAll;

    let tableList = [
        {
            name: "Name",
            id: "name",
            type: "text"
        },
        {
            name: "Position",
            id: "position",
            type: "text"
        },
    ]

    async function getGradeAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/grade/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        gradeAll = await res.json();
    }


  const fetchUrl = '/position/list';
  const updateUrl = '/position/update';
  const deleteUrl = '/position/delete';
  const createUrl = '/position/create';
  const detailUrl = '/position/detail';
  const namePage = 'Position Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.name}</td>
            <td class="table-td">{row.position}</td>
            <td class="table-td">{row.grade.name}</td>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-create">
            <fieldset class="table-fieldset">
                <div class="table-field-label">Grade</div>
                <select name="number_sequence" bind:value={formData.grade_id} class="table-field-input">
                    {#if gradeAll}
                        {#each gradeAll.data as grade}
                            <option value={grade.id}>{grade.name}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-update">
            <fieldset class="table-fieldset">
                <div class="table-field-label">Grade</div>
                <select name="number_sequence" bind:value={formData.grade_id} class="table-field-input">
                    {#if gradeAll}
                        {#each gradeAll.data as grade}
                            <option value={grade.id}>{grade.name}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <button class="button-table-add" on:click={() =>  {openAddRow(); nullform(); getGradeAll();}}><p>Add</p></button>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getGradeAll();}}>Edit</button>
        </svelte:fragment>
    </UniversalSetupTable>
</div>