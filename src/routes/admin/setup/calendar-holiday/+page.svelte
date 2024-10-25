<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

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
  const namePage = 'Calendar Holiday Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}></UniversalSetupTable>
</div>