<script>
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import Accordion from '$lib/components/accordion.svelte';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver.js';
    export let data;
    $: list = data.list;
    $: dataTable = list.data;

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

<div class="table-container">
    <table class="table-style">
        <thead class="table-thead">
            <th class="table-header">No</th>
            <th class="table-header">UID</th>
            <th class="table-header">Kronos Job Number</th>
            <th class="table-header">Date</th>
            <th class="table-header">Basic Hour</th>
            <th class="table-header">Actual Hour</th>
            <th class="table-header">Deduction Hour</th>
            <th class="table-header">Total Overime Hour</th>
            <th class="table-header">Paid Hour</th>
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
                    <td class="table-td">{row.Kronos_job_number}</td>
                    <td class="table-td">{row.date}</td>
                    <td class="table-td">{row.basic_hours}</td>
                    <td class="table-td">{row.actual_hours}</td>
                    <td class="table-td">{row.deduction_hours}</td>
                    <td class="table-td">{row.total_overtime_hours}</td>
                    <td class="table-td">{row.paid_hours}</td>
                </svelte:fragment>
                <svelte:fragment slot="child">
                    <td class="table-container m-3" colspan="4">
                        <div class="p-3">
                            <h1 class="text-xl text-center">Detail Overtime {row.custom_id}</h1>
                            <table class="table-style">
                                <thead class="table-thead">
                                    <th class="table-header">Multiplication Code</th>
                                    <th class="table-header">Hours</th>
                                    <th class="table-header">Total Hours</th>
                                    <th class="table-header">Day</th>
                                    <th class="table-header">Day Type</th>
                                    <th class="table-header">From Hours</th>
                                    <th class="table-header">To Hours</th>
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