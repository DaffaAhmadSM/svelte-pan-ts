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
            <tr>
                <th class="table-header">No</th>
                <th class="table-header">Type</th>
                <th class="table-header">item</th>
                <th class="table-header">Description</th>
                <th class="table-header">amount</th>
            </tr>
        </thead>
        <tbody>
        {#each dataTable.data as row, index}
            <tr>
                <td class="table-td">{index + 1}</td>
                    <td class="table-td flex gap-2">
                        <span>{row.type}</span>
                    </td>
                    <td class="table-td">{row.item}</td>
                    <td class="table-td">{row.description}</td>
                    <td class="table-td">{row.amount}</td>
            </tr>
        {/each}
        <tr id="observer" class="h-4" bind:this={observer}></tr>
            {#if loading}
            <div class="loading" />
            {/if}
        </tbody>
    </table>

    <!-- <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} {namePage} {searchUrl}></UniversalSetupTable> -->
    
    
</div>