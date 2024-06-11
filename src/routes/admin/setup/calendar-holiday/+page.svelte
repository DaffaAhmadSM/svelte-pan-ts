<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        code: null,
        date: null,
        remarks: null,
    }

    let tableList = [
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "Date",
            id: "date",
            type: "date"
        },
        {
            name: "Remarks",
            id: "remarks",
            type: "text"
        }
    ]


  const fetchUrl = '/calendar-holiday/list';
  const updateUrl = '/calendar-holiday/update';
  const deleteUrl = '/calendar-holiday/delete';
  const createUrl = '/calendar-holiday/create';
  const detailUrl = '/calendar-holiday/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Company Setup</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>