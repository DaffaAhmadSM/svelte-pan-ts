<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

    let formData = {
        code: null,
        description: null,
    }

    let tableList = [
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "description",
            id: "description",
            type: "text"
        }
    ]
    
    let detailMeta = [
        {
            name: "Code",
            id: "code",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
        {
            name: "Working Hour Detail",
            id: "working_hour_detail",
            type: "array",
            arrayGuide: [
                {
                    name: "Day",
                    main_key: true,
                    id: "day",
                    type: "text"
                },
                {
                    name: "Hours",
                    id: "hours",
                    type: "text"
                },
            ]
        }
    ]


  const fetchUrl = '/working-hour/list';
  const updateUrl = '/working-hour/update';
  const deleteUrl = '/working-hour/delete';
  const createUrl = '/working-hour/create';
  const detailUrl = '/working-hour/detail';
  const namePage = 'Working Hour Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {detailMeta} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList} {namePage}></UniversalSetupTable>
</div>