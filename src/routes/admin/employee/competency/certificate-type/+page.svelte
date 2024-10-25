<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger.js';
  let { data } = $props();

    let formData = $state({
        type: null,
        description: null,
        certificate_classification_id: null,
        required_renewal: null
    })

    let tableList = [
        {
            name: "Type",
            id: "type",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text"
        },
    ]
    let renewalitems = [
        {
            name: "Yes",
            value: "yes"
        },
        {
            name: "No",
            value: "no"
        }
    ]

  let classificationAll = $state();

  async function getCertificationAll(){

        const res = await fetch(import.meta.env.VITE_API_URL + '/certificate-classification/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        classificationAll = await res.json();
    }

  const fetchUrl = '/certificate-type/list';
  const updateUrl = '/certificate-type/update';
  const deleteUrl = '/certificate-type/delete';
  const createUrl = '/certificate-type/create';
  const detailUrl = '/certificate-type/detail';
  const namePage = 'Certificate Type Setup';
</script>

<div class="table-container">
    <UniversalSetupTable {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList}>
        <!-- @migration-task: migrate this slot by hand, `table-row` is an invalid identifier -->
  <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.type}</td>
            <td class="table-td">{row.description}</td>
            <td class="table-td">{row.classification.classification}</td>
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-create` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-create">
            {#await getCertificationAll() then _}
            <AutocompleteComponents
            fieldLable="Classification"
            items={classificationAll.data.data}
            labelFieldName="classification"
            valueFieldName="id"
            bind:bindValue={formData.certificate_classification_id}
            required={true}
            
            />
            {/await}

            <AutocompleteComponents
            fieldLable="Renewal"
            items={renewalitems}
            labelFieldName="name"
            valueFieldName="value"
            bind:bindValue={formData.required_renewal}
            required={true}
            
            />
        </svelte:fragment>
        <!-- @migration-task: migrate this slot by hand, `aditional-form-update` is an invalid identifier -->
  <svelte:fragment slot="aditional-form-update">
            {#await getCertificationAll() then _}
            <AutocompleteComponents
            fieldLable="Classification"
            items={classificationAll.data.data}
            labelFieldName="classification"
            valueFieldName="id"
            bind:bindValue={formData.certificate_classification_id}
            required={true}
            
            />
            {/await}
            <AutocompleteComponents
            fieldLable="Renewal"
            items={renewalitems}
            labelFieldName="name"
            valueFieldName="value"
            bind:bindValue={formData.required_renewal}
            required={true}
            
            />
        </svelte:fragment>
    </UniversalSetupTable>
</div>