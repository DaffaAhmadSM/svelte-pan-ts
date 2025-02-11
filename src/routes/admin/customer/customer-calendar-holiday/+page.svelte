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
            name: "Code",
            id: "code",
            type: "text",
        },
        {
            name: "Contract No",
            id: "contract_no",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]

    let numberSequenceAll;
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


  const fetchUrl = '/customer-calendar-holiday/list';
  const updateUrl = '/customer-calendar-holiday/update';
  const deleteUrl = '/customer-calendar-holiday/delete';
  const createUrl = '/customer-calendar-holiday/create';
  const detailUrl = '/customer-calendar-holiday/detail';
    const namePage = 'Customer Calendar Holiday Setup';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.date}</td>
            <td class="table-td">{row.remarks}</td>
            <td class="table-td">{row.customer.no}</td>
            <td class="table-td">{row.customer.name}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
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
  <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
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
  <!-- @migration-task: migrate this slot by hand, `add-row` is an invalid identifier -->
  <svelte:fragment slot="add-row" let:nullform={nullform} let:openAddRow>
            <button class="button-table-add" onclick={() =>  {openAddRow(); nullform(); getCustomerAll();}}><p>Add</p></button>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `edit-row` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `edit-row` is an invalid identifier -->
  <svelte:fragment slot="edit-row" let:prop={row} let:detailTable={detailTable}>
            <button class="btn btn-warning hover:btn-error" onclick={() =>  {detailTable(row.id); getCustomerAll();}}>Edit</button>
        </svelte:fragment>
    </UniversalSetupTable>
</div>