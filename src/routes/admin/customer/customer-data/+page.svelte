<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { toastTrigger, toastTriggerLoading, toastTriggerUpdate } from '$lib/helpers/toasterTrigger.js';
	import { name } from '@melt-ui/svelte';
    export let data;

    let formData = {
        number_sequence_id: null,
        no: null,
        name: null,
        address: null,
        phone: null,
        email: null,
        fax: null,
        description: null,
        working_hour_id: null,
        compare_type: null,
    }

    let tableList = [
        {
            name: "No",
            id: "no",
            type: "text",
            disabled : false
        },
        {
            name: "Name",
            id: "name",
            type: "text",
            required: true
        },
        {
            name: "Address",
            id: "address",
            type: "text",
            required: true
        },
        {
            name: "Phone",
            id: "phone",
            type: "text",
            required: true
        },
        {
            name: "Email",
            id: "email",
            type: "text",
            required: true
        },
        {
            name: "Fax",
            id: "fax",
            type: "text",
            required: true
        },
        {
            name: "compare type",
            id: "compare_type",
            type: "select",
            options: [
                {
                    name: "MCD",
                    value: "mcd"
                },
            ]
        },
    ]

    let detailMeta = [
        {
            name: "No",
            id: "no",
            type: "text",
        },
        {
            name: "Name",
            id: "name",
            type: "text",
        },
        {
            name: "Address",
            id: "address",
            type: "text",
        },
        {
            name: "Phone",
            id: "phone",
            type: "text",
        },
        {
            name: "Email",
            id: "email",
            type: "text",
        },
        {
            name: "Fax",
            id: "fax",
            type: "text",
        },
        {
            name: "Working Hour",
            id: "working_hour.code",
            type: "text",
        },
        {
            name: "Working Hour Detail",
            id: "working_hour.working_hour_detail",
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

    let numberSequenceAll;
    let workingHourAll;

    async function getWorkingHourAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/working-hour/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        workingHourAll = await res.json();
    }

    async function workingHourChange(e){
        const res = await fetch(import.meta.env.VITE_API_URL + '/working-hour/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        const data = await res.json();
        formData.working_hour_id = data.data.id;
    }

    async function getNumberSequenceAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        numberSequenceAll = await res.json();
    }

    async function numberSequenceChange(e){
        const toastId = toastTriggerLoading("Loading...");
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/detail/' + e.target.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        const data = await res.json();
        toastTriggerUpdate("Data Updated", toastId);
        formData.no = data.data.code +  data.data.current_number;
    }

  const fetchUrl = '/customer/list';
  const updateUrl = '/customer/update';
  const deleteUrl = '/customer/delete';
  const createUrl = '/customer/create';
  const detailUrl = '/customer/detail';
  const namePage = 'Customer Data';
</script>

<div class="table-container">
    <UniversalSetupTable {detailMeta} {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <svelte:fragment slot="aditional-form-create">
            {#await getNumberSequenceAll() then _}
            <fieldset class="table-fieldset">
                <div class="table-field-label">Number Sequence</div>
                <select name="number_sequence" bind:value={formData.number_sequence_id} class="table-field-input" on:change={numberSequenceChange}>
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.id}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
            {#await getWorkingHourAll() then }
            <fieldset class="table-fieldset">
                <label class="table-field-label" for="working_hour">Working Hour</label>
                <select name="working_hour" bind:value={formData.working_hour_id} class="table-field-input" on:change={workingHourChange}>
                    {#if workingHourAll}
                        {#each workingHourAll.data as workingHour}
                            <option value={workingHour.id}>{workingHour.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
        </svelte:fragment>
        <svelte:fragment slot="aditional-form-update">
            {#await getNumberSequenceAll() then _}
            <fieldset class="table-fieldset">
                <div class="table-field-label">Number Sequence</div>
                <select name="number_sequence" bind:value={formData.number_sequence_id} class="table-field-input" on:change={numberSequenceChange}>
                    {#if numberSequenceAll}
                        {#each numberSequenceAll.data as numberSequence}
                            <option value={numberSequence.id}>{numberSequence.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
            {#await getWorkingHourAll() then }
            <fieldset class="table-fieldset">
                <label class="table-field-label" for="working_hour">Working Hour</label>
                <select name="working_hour" bind:value={formData.working_hour_id} class="table-field-input" on:change={workingHourChange}>
                    {#if workingHourAll}
                        {#each workingHourAll.data as workingHour}
                            <option value={workingHour.id}>{workingHour.code}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
            
        </svelte:fragment>
    </UniversalSetupTable>
</div>