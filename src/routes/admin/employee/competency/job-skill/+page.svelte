<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    export let data;

    let formData = {
        skill: null,
        type: null,
        description: null,
    }

    let tableList = [
        {
            name: "skill",
            id: "skill",
            type: "text"
        },
        {
            name: "type",
            id: "type",
            type: "select",
            options: [
                {
                    name: "Hard Skill",
                    value: "hard"
                },
                {
                    name: "Soft Skill",
                    value: "soft"
                }
            ]
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]


  const fetchUrl = '/job-skill/list';
  const updateUrl = '/job-skill/update';
  const deleteUrl = '/job-skill/delete';
  const createUrl = '/job-skill/create';
  const detailUrl = '/job-skill/detail';
</script>

<div class="table-container">
    <div class="flex w-full flex-col mb-6">
        <h1 class="text-5xl">Job Skill</h1>
    </div>
    <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}></UniversalSetupTable>
</div>