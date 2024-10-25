<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        working_hours_id: null,
        hours: null,
        day: null,
    });

    let tableList = [
    {
        name: "Day",
        id: "day",
        type: "select",
        options: [
            {
                name: "Monday",
                value: "Monday"
            },
            {
                name: "Tuesday",
                value: "Tuesday"
            },
            {
                name: "Wednesday",
                value: "Wednesday"
            },
            {
                name: "Thursday",
                value: "Thursday"
            },
            {
                name: "Friday",
                value: "Friday"
            },
            {
                name: "Saturday",
                value: "Saturday"
            },
            {
                name: "Sunday",
                value: "Sunday"
            },
        ],
        required: true
    },
    {
        name: "Hour",
        id: "hours",
        type: "number",
        required: true
    },
];

    let workingHourAll = $state();
    async function getWorkingHour (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/working-hour/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        workingHourAll = await res.json();
    }


  const fetchUrl = '/working-hour-detail/list';
  const updateUrl = '/working-hour-detail/update';
  const deleteUrl = '/working-hour-detail/delete';
  const createUrl = '/working-hour-detail/create';
  const detailUrl = '/working-hour-detail/detail';
  const searchUrl = '/working-hour-detail/search';
    const namePage = 'Working Hours Detail';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.working_hour.code}</td>
            <td class="table-td">{row.day}</td>
            <td class="table-td">{row.hours}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getWorkingHour() then _} 
                    <AutocompleteComponents
                        fieldLable="Working Hour"
                        items={workingHourAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.working_hours_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>

        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
                {#await getWorkingHour() then _} 
                <AutocompleteComponents
                    fieldLable="Working Hour"
                    items={workingHourAll.data}
                    labelFieldName="code"
                    valueFieldName="id"
                    bind:bindValue={formData.working_hours_id}
                    required={false}
                />
                {/await}
        </svelte:fragment>
    </UniversalSetupTable>
</div>