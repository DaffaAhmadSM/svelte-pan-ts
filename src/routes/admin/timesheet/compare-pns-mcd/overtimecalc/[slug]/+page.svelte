<script>
	import  UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
    import { goto } from '$app/navigation';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { toastTrigger, toastTriggerLoading, toastTriggerUpdate } from '$lib/helpers/toasterTrigger';
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import Accordion from '$lib/components/accordion.svelte';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver.js';
    export let data;
    let alertVerify = false;
    $: list = data.list;
    $: dataTable = list.data;

    const fetchUrl = "/temp-timesheet/overtime-list/" + data.slug;
    const updateUrl = "/temp-timesheet/overtime-update";
    const deleteUrl = "/temp-timesheet/overtime-delete";
    const createUrl = "/temp-timesheet/overtime-create";
    const detailUrl = "/temp-timesheet/overtime-detail";
    const searchUrl = "/temp-timesheet/overtime-search";
    const namePage = "Temp Overtime Calculation";

    async function recalculate() {
        const toastId = toastTriggerLoading('Recalculating...');
        await fetch(import.meta.env.VITE_API_URL + '/temp-timesheet/calculate-overtime/' + data.slug, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },

            body : JSON.stringify({
                recalculate: true
            })
        });

        const list = await fetch(import.meta.env.VITE_API_URL + '/temp-timesheet/overtime-list/' + data.slug, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });

        if (list.status === 200) {
            const listData = await list.json();
            data.list = listData;
        }

        if (list.status !== 200) {
            toastTrigger('Failed to recalculate', toastId, 200);
            return;
        }

        toastTrigger('Recalculated', toastId, 200);
    }

    async function verify() {
        const toastId = toastTriggerLoading('Verifying...');
        const url = await fetch(import.meta.env.VITE_API_URL + '/temp-timesheet/overtime-verify/' + data.slug, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        }
        });
        if (url.status !== 200) {
            toastTrigger('Failed to verify', toastId, 200);
            return;
        }
        goto(`/admin/timesheet/compare-pns-mcd?menuid=${data.paramsurl}`);
        toastTrigger('Verified', toastId, 200);
    }

    let observer;
    let loading = false;
    let search = '';
    async function loadMore() {
        // console.log(dataTable.data);
      let page = 75;
        try {
        if(!dataTable.next_page_url) return;
		// @ts-ignore
        loading = true
        let loadMoreTableData;
        if (search == '' || search == null || search == undefined) {
        loadMoreTableData = await fetch(dataTable.next_page_url+ '&perpage=' + page, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          }
          });
      } else {
          loadMoreTableData = await fetch(dataTable.next_page_url + '&perpage=' + page, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          },

          body: JSON.stringify({ search: search })
          });
      }
        const response = await loadMoreTableData.json();
        dataTable.data = [...dataTable.data, ...response.data.data];
        dataTable.next_page_url = response.data.next_page_url;

        loading = false
        } catch (error) {
            loading = false
        }
        
	}
	$: {
        if (observer) {
            infiniteScroll({
                fetch: loadMore,
                element: observer,
            });
        }
    }
</script>

<div class="table-container flex flex-col">
    <div class="flex p-4">
        <button class="flex gap-1" aria-label="back" on:click={()=> window.history.back()}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#000000"></path> </g></svg>
            <p class="text-center self-center">back</p>
        </button>
    </div>
    <div class="flex w-full justify-between p-4">
        <button class="bg-blue-500 p-4 rounded-md text-white" on:click={recalculate}>Recalculate</button>
        <button class="bg-green-500 p-4 rounded-md text-white" on:click={()=> {alertVerify=true}}>verify</button>
    </div>
    <table class="table-style">
        <thead class="table-thead">
            <tr>
                <th class="table-header">No</th>
                <th class="table-header">UID</th>
                <th class="table-header">Employee No</th>
                <th class="table-header">Date</th>
                <th class="table-header">Basic Hour</th>
                <th class="table-header">Actual Hour</th>
                <th class="table-header">Deduction Hour</th>
                <th class="table-header">Overtime Hour</th>
                <th class="table-header">Total Overime Hour</th>
                <th class="table-header">Paid Hour</th>
            </tr>
        </thead>
        <tbody>
        {#each dataTable.data as row, index}
            <Accordion>
                <svelte:fragment slot="parent" let:handleClick let:open>
                    <td class="table-td">{index + 1}</td>
                    <td class="table-td flex gap-2" on:click={handleClick}>
                        <svg class="w-5 h-5 text-gray-500 transition {open?'-rotate-90':'rotate-90'}" xmlns="http://www.w3.org/2000/svg"
                        width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                        </path>
                        </svg>
                        <span>{row.custom_id}</span>
                    </td>
                    <td class="table-td">{row.no}</td>
                    <td class="table-td">{row.date}</td>
                    <td class="table-td">{row.basic_hours}</td>
                    <td class="table-td">{row.actual_hours}</td>
                    <td class="table-td">{row.deduction_hours}</td>
                    <td class="table-td">{row.overtime_hours}</td>
                    <td class="table-td">{row.total_overtime_hours}</td>
                    <td class="table-td">{row.paid_hours}</td>
                </svelte:fragment>
                <svelte:fragment slot="child">
                    <td class="table-container m-3" colspan="4">
                        <div class="p-3">
                            <h1 class="text-xl text-center">Detail Overtime {row.custom_id}</h1>
                            <table class="table-style">
                                <thead class="table-thead">
                                    <tr>
                                        <th class="table-header">Multiplication Code</th>
                                        <th class="table-header">Hours</th>
                                        <th class="table-header">Total Hours</th>
                                        <th class="table-header">Day</th>
                                        <th class="table-header">Day Type</th>
                                        <th class="table-header">From Hours</th>
                                        <th class="table-header">To Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each row.overtime_timesheet as ovRow}
                                        <tr>
                                            <td class="table-td">{ovRow.multiplication_code}</td>
                                            <td class="table-td">{ovRow.hours}</td>
                                            <td class="table-td">{ovRow.total_hours}</td>
                                            <td class="table-td">{ovRow.multiplication_setup.day}</td>
                                            <td class="table-td">{ovRow.multiplication_setup.day_type}</td>
                                            <td class="table-td">{ovRow.multiplication_setup.from_hours}</td>
                                            <td class="table-td">{ovRow.multiplication_setup.to_hours}</td>
                                        </tr>
                                    {/each}

                                    {#if row.overtime_timesheet.length == 0 && row.overtime_hours > 0}
                                        {@const day = new Date(row.date).getDay()}
                                        {@const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                                        <tr>
                                            <td class="table-td text-6xl" colspan="7">Overtime setup not found for {dayName[day]}</td>
                                        </tr>
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </svelte:fragment>
            </Accordion>
        {/each}
        <tr id="observer" class="h-4" bind:this={observer}></tr>
            {#if loading}
            <div class="loading" />
            {/if}
        </tbody>
    </table>

    <!-- <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} {namePage} {searchUrl}></UniversalSetupTable> -->
    
    
</div>

<Dialog.Root bind:open={alertVerify} closeOnEscape closeOnOutsideClick>
    <Dialog.Portal>
        <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-50 bg-black/50"
    />
        <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
            Verify
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-xl text-red-600">
            Are you sure to verify this data?
        </Dialog.Description>

        <div class="mt-6 flex justify-end gap-4">
            <button
                class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                on:click={() => {
                    alertVerify = false;
                }}
            >
                Cancel
                
            </button>
            <button
            type="submit"
                class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-magnum-100 px-4 font-medium leading-none text-magnum-900 bg-green-500 text-white"
                on:click={() => {
                //   editCompare();
                verify();

                }}
            >
                Verify
            </button>
        </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>