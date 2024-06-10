<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
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
            type: "text"
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


  const fetchUrl = '/general-setup/list';
  const updateUrl = '/general-setup/update';
  const deleteUrl = '/general-setup/delete';
  const createUrl = '/general-setup/create';
  const detailUrl = '/general-setup/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Company Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>

        <svelte:fragment slot="aditional-form-create">
            <fieldset class="mb-4 flex items-center gap-5">
                <!-- <select value={}></select> -->
            </fieldset>
        </svelte:fragment>
    </UniversalSetupTable>
</div>