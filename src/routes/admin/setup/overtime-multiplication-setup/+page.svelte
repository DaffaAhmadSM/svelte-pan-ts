<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
  let { data } = $props();

    let formData = $state({
        day_type: null,
        day: null,
        from_hour: null,
        to_hour: null,
        multiplication_calc_id: null,
    })

    let tableList = [
        {
            name: "Day Type",
            id: "day_type",
            type: "text"
        },
        {
            name: "Day",
            id: "day",
            type: "text"
        },
        {
            name: "From Hour",
            id: "from_hours",
            type: "number"
        },
        {
            name: "To Hour",
            id: "to_hours",
            type: "number"
        },
    ]

    let multiplicationCalcAll = $state();

    async function getMultiplicationAll() {
        const getMultiplicationCalc = await fetch(import.meta.env.VITE_API_URL +'/multiplication-calculation/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        multiplicationCalcAll = await getMultiplicationCalc.json();
    }

    async function multiplicationCalcChange(e) {
        const getDetail = await fetch(import.meta.env.VITE_API_URL +'/multiplication-calculation/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        const data = await getDetail.json();
        formData.multiplication_calc_id = data.data.id
    }


  const fetchUrl = '/overtime-multiplication-setup/all';
  const updateUrl = '/overtime-multiplication-setup/update';
  const deleteUrl = '/overtime-multiplication-setup/delete';
  const createUrl = '/overtime-multiplication-setup/create';
  const detailUrl = '/overtime-multiplication-setup/detail';
    const namePage = 'Overtime Multiplication Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} formData={formData} tableList={tableList}>
    <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
        {#await getMultiplicationAll() then _}
            <AutocompleteComponents
                fieldLable="Multiplication Calculator"
                items={multiplicationCalcAll.data.data}
                labelFieldName="code"
                valueFieldName="id"
                bind:bindValue={formData.multiplication_calc_id}
                required={true}
            />
        {/await}
    </svelte:fragment>
    <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
        {#await getMultiplicationAll() then _}
            <AutocompleteComponents
                fieldLable="Multiplication Calculator"
                items={multiplicationCalcAll.data.data}
                labelFieldName="code"
                valueFieldName="id"
                bind:bindValue={formData.multiplication_calc_id}
                required={true}
            />
        {/await}
    </svelte:fragment>

    </UniversalSetupTable>
</div>