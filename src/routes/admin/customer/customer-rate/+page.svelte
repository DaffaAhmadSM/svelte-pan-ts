<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { toastTriggerLoading, toastTriggerUpdate } from '$lib/helpers/toasterTrigger.js';
  let { data } = $props();

    let formData = $state({
        number_sequence_id: null,
        code: null,
        contract_no: null,
        description: null,
        customer_id: null,
    })

    let tableList = [
        {
            name: "Type",
            id: "type",
            type: "select",
            options: [
                {
                    name: "Hourly",
                    value: "hourly"
                },
                {
                    name: "Daily",
                    value: "daily"
                },
                {
                    name: "Monthly",
                    value: "monthly"
                },
                {
                    name: "Yearly",
                    value: "yearly"
                }
            ]
        },
        {
            name: "Rate",
            id: "rate",
            type: "number"
        },
    ]

    let positionAll = $state();
    let customerContractAll = $state();
    let customerAll = $state();
    async function getCustomerAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/customer/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        customerAll = await res.json();
    }
    async function getCustomerContractAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/customer-contract/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        customerContractAll = await res.json();
    }
    async function getPositionAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/position/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        positionAll = await res.json();
    }

   function parseIntConcurency(rate){
       return Intl.NumberFormat().format(rate)
    }

    


  const fetchUrl = '/customer-rate/list';
  const updateUrl = '/customer-rate/update';
  const deleteUrl = '/customer-rate/delete';
  const createUrl = '/customer-rate/create';
  const detailUrl = '/customer-rate/detail';
  const namePage = 'Customer Rate';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.customer.no}</td>
            <td class="table-td">{row.type}</td>
            <td class="table-td">{parseIntConcurency(row.rate)}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            <fieldset class="table-fieldset">
                <div class="table-field-label">Position</div>
                <select name="number_sequence" bind:value={formData.position_id} class="table-field-input">
                    {#if positionAll}
                        {#each positionAll.data as position}
                            <option value={position.id}>{position.name}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="table-fieldset">
                <div class="table-field-label">Customer Contract</div>
                <select name="number_sequence" bind:value={formData.customer_contract_id} class="table-field-input">
                    {#if customerContractAll}
                        {#each customerContractAll.data as customerContract}
                            <option value={customerContract.id}>{customerContract.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="table-fieldset">
                <div class="table-field-label">Customer</div>
                <select name="number_sequence" bind:value={formData.customer_id} class="table-field-input">
                    {#if customerAll}
                        {#each customerAll.data as customer}
                            <option value={customer.id}>{customer.no}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
            <fieldset class="table-fieldset">
                <div class="table-field-label">Position</div>
                <select name="number_sequence" bind:value={formData.position_id} class="table-field-input">
                    {#if positionAll}
                        {#each positionAll.data as position}
                            <option value={position.id}>{position.name}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="table-fieldset">
                <div class="table-field-label">Customer Contract</div>
                <select name="number_sequence" bind:value={formData.customer_contract_id} class="table-field-input">
                    {#if customerContractAll}
                        {#each customerContractAll.data as customerContract}
                            <option value={customerContract.id}>{customerContract.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            <fieldset class="table-fieldset">
                <div class="table-field-label">Customer</div>
                <select name="number_sequence" bind:value={formData.customer_id} class="table-field-input">
                    {#if customerAll}
                        {#each customerAll.data as customer}
                            <option value={customer.id}>{customer.no}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `add-row` is an invalid identifier -->
  <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <button class="button-table-add" onclick={() =>  { getCustomerContractAll(); getCustomerAll(); getPositionAll(); openAddRow(); nullform();}}><p>Add</p></button>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `edit-row` is an invalid identifier -->
  <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" onclick={() =>  {detailTable(row.id); getCustomerContractAll(); getCustomerAll(); getPositionAll()}}>Edit</button>
        </svelte:fragment>
    </UniversalSetupTable>
</div>