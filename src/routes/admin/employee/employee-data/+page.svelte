<script>
	import AutocompleteComponents from '$lib/components/autocompleteComponents.svelte';
    import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
    export let data;

    let formData = {
    number_sequence_id: null, // required|exists:number_sequences,id
    name: null, // string|max:255
    type: null, // in:employee,freelance
    search_name: null, // string|max:255
    gender: null, // in:male,female
    birth_date: null, // date
    birth_place: null, // string|max:255
    blood_type: null, // in:A,B,AB,O
    religion: null, // in:Muslim,Protestant,Catholic,Hindu,Buddhist,Confucian
    ethnic_group: null, // string|max:255
    phone: null, // string|max:255
    email: null, // email|max:255
    marital_status: null, // in:single,married,divorced,widowed,none
    number_of_dependents: null, // integer|min:0
    status: null, // in:active,inactive
    last_education: null, // required|exists:education_levels,id
    clothes_size: null, // string|max:255
    shoes_size: null, // string|max:255
    entitle_leaved_per_month: null, // numeric|between:0,99999999.99
    img: null, // image|mimes:jpeg,png,jpg,gif,svg|max:4096
    identity_number: null, // string|max:255
    family_card_number: null, // string|max:255
    passport_number: null, // string|max:255
    passport_expired_date: null, // date
    tax_number: null, // string|max:255
    tax_start_date: null, // date
    classification_of_tax_payer_id: null, // required|exists:classification_of_tax_payers,id
    tax_paid_by_company: null, // in:yes,no
    tax_calculation_method: null, // in:gross,net,gross_up,none
    emergency_contact_name: null, // string|max:255
    emergency_contact_phone: null, // string|max:255
    emergency_contact_address: null, // string|max:255
    emergency_contact_relationship: null, // string|max:255
    bank_account: null, // string|max:255
    bank_branch: null, // string|max:255
    bank_no: null, // string|max:255
    bank_holder: null, // string|max:255
    bpjs_tk: null, // string|max:255
    bpjs_medical: null // string|max:255
    };

    let tableList = [
    {
        name: "Name",
        id: "name",
        type: "text",
        required: false,
    },
    {
        name: "Type",
        id: "type",
        type: "select",
        options: [
            {
                name: "Employee",
                value: "employee"
            },
            {
                name: "Freelance",
                value: "freelance"
            }
        ],
        required: false,
    },
    {
        name: "Search Name",
        id: "search_name",
        type: "text",
        required: false,
    },
    {
        name: "Gender",
        id: "gender",
        type: "select",
        options: [
            {
                name: "Male",
                value: "male"
            },
            {
                name: "Female",
                value: "female"
            },
            {
                name: "None",
                value: "none"
            }
        ],
        required: false,
    },
    {
        name: "Birth Date",
        id: "birth_date",
        type: "date",
        required: false,
    },
    {
        name: "Birth Place",
        id: "birth_place",
        type: "text",
        required: false,
    },
    {
        name: "Blood Type",
        id: "blood_type",
        type: "select",
        options: [
            {
                name: "A",
                value: "A"
            },
            {
                name: "B",
                value: "B"
            },
            {
                name: "AB",
                value: "AB"
            },
            {
                name: "O",
                value: "O"
            },
            {
                name: "None",
                value: "none"
            }
        ],
        required: false,
    },
    {
        name: "Religion",
        id: "religion",
        type: "select",
        options: [
            {
                name: "Muslim",
                value: "Muslim"
            },
            {
                name: "Protestant",
                value: "Protestant"
            },
            {
                name: "Catholic",
                value: "Catholic"
            },
            {
                name: "Hindu",
                value: "Hindu"
            },
            {
                name: "Buddhist",
                value: "Buddhist"
            },
            {
                name: "Confucian",
                value: "Confucian"
            },
            {
                name: "None",
                value: "none"
            }
        ],
        required: false,
    },
    {
        name: "Ethnic Group",
        id: "ethnic_group",
        type: "text",
        required: false,
    },
    {
        name: "Phone",
        id: "phone",
        type: "text",
        required: false,
    },
    {
        name: "Email",
        id: "email",
        type: "text",
        required: false,
    },
    {
        name: "Marital Status",
        id: "marital_status",
        type: "select",
        options: [
            {
                name: "Single",
                value: "single"
            },
            {
                name: "Married",
                value: "married"
            },
            {
                name: "Divorced",
                value: "divorced"
            },
            {
                name: "Widowed",
                value: "widowed"
            },
            {
                name: "None",
                value: "none"
            }
        ],
        required: false,
    },
    {
        name: "Number of Dependents",
        id: "number_of_dependents",
        type: "number",
        required: false,
    },
    {
        name: "Status",
        id: "status",
        type: "select",
        options: [
            {
                name: "Active",
                value: "active"
            },
            {
                name: "Inactive",
                value: "inactive"
            }
        ],
        required: false,
    },
    {
        name: "Clothes Size",
        id: "clothes_size",
        type: "text",
        required: false,
    },
    {
        name: "Shoes Size",
        id: "shoes_size",
        type: "text",
        required: false,
    },
    {
        name: "Entitle Leaved per Month",
        id: "entitle_leaved_per_month",
        type: "number",
        required: false,
    },
    {
        name: "Image",
        id: "img",
        type: "file",
        required: false,
    },
    {
        name: "Identity Number",
        id: "identity_number",
        type: "text",
        required: false,
    },
    {
        name: "Family Card Number",
        id: "family_card_number",
        type: "text",
        required: false,
    },
    {
        name: "Passport Number",
        id: "passport_number",
        type: "text",
        required: false,
    },
    {
        name: "Passport Expired Date",
        id: "passport_expired_date",
        type: "date",
        required: false,
    },
    {
        name: "Tax Number",
        id: "tax_number",
        type: "text",
        required: false,
    },
    {
        name: "Tax Start Date",
        id: "tax_start_date",
        type: "date",
        required: false,
    },
    {
        name: "Tax Paid by Company",
        id: "tax_paid_by_company",
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
        required: false,
    },
    {
        name: "Tax Calculation Method",
        id: "tax_calculation_method",
        type: "select",
        options: [
            {
                name: "Gross",
                value: "gross"
            },
            {
                name: "Net",
                value: "net"
            },
            {
                name: "Gross Up",
                value: "gross_up"
            },
            {
                name: "None",
                value: "none"
            }
        ],
        required: false,
    },
    {
        name: "Emergency Contact Name",
        id: "emergency_contact_name",
        type: "text",
        required: false,
    },
    {
        name: "Emergency Contact Phone",
        id: "emergency_contact_phone",
        type: "text",
        required: false,
    },
    {
        name: "Emergency Contact Address",
        id: "emergency_contact_address",
        type: "text",
        required: false,
    },
    {
        name: "Emergency Contact Relationship",
        id: "emergency_contact_relationship",
        type: "text",
        required: false,
    },
    {
        name: "Bank Account",
        id: "bank_account",
        type: "text",
        required: false,
    },
    {
        name: "Bank Branch",
        id: "bank_branch",
        type: "text",
        required: false,
    },
    {
        name: "Bank No",
        id: "bank_no",
        type: "text",
        required: false,
    },
    {
        name: "Bank Holder",
        id: "bank_holder",
        type: "text",
        required: false,
    },
    {
        name: "BPJS TK",
        id: "bpjs_tk",
        type: "text",
        required: false,
    },
    {
        name: "BPJS Medical",
        id: "bpjs_medical",
        type: "text",
        required: false,
    }
];
let detailMeta = [
    {
        name: "Name",
        id: "name",
        type: "text",
    },
    {
        name: "Type",
        id: "type",
        type: "text",
    },
    {
        name: "Search Name",
        id: "search_name",
        type: "text",
    },
    {
        name: "Gender",
        id: "gender",
        type: "text",
    },
    {
        name: "Birth Date",
        id: "birth_date",
        type: "date",
    },
    {
        name: "Birth Place",
        id: "birth_place",
        type: "text",
    },
    {
        name: "Blood Type",
        id: "blood_type",
        type: "text",
    },
    {
        name: "Religion",
        id: "religion",
        type: "text",
    },
    {
        name: "Ethnic Group",
        id: "ethnic_group",
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
        type: "email",
    },
    {
        name: "Marital Status",
        id: "marital_status",
        type: "text",
    },
    {
        name: "Number of Dependents",
        id: "number_of_dependents",
        type: "number",
    },
    {
        name: "Status",
        id: "status",
        type: "text",
    },
    {
        name: "Clothes Size",
        id: "clothes_size",
        type: "text",
    },
    {
        name: "Shoes Size",
        id: "shoes_size",
        type: "text",
    },
    {
        name: "Entitle Leaved per Month",
        id: "entitle_leaved_per_month",
        type: "number",
    },
    {
        name: "Image",
        id: "img_picture",
        type: "img",
    },
    {
        name: "Identity Number",
        id: "identity_number",
        type: "text",
    },
    {
        name: "Family Card Number",
        id: "family_card_number",
        type: "text",
    },
    {
        name: "Passport Number",
        id: "passport_number",
        type: "text",
    },
    {
        name: "Passport Expired Date",
        id: "passport_expired_date",
        type: "date",
    },
    {
        name: "Tax Number",
        id: "tax_number",
        type: "text",
    },
    {
        name: "Tax Start Date",
        id: "tax_start_date",
        type: "date",
    },
    {
        name: "Tax Paid by Company",
        id: "tax_paid_by_company",
        type: "text",
    },
    {
        name: "Tax Calculation Method",
        id: "tax_calculation_method",
        type: "text",
    },
    {
        name: "Emergency Contact Name",
        id: "emergency_contact_name",
        type: "text",
    },
    {
        name: "Emergency Contact Phone",
        id: "emergency_contact_phone",
        type: "text",
    },
    {
        name: "Emergency Contact Address",
        id: "emergency_contact_address",
        type: "text",
    },
    {
        name: "Emergency Contact Relationship",
        id: "emergency_contact_relationship",
        type: "text",
    },
    {
        name: "Bank Account",
        id: "bank_account",
        type: "text",
    },
    {
        name: "Bank Branch",
        id: "bank_branch",
        type: "text",
    },
    {
        name: "Bank No",
        id: "bank_no",
        type: "text",
    },
    {
        name: "Bank Holder",
        id: "bank_holder",
        type: "text",
    },
    {
        name: "BPJS TK",
        id: "bpjs_tk",
        type: "text",
    },
    {
        name: "BPJS Medical",
        id: "bpjs_medical",
        type: "text",
    }
];



    let educationLevelAll;
    async function getEducationLevelAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/education-level/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        educationLevelAll = await res.json();
    }

    let taxClassAll;
    async function getTaxClassAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/classification-of-tax-payer/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        taxClassAll = await res.json();
    }

    let numberSequenceAll;
    async function getNumberSequenceAll (){
        const res = await fetch(import.meta.env.VITE_API_URL + '/number-sequence/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });

        numberSequenceAll = await res.json();

        console.log(formData);
    }

  const fetchUrl = '/employee-data/list';
  const updateUrl = '/employee-data/update';
  const deleteUrl = '/employee-data/delete';
  const createUrl = '/employee-data/create';
  const detailUrl = '/employee-data/detail';
  const searchUrl = '/employee-data/search';
  const namePage = 'Employee Data';
</script>

<div class="w-full overflow-auto">
    <UniversalSetupTable {detailMeta} {namePage} data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} bind:formData={formData} tableList={tableList} {searchUrl}>

        <!-- <svelte:fragment slot="table-row" let:row let:index>
            <td class="table-td">{index + 1}</td>
            <td class="table-td">{row.no}</td>
            <td class="table-td">{row.name}</td>
            <td class="table-td">{row.type}</td>
            <td class="table-td">{row.gender}</td>
            <td class="table-td">{row.search_name}</td>
        </svelte:fragment> -->

        <svelte:fragment slot="aditional-form-create">
            {#await getTaxClassAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Classification Tax Payer"
                        items={taxClassAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.classification_of_tax_payer_id}
                        required={true}
                    />
            {/await}
            {#await getEducationLevelAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Last Education"
                        items={educationLevelAll.data}
                        labelFieldName="level"
                        valueFieldName="id"
                        bind:bindValue={formData.last_education}
                        required={true}
                    />
            {/await}
            {#await getNumberSequenceAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Number Sequence"
                        items={numberSequenceAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.number_sequence_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>

        <svelte:fragment slot="aditional-form-update">
            {#await getTaxClassAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Classification Tax Payer"
                        items={taxClassAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.classification_of_tax_payer_id}
                        required={true}
                    />
            {/await}
            {#await getEducationLevelAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Last Education"
                        items={educationLevelAll.data}
                        labelFieldName="level"
                        valueFieldName="id"
                        bind:bindValue={formData.last_education}
                        required={true}
                    />
            {/await}
            {#await getNumberSequenceAll() then _} 
                    <AutocompleteComponents
                        fieldLable="Number Sequence"
                        items={numberSequenceAll.data}
                        labelFieldName="code"
                        valueFieldName="id"
                        bind:bindValue={formData.number_sequence_id}
                        required={true}
                    />
            {/await}
        </svelte:fragment>
        
    </UniversalSetupTable>
</div>