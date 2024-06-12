<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
        number_sequence_id: null,
        customer: null,
        customer_invoice: null,
        customer_contract: null,
        customer_timesheet: null,
        employee: null,
        leave_request: null,
        leave_adjustment: null,
        timesheet: null,
        invent_journal_id: null,
        invent_trans_id: null,
        vacancy_no: null,
    }

    let tableList = [
        {
            name: "Customer",
            id: "customer",
            type: "text",
            disabled: true
        },
        {
            name: "Customer Invoice",
            id: "customer_invoice",
            type: "text"
        },
        {
            name: "Customer Contract",
            id: "customer_contract",
            type: "text"
        },
        {
            name: "Customer Timesheet",
            id: "customer_timesheet",
            type: "text"
        },
        {
            name: "Employee",
            id: "employee",
            type: "text"
        },
        {
            name: "Leave Request",
            id: "leave_request",
            type: "text"
        },
        {
            name: "Leave Adjustment",
            id: "leave_adjustment",
            type: "text"
        },
        {
            name: "Timesheet",
            id: "timesheet",
            type: "text"
        },
        {
            name: "Invent Journal",
            id: "invent_journal_id",
            type: "text"
        },
        {
            name: "Inventory Transaction",
            id: "invent_trans_id",
            type: "text"
        },
        {
            name: "Vacancy No",
            id: "vacancy_no",
            type: "text"
        },
    ]

    let numberSequenceAll;

    async function getNumberSequenceAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        numberSequenceAll = await res.json();
    }

    async function numberSequenceChange(e){
        console.log(e.target.value);
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        const data = await res.json();
        formData.customer = data.data.code + data.data.current_number;
    }

    

  const fetchUrl = '/general-setup/list';
  const updateUrl = '/general-setup/update';
  const deleteUrl = '/general-setup/delete';
  const createUrl = '/general-setup/create';
  const detailUrl = '/general-setup/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">General Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        {@debug numberSequenceAll}
        <svelte:fragment slot="aditional-form-create">
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black">Number Sequence</label>
                <select name="number_sequence" bind:value={formData.number_sequence_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered" on:change={numberSequenceChange}>
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data.data as numberSequence}
                            <option value={numberSequence.id}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-update">
            <fieldset class="mb-4 flex items-center gap-5">
                <label class="w-[90px] text-right text-black">Number Sequence</label>
                <select name="number_sequence" bind:value={formData.number_sequence_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered" on:change={numberSequenceChange}>
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data.data as numberSequence}
                            <option value={numberSequence.id}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <svelte:fragment slot="add-row" let:prop={modal} let:nullform={nullform}>
            <div class="m-2 flex justify-end">
                <button class="p-3 bg-info rounded-lg" on:click={() =>  {modal.showModal(); nullform(); getNumberSequenceAll();}}>Add</button>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" on:click={() =>  {detailTable(row.id); getNumberSequenceAll();}}>Edit</button>
        </svelte:fragment>
    </UniversalSetupTable>
</div>