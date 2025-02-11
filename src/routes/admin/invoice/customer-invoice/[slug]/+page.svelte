<script>
    import { run } from 'svelte/legacy';

	import { getCookie } from '$lib/helpers/getLocalCookies';
	import Accordion from '$lib/components/accordion.svelte';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver.js';
    let { data } = $props();
    let list = $derived(data.list);
    let dataTable = $derived(list.data);

    let observer = $state();
    let loading = $state(false);
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
	run(() => {
        if (observer) {
            infiniteScroll({
                fetch: loadMore,
                element: observer,
            });
        }
    });
</script>

<div class="table-container">
    <div class="flex p-4">
        <button class="flex gap-1" aria-label="back" onclick={()=> window.history.back()}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#000000"></path> </g></svg>
            <p class="text-center self-center">back</p>
        </button>
    </div>
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
            <div class="loading"></div>
            {/if}
        </tbody>
    </table>

    <!-- <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} {namePage} {searchUrl}></UniversalSetupTable> -->
    
    
</div>