<script>
	import { run } from 'svelte/legacy';

	import { getCookie } from '$lib/helpers/getLocalCookies';
	import Accordion from '$lib/components/accordion.svelte';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver.js';
	let { data } = $props();
	let list = $state(data.list);
	let dataTable = $state(list.data);

	let observer = $state();
	let loading = $state(false);
	let search = '';
	async function loadMore() {
		// console.log(dataTable.data);
		let page = 75;
		try {
			if (!dataTable.next_page_url) return;
			// @ts-ignore
			loading = true;
			let loadMoreTableData;
			if (search == '' || search == null || search == undefined) {
				loadMoreTableData = await fetch(dataTable.next_page_url + '&perpage=' + page, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + getCookie('token')
					}
				});
			} else {
				loadMoreTableData = await fetch(dataTable.next_page_url + '&perpage=' + page, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + getCookie('token')
					},

					body: JSON.stringify({ search: search })
				});
			}
			const response = await loadMoreTableData.json();
			dataTable.data.push(...response.data.data);
			dataTable.next_page_url = response.data.next_page_url;

			loading = false;
		} catch (error) {
			loading = false;
		}
	}
	run(() => {
		if (observer) {
			infiniteScroll({
				fetch: loadMore,
				element: observer
			});
		}
	});
</script>

<div class="table-container">
	<div class="flex p-4">
		<button class="flex gap-1" aria-label="back" onclick={() => window.history.back()}>
			<svg
				width="25px"
				height="25px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g><g id="SVGRepo_iconCarrier">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z"
						fill="#000000"
					></path>
				</g></svg
			>
			<p class="self-center text-center">back</p>
		</button>
	</div>
	<table class="table-style">
		<thead class="table-thead">
			<tr>
				<th class="table-header">No</th>
				<th class="table-header">Name</th>
				<th class="table-header">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each dataTable.data as row, index}
				<tr>
					<td class="table-td">{index + 1}</td>
					<td class="table-td">{row.filename}</td>
					<td class="table-td">
						<a
							class="btn btn-primary flex gap-2"
							href={import.meta.env.VITE_STORAGE_URL + row.file_path}
							download
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								width="1.3rem"
								height="1.3rem"
								><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g><g id="SVGRepo_iconCarrier">
									<path
										d="M12 7L12 14M12 14L15 11M12 14L9 11"
										stroke="#4bf94e"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
									<path d="M16 17H12H8" stroke="#4bf94e" stroke-width="1.5" stroke-linecap="round"
									></path>
									<path
										d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
										stroke="#4bf94e"
										stroke-width="1.5"
									></path>
								</g></svg
							>
							<p>Download</p>
						</a>
					</td>
				</tr>
			{/each}
			<tr id="observer" class="h-4" bind:this={observer}></tr>
			{#if loading}
				<tr>
					<td>
						<div class="loading"></div>
					</td>
				</tr>
			{/if}
		</tbody>
	</table>

	<!-- <UniversalSetupTable data={data} fetchUrl={fetchUrl} deleteUrl={deleteUrl} updateUrl={updateUrl} detailUrl={detailUrl} createUrl={createUrl} {namePage} {searchUrl}></UniversalSetupTable> -->
</div>
