<script>
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        code: null,
        description: null,
        permanent: null, // enum yes, no
    }

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
</script>

<div class="w-full overflow-auto">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Employment Type</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
    </UniversalSetupTable>
</div>