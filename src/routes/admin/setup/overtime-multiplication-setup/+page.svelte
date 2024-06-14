<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        day_type: null,
        day: null,
        from_hour: null,
        to_hour: null,
        multiplication_calc_id: null,
    }

    let tableList = [
        {
            name: "Day Type",
            id: "day_type",
            type: "text"
        },
        {
            name: "Day",
            id: "day",
            type: "text"
        },
        {
            name: "From Hour",
            id: "from_hours",
            type: "number"
        },
        {
            name: "To Hour",
            id: "to_hours",
            type: "number"
        },
    ]

    let multiplicationCalcAll;

    async function getMultiplicationAll() {
        const getMultiplicationCalc = await fetch(import.meta.env.VITE_API_URL +'/multiplication-calculation/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        multiplicationCalcAll = await getMultiplicationCalc.json();
    }

    async function multiplicationCalcChange(e) {
        const getDetail = await fetch(import.meta.env.VITE_API_URL +'/multiplication-calculation/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        const data = await getDetail.json();
        formData.multiplication_calc_id = data.data.id
    }


  const fetchUrl = '/overtime-multiplication-setup/all';
  const updateUrl = '/overtime-multiplication-setup/update';
  const deleteUrl = '/overtime-multiplication-setup/delete';
  const createUrl = '/overtime-multiplication-setup/create';
  const detailUrl = '/overtime-multiplication-setup/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Overtime Multiplication Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}>
    <svelte:fragment slot="aditional-form-create">
        <fieldset class="mb-4 flex items-center gap-5">
            <div class="w-[90px] text-right text-black">Multiplication Calculator</div>
            <select name="multiplication_setup" bind:value={formData.multiplication_calc_id} class="inline-flex h-8 w-full flex-1
                            rounded-sm px-3 leading-none text-black input input-bordered">
                {#if multiplicationCalcAll}
                    {#each multiplicationCalcAll.data.data as multiplicationCalc}
                        <option value={multiplicationCalc.id}>{multiplicationCalc.code}</option>
                    {/each}
                {/if}
            </select>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="aditional-form-update">
        <fieldset class="mb-4 flex items-center gap-5">
            <div class="w-[90px] text-right text-black">Multiplication Calculator</div>
            <select name="multiplication_setup" bind:value={formData.multiplication_calc_id} class="inline-flex h-8 w-full flex-1
                            rounded-sm px-3 leading-none text-black input input-bordered">
                {#if multiplicationCalcAll}
                    {#each multiplicationCalcAll.data.data as multiplicationCalc}
                        <option value={multiplicationCalc.id}>{multiplicationCalc.code}</option>
                    {/each}
                {/if}
            </select>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="add-row" let:prop={modal} let:nullform={nullform}>
        <div class="m-2 flex justify-end">
            <button class="p-3 bg-info rounded-lg" on:click={() =>  {modal.showModal(); nullform(); getMultiplicationAll();}}>Add</button>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
        <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id.main_id); getMultiplicationAll();}}>Edit</button>
    </svelte:fragment>

    </UniversalSetupTable>
</div>