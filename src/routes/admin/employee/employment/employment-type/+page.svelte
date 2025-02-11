<script>
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
  let { data } = $props();

    let formData = $state({
        code: null,
        description: null,
        permanent: null, // enum yes, no
    })

    let tableList = [
        {
            name: "Code",
            id: "code",
            type: "text",
            required: true
        },
        {
            name: "Description",
            id: "description",
            type: "text",
            required: true
        },
        {
            name: "Permanent",
            id: "permanent",
            type: "select",
            options: [
                {
                    name: "Yes",
                    value: "yes"
                },
                {
                    name: "No",
                    value: "no"
                }
            ],
            required: true
        },
    ]


  const fetchUrl = '/employment-type/list';
  const updateUrl = '/employment-type/update';
  const deleteUrl = '/employment-type/delete';
  const createUrl = '/employment-type/create';
  const detailUrl = '/employment-type/detail';
  const searchUrl = '/employment-type/search';
    const namePage = 'Employment Type';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
    </UniversalSetupTable>
</div>