<script>
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { fade } from 'svelte/transition';
	import UniversalTableField from '$lib/components/universal-table-field.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    import { Tabs, Dialog } from "bits-ui";
    export let data;
    let tableLoading = false;
    let editModal = false;
    let loading =  false
    let alertResolveModal = false;


    let observer
    $: {
        if (observer) {
            infiniteScroll({
                fetch: loadMore,
                element: observer,
            });
        }
    }


    let stateEdit = {
        /** 
         * @type {string | "pns" | "mcd"}
         */
        side:null,
        // data id for table temp pns or mcd
        id:null,
        // id for table different pns or mcd
        parent_id: null,
        // data index in data.diff.data
        index_id: null,
    }
    let formData = {
        kronos_job_number:null,
        oracle_job_number:null,
        employee_name:null,
        parent_id:null,
        date:null,
        value:null
    }

    let tableList = [
        {
            name: "Kronos Job Number",
            id: "kronos_job_number",
            type: "text",
            disabled: true
        },
        {
            name: "Oracle Job Number",
            id: "oracle_job_number",
            type: "text",
            disabled: true
        },
        {
            name: "Employee Name",
            id: "employee_name",
            type: "text",
            disabled: true
        },
        {
            name: "Parent Id",
            id: "parent_id",
            type: "text",
            disabled: true
        },
        {
            name: "Date",
            id: "date",
            type: "text",
            disabled: true
        },
        {
            name: "Value",
            id: "value",
            type: "number"
        },
    ]

    const pnsFormData = {
        value: null,
    }

    const pnsTableList = [
        {
            name: "Value",
            id: "value",
            type: "number"
        },
    ]

    function loadMore() {
        loading = true
    }

    let conflictId = null;
    async function resolveConflict(id) {
        let toastId = toastTriggerLoading("resolving...");
        const response = await fetch(import.meta.env.VITE_API_URL + '/timesheet/resolve-compare-conflict/id/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            },
        });

        if (!response.ok) {
            toastTrigger("error resolving conflict", toastId, response.status);
            return;
        }

        toastTrigger("resolved", toastId, response.status);
        data.diff = await reFetchDiff();
        alertResolveModal = false;

        return await response.json();
    }

    async function reFetchDiff() {
        const diff = await fetch(import.meta.env.VITE_API_URL + '/timesheet/list-diff/' + data.timesheet.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });

        if (!diff.ok) {
            toastTrigger("error resolving conflict", null, diff.status);
            return;
        }

        return await diff.json();
    }

    async function editCompare() {
        const toastId = toastTriggerLoading("saving...");
        const edit = await fetch(import.meta.env.VITE_API_URL + '/timesheet/edit-compare-conflict-value/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            },
            body: JSON.stringify({
                pns_mcd_diff_id: stateEdit.parent_id,
                side: stateEdit.side,
                id: stateEdit.id,
                value: formData.value
            })
        })

        if (!edit.ok) {
            toastTrigger(edit.statusText, toastId, edit.status);
            return;
        }

        data.diff.data[stateEdit.index_id] = await reFetchDiffDetail(stateEdit.parent_id);
        editModal = false;
        formData = {
            kronos_job_number:null,
            oracle_job_number:null,
            employee_name:null,
            parent_id:null,
            date:null,
            value:null
        }
        toastTrigger("saved", toastId, edit.status);
        
    }

    async function reFetchDiffDetail(id) {
        const diff = await fetch(import.meta.env.VITE_API_URL + '/timesheet/detail-pns-mcd-diff/id/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });

        if (!diff.ok) {
            toastTrigger("error fetching", null, diff.status);
            return;
        }
        let data = await diff.json();

        return data.data

    }

    const pnsfetchUrl = '/timesheet/list-pns-temp/' + data.timesheet.id;
  const pnsupdateUrl = '';
  const pnsdeleteUrl = '';
  const pnscreateUrl = '';
  const pnsdetailUrl = '';
  const pnsSearchUrl = '/timesheet/search-mcd/' + data.timesheet.id;
  const pnsnamePage = 'PNS Timesheet';

  const mcdfetchUrl = '/timesheet/list-mcd-temp' + data.timesheet.id;
  const mcdupdateUrl = '';
  const mcddeleteUrl = '';
  const mcdcreateUrl = '';
  const mcddetailUrl = '';
  const mcdSearchUrl = '/timesheet/search-mcd/' + data.timesheet.id;
  const mcdnamePage = 'MCD Timesheet';
</script>


<div class="m-6">
    <div class="flex flex-col gap-6">
        <div class="flex gap-2 text-center">
            <h1 class="text-6xl font-bold">{data.timesheet.filename}</h1>
            <p class="opacity-75 text-gray-700 flex gap-2 self-end">
               {data.timesheet.random_string}
            </p>
        </div>
        <div>
            <p>{data.timesheet.description}</p>
        </div>
        <div class="flex gap-16">
            <div class="flex gap-2" title="from date to date">
                <svg width="20px" height="20px" viewBox="-1.6 -1.6 35.20 35.20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.704"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M3.205 3.205v25.59h25.59v-25.59h-25.59zM27.729 4.271v4.798h-23.457v-4.798h23.457zM4.271 27.729v-17.593h23.457v17.593h-23.457z" fill="#000000"> </path> <path d="M11.201 5.871h1.6v1.599h-1.6v-1.599z" fill="#000000"> </path> <path d="M19.199 5.871h1.599v1.599h-1.599v-1.599z" fill="#000000"> </path> <path d="M12.348 13.929c-0.191 1.297-0.808 1.32-2.050 1.365l-0.193 0.007v0.904h2.104v5.914h1.116v-8.361h-0.953l-0.025 0.171z" fill="#000000"> </path> <path d="M18.642 16.442c-0.496 0-1.005 0.162-1.408 0.433l0.38-1.955h3.515v-1.060h-4.347l-0.848 4.528h0.965l0.059-0.092c0.337-0.525 0.952-0.852 1.606-0.852 1.064 0 1.836 0.787 1.836 1.87 0 0.98-0.615 1.972-1.79 1.972-1.004 0-1.726-0.678-1.756-1.649l-0.006-0.194h-1.115l0.005 0.205c0.036 1.58 1.167 2.641 2.816 2.641 1.662 0 2.963-1.272 2.963-2.895-0-1.766-1.154-2.953-2.872-2.953z" fill="#000000"> </path> </g></svg>
                <p>{data.timesheet.from_date} - {data.timesheet.to_date}</p>
            </div>
            <div class="flex gap-2" title="creator">
                <svg width="23px" height="23px" viewBox="-1.44 -1.44 26.88 26.88" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z" fill="#000000"></path> </g></svg>
                <p>{data.timesheet.user.name}</p>
            </div>
            <div class="flex gap-2" title="status">
                <svg width="26px" height="26px" viewBox="-1.44 -1.44 26.88 26.88" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4013 7.5H19C19.2761 7.5 19.5 7.27614 19.5 7C19.5 6.72386 19.2761 6.5 19 6.5H15.0415C15.1017 6.85896 15.2257 7.19631 15.4013 7.5ZM13.2289 7.5C13.1282 7.17938 13.0589 6.84484 13.0247 6.5H5C4.72386 6.5 4.5 6.72386 4.5 7C4.5 7.27614 4.72386 7.5 5 7.5H13.2289ZM5 11.5C4.72386 11.5 4.5 11.7239 4.5 12C4.5 12.2761 4.72386 12.5 5 12.5H19C19.2761 12.5 19.5 12.2761 19.5 12C19.5 11.7239 19.2761 11.5 19 11.5H5ZM5 16.5C4.72386 16.5 4.5 16.7239 4.5 17C4.5 17.2761 4.72386 17.5 5 17.5H19C19.2761 17.5 19.5 17.2761 19.5 17C19.5 16.7239 19.2761 16.5 19 16.5H5Z" fill="#222222"></path> <circle cx="18" cy="6" r="3" fill="#222222"></circle> </g></svg>
                <p>{data.timesheet.status}</p>
            </div>
        </div>
    </div>
</div>

<div class="pt-6 w-full">
  <Tabs.Root
    value="pns"
    class="w-full rounded-card bg-background-alt p-3 shadow-card h-full"
  >
    <Tabs.List
      class="h-full grid w-full grid-cols-3 gap-1 rounded-9px bg-dark-10 p-1 text-sm font-semibold leading-[0.01em] shadow-mini-inset dark:border dark:border-neutral-600/30 dark:bg-background"
    >
      <Tabs.Trigger
        value="pns"
        class="h-20 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-slate-100 data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted"
        >PNS</Tabs.Trigger
      >
      <Tabs.Trigger
        value="mcd"
        class="h-20 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-slate-100 data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted"
        >MCD</Tabs.Trigger
      >
      <Tabs.Trigger
        value="compare"
        class="h-20 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-slate-100 data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted"
        >Compare</Tabs.Trigger
      >
    </Tabs.List>
    <Tabs.Content value="pns" class="pt-3">
      <UniversalSetupTable searchUrl={pnsSearchUrl} data={data.dataPns} fetchUrl={pnsfetchUrl} deleteUrl={pnsdeleteUrl} updateUrl={pnsupdateUrl} detailUrl={pnsdetailUrl} createUrl={pnscreateUrl} namePage={pnsnamePage} formData={pnsFormData} tableList={pnsTableList}/>
    </Tabs.Content>
    <Tabs.Content value="mcd" class="pt-3">
        <UniversalSetupTable searchUrl={mcdSearchUrl} data={data.dataMcd} fetchUrl={mcdfetchUrl} deleteUrl={mcddeleteUrl} updateUrl={mcdupdateUrl} detailUrl={mcddetailUrl} createUrl={mcdcreateUrl} namePage={mcdnamePage} formData={pnsFormData} tableList={pnsTableList}/>
    </Tabs.Content>
    <Tabs.Content value="compare" class="pt-3">
        <table class="table-style">
            <thead class="table-thead">
                <th class="table-header">Employee Name</th>
                <th class="table-header">Date</th>
                <th class="table-header">PNS QTY</th>
                <th class="table-header">MCD QTY</th>
                <th class="table-header">DIFF</th>
                <th class="table-header">Action</th>
            </thead>
            <tbody class="table-body">
                {#each data.diff.data as row, index}
                <Accordion>
                    <svelte:fragment slot="parent" let:handleClick let:open>
                        <td class="table-td flex gap-2" on:click={handleClick}>
                            <svg class="w-5 h-5 text-gray-500 transition {open?'-rotate-90':'rotate-90'}" xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                            </path>
                            </svg>
                            <span>{row.employee_name}</span>
                        </td>
                        <td class="table-td">{row.date}</td>
                        <td class="table-td">{row.pns_value}</td>
                        <td class="table-td">{row.mcd_value}</td>
                        {@const difcolor = row.pns_value - row.mcd_value > 0 ? 'bg-red-300' : 'bg-green-300'}
                        {@const diff = row.pns_value - row.mcd_value}
                        <td class="table-td {difcolor}">{diff}</td>
                        <td class="table-td {diff > 0 ? 'hidden' : ''}">
                            <button class="flex bg-green-400 gap-3 p-2 text-white" on:click={()=>{alertResolveModal = true, conflictId = row.id}}>
                                <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cy="12.5" cx="12.5" r="1.75"></circle> <circle cy="12.5" cx="3.5" r="1.75"></circle> <circle cy="3.5" cx="3.5" r="1.75"></circle> <path d="m12.25 7.25v3m-8.5-4.5v4.5"></path> <path d="m14.25 1.75-3.5 3.5m0-3.5 3.5 3.5"></path> </g></svg>
                                <p>Resolve</p>
                            </button>
                        </td>
                    </svelte:fragment>
                    <svelte:fragment slot="child">
                        <td class="table-container m-3" colspan="4">
                            <div class="p-3">
                                <h1>Detail PNS</h1>
                                <table class="table-style">
                                    <thead class="table-thead">
                                        <th class="table-header">Kronos Job Number</th>
                                        <th class="table-header">Oracle Job Number</th>
                                        <th class="table-header">Employee Name</th>
                                        <th class="table-header">Parent ID</th>
                                        <th class="table-header">Date (YYYY-MM-DD)</th>
                                        <th class="table-header">Value</th>
                                        <th class="table-header">Action</th>
                                    </thead>
                                    <tbody>
                                        {#each row.pns_ids as pnsrow}
                                            <tr>
                                                <td class="table-td">{pnsrow.kronos_job_number}</td>
                                                <td class="table-td">{pnsrow.oracle_job_number}</td>
                                                <td class="table-td">{pnsrow.employee_name}</td>
                                                <td class="table-td">{pnsrow.parent_id}</td>
                                                <td class="table-td">{pnsrow.date}</td>
                                                <td class="table-td">{pnsrow.value}</td>
                                                <td class="table-td">
                                                    <button title="Edit" on:click={() => {editModal = true; stateEdit.index_id = index; stateEdit.parent_id = row.id; stateEdit.id = pnsrow.id; stateEdit.side = "pns"; formData.kronos_job_number = pnsrow.kronos_job_number; formData.oracle_job_number = pnsrow.oracle_job_number; formData.employee_name = pnsrow.employee_name; formData.parent_id = pnsrow.parent_id; formData.date = pnsrow.date; formData.value = pnsrow.value}}>
                                                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                                                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                                            
                                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                                            
                                                            <g id="SVGRepo_iconCarrier"> <path d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z" stroke="#3584e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
                                                            
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3">
                                <h1>Detail MCD</h1>
                                <table class="table-style">
                                    <thead class="table-thead">
                                        <th class="table-header">Kronos Job Number</th>
                                        <th class="table-header">Oracle Job Number</th>
                                        <th class="table-header">Employee Name</th>
                                        <th class="table-header">Parent iD</th>
                                        <th class="table-header">Date</th>
                                        <th class="table-header">Value</th>
                                        <th class="table-header">Action</th>
                                    </thead>
                                    <tbody>
                                        {#each row.mcd_ids as mcdrow}
                                            <tr>
                                                <td class="table-td">{mcdrow.kronos_job_number}</td>
                                                <td class="table-td">{mcdrow.oracle_job_number}</td>
                                                <td class="table-td">{mcdrow.employee_name}</td>
                                                <td class="table-td">{mcdrow.parent_id}</td>
                                                <td class="table-td">{mcdrow.date}</td>
                                                <td class="table-td">{mcdrow.value}</td>
                                                <td class="table-td">
                                                    <button title="Edit" on:click={() => {editModal = true; stateEdit.index_id = index; stateEdit.parent_id = row.id;  stateEdit.id = mcdrow.id; stateEdit.side = "mcd"; formData.kronos_job_number = mcdrow.kronos_job_number; formData.oracle_job_number = mcdrow.oracle_job_number; formData.employee_name = mcdrow.employee_name; formData.parent_id = mcdrow.parent_id; formData.date = mcdrow.date; formData.value = mcdrow.value}}>
                                                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                                                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                                            
                                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                                            
                                                            <g id="SVGRepo_iconCarrier"> <path d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z" stroke="#3584e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
                                                            
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        {#if row.mcd_ids.length == 0}
                                            <tr>
                                                <td class="table-td" colspan="6">No Data</td>
                                            </tr>
                                        {/if}
                                    </tbody>
                                </table>
                            </div>
                            
                        </td>
                    </svelte:fragment>
                </Accordion>
                {/each}
                
            </tbody>
        </table>
    </Tabs.Content>
  </Tabs.Root>

    <Dialog.Root bind:open={editModal} closeOnEscape closeOnOutsideClick>
        <Dialog.Portal>
            <Dialog.Overlay
            transition={fade}
            transitionConfig={{ duration: 150 }}
            class="fixed inset-0 z-50 bg-black/50"
        />
            <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
            <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
                Add
            </Dialog.Title>
            <Dialog.Description class="mb-6 text-sm text-black">
                Fill in the form below to add a new data.
            </Dialog.Description>
            <UniversalTableField {tableList} formData={formData} />

            <div class="mt-6 flex justify-end gap-4">
                <button
                    class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                    on:click={() => {
                        editModal = false;
                    }}
                >
                    Cancel
                    
                </button>
                <button
                type="submit"
                    class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
                    on:click={() => {
                      editCompare();
                    }}
                >
                    Save changes
                </button>
            </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>



    <Dialog.Root bind:open={alertResolveModal} closeOnEscape closeOnOutsideClick>
        <Dialog.Portal>
            <Dialog.Overlay
            transition={fade}
            transitionConfig={{ duration: 150 }}
            class="fixed inset-0 z-50 bg-black/50"
        />
            <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
            <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
                Resolve
            </Dialog.Title>
            <Dialog.Description class="mb-6 text-xl text-red-600">
                Are you sure to reslove this data?
            </Dialog.Description>

            <div class="mt-6 flex justify-end gap-4">
                <button
                    class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                    on:click={() => {
                        alertResolveModal = false;
                    }}
                >
                    Cancel
                    
                </button>
                <button
                type="submit"
                    class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
                    on:click={() => {
                    //   editCompare();
                    resolveConflict(conflictId);

                    }}
                >
                    reslove
                </button>
            </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
</div>