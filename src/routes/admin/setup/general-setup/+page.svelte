<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
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
    })

    let tableList = []

    let detailMeta = [
        {
            name: "Customer",
            id: "customer",
            type: "text",
        },
        {
            name: "Customer Invoice",
            id: "customer_invoice",
            type: "text",
        },
        {
            name: "Customer Contract",
            id: "customer_contract",
            type: "text",
        },
        {
            name: "Customer Timesheet",
            id: "customer_timesheet",
            type: "text",
        },
        {
            name: "Employee",
            id: "employee",
            type: "text",
        },
        {
            name: "Leave Request",
            id: "leave_request",
            type: "text",
        },
        {
            name: "Leave Adjustment",
            id: "leave_adjustment",
            type: "text",
        },
        {
            name: "Timesheet",
            id: "timesheet",
            type: "text",
        },
        {
            name: "Invent Journal",
            id: "invent_journal_id",
            type: "text",
        },
        {
            name: "Inventory Transaction",
            id: "invent_trans_id",
            type: "text",
        },
        {
            name: "Vacancy No",
            id: "vacancy_no",
            type: "text",
        },
    ]

    let numberSequenceAll = $state();

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
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        const data = await res.json();
        formData.customer = data.data.code;
    }

    

  const fetchUrl = '/general-setup/list';
  const updateUrl = '/general-setup/update';
  const deleteUrl = '/general-setup/delete';
  const createUrl = '/general-setup/create';
  const detailUrl = '/general-setup/detail';
  const namePage = 'General Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {detailMeta}{namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getNumberSequenceAll() then _}
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer</div>
                <select name="number_sequence" bind:value={formData.customer} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Invoice</div>
                <select name="number_sequence" bind:value={formData.customer_invoice} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Contract</div>
                <select name="number_sequence" bind:value={formData.customer_contract} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Timesheet</div>
                <select name="number_sequence" bind:value={formData.customer_timesheet} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Employee</div>
                <select name="number_sequence" bind:value={formData.employee} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Leave Request</div>
                <select name="number_sequence" bind:value={formData.leave_request} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Leave Adjustment</div>
                <select name="number_sequence" bind:value={formData.leave_adjustment} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Timesheet</div>
                <select name="number_sequence" bind:value={formData.timesheet} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Invent Journal</div>
                <select name="number_sequence" bind:value={formData.invent_journal_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Invent Transaction</div>
                <select name="number_sequence" bind:value={formData.invent_trans_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Vacancy No</div>
                <select name="number_sequence" bind:value={formData.vacancy_no} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
        {#await getNumberSequenceAll() then _}
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer</div>
                <select name="number_sequence" bind:value={formData.customer} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Invoice</div>
                <select name="number_sequence" bind:value={formData.customer_invoice} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Contract</div>
                <select name="number_sequence" bind:value={formData.customer_contract} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Customer Timesheet</div>
                <select name="number_sequence" bind:value={formData.customer_timesheet} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Employee</div>
                <select name="number_sequence" bind:value={formData.employee} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Leave Request</div>
                <select name="number_sequence" bind:value={formData.leave_request} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Leave Adjustment</div>
                <select name="number_sequence" bind:value={formData.leave_adjustment} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Timesheet</div>
                <select name="number_sequence" bind:value={formData.timesheet} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Invent Journal</div>
                <select name="number_sequence" bind:value={formData.invent_journal_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Invent Transaction</div>
                <select name="number_sequence" bind:value={formData.invent_trans_id} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="mb-4 flex items-center gap-5">
                <div class="w-[90px] text-right text-black">Vacancy No</div>
                <select name="number_sequence" bind:value={formData.vacancy_no} class="inline-flex h-8 w-full flex-1
                              rounded-sm px-3 leading-none text-black input input-bordered">
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.code}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>