<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script>
	import UniversalTableField from '$lib/components/universal-table-field.svelte';
	import { fade } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	export let data;

	let search;

	let moveConfirm = false;
	let currentMoveId = null;

	let tableLoading = false;
	const fetchUrl = '/customer-timesheet/list';

	$: tableData = data.list.data;

	$: console.log(tableData);

	let observer;
	let loading = false;
	async function loadMore() {
		let page = setting.sizePage ? setting.sizePage : 70;
		try {
			if (!tableData.next_page_url) return;
			// @ts-ignore
			loading = true;
			let loadMoreTableData;
			if (search == '') {
				loadMoreTableData = await fetch(tableData.next_page_url + '&perpage=' + page, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + getCookie('token')
					}
				});
			} else {
				loadMoreTableData = await fetch(tableData.next_page_url + '&perpage=' + page, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + getCookie('token')
					},

					body: JSON.stringify({ search: search })
				});
			}
			const data = await loadMoreTableData.json();
			tableData.data = [...tableData.data, ...data.data.data];
			tableData.next_page_url = data.data.next_page_url;

			loading = false;
		} catch (error) {
			loading = false;
		}
	}

	async function generateInvoice(stringId) {
		let uri = '/customer-timesheet/generate-invoice/' + stringId;

		const res = await fetch(import.meta.env.VITE_API_URL + uri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});

		if (res.ok) {
			toastTrigger('Export Started', 'Success', 200, 500);
			data.list = await fetchTable();
			return;
		}
	}

	let setting = data.setting;
	async function fetchTable() {
		let page = setting.sizePage ? setting.sizePage : 70;
		const get = await fetch(import.meta.env.VITE_API_URL + fetchUrl + '?perpage=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});
		return await get.json();
	}

	let tempMcddata;
	let tempPnsdata;
</script>

<div class="table-container">
	<div class="font-poppins mb-6 flex w-full flex-col p-5">
		<h1 class="text-5xl">Customer Timesheet Data</h1>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex justify-between px-5">
			<!-- {#if searchUrl != null} -->
			<div id="search-bar" class="z-10 w-96 bg-white">
				<div class="flex items-center justify-center rounded-md p-2 shadow-lg">
					<input
						type="text"
						placeholder="Search here"
						class="w-full rounded-md px-2 py-1 focus:border-transparent focus:ring-2 focus:ring-gray-600 focus:outline-hidden"
					/>
					<button
						class="focus:ring-opacity-50 ml-2 rounded-md bg-gray-800 px-4 py-1 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-hidden"
					>
						Search
					</button>
				</div>
			</div>
			<!-- {/if} -->
		</div>
	</div>

	<div class="container-table">
		{#if tableLoading}
			<div class="fixed top-0 left-0 z-99 flex h-full w-full items-center justify-center">
				<div class="loading"></div>
			</div>
		{:else}
			<div class="container-table">
				<table class="table-style">
					<thead class="table-thead">
						<tr>
							<th scope="col" class="table-header">
								<p>No</p>
							</th>
							{#each Object.values(data.list.header) as columnHeading}
								<th scope="col" class="table-header">
									<p>{columnHeading}</p>
								</th>
							{/each}
							<slot name="table-header"></slot>
							<th scope="col" class="table-header">
								<p>Action</p>
							</th>
						</tr>
					</thead>
					<tbody class="table-tbody">
						{#each data.list.data.data as row, i}
							<tr class="hover">
								<td class="table-td">{i + 1}</td>
								<td class="table-td">{row.filename}</td>
								<td class="table-td">{row.customer.name}</td>
								<td class="table-td">{row.random_string}</td>
								<td class="table-td">{row.from_date}</td>
								<td class="table-td">{row.to_date}</td>
								<td class="table-td max-w-20 truncate">{row.description}</td>
								<td class="table-td max-w-20 truncate">{row.status}</td>
								<td class="table-td flex items-center gap-4">
									<a class="" href="/admin/invoice/customer-timesheet/{row.random_string}">
										<div class="flex gap-2">
											<svg
												fill="#3584e4"
												width="18px"
												height="18px"
												viewBox="0 0 96 96"
												xmlns="http://www.w3.org/2000/svg"
												stroke="#3584e4"
												><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
													id="SVGRepo_tracerCarrier"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke="#CCCCCC"
													stroke-width="7.872"
												></g><g id="SVGRepo_iconCarrier">
													<title></title>
													<g>
														<path d="M18,24H78a6,6,0,0,0,0-12H18a6,6,0,0,0,0,12Z"></path>
														<path d="M78,42H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path>
														<path d="M78,72H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path>
													</g>
												</g></svg
											>
											<span>Detail</span>
										</div>
									</a>
									{#if row.status != 'exported'}
										<button
											class="btn btn-primary hover:btn-error"
											on:click={() => {
												moveConfirm = true;
												currentMoveId = row.id;
											}}
										>
											Export Invoice
										</button>
									{/if}
								</td>
							</tr>
						{/each}
						<tr id="observer" class="h-4" bind:this={observer}></tr>
					</tbody>
				</table>
				{#if loading}
					<div class="loading"></div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<Dialog.Root bind:open={moveConfirm} closeOnEscape closeOnOutsideClick>
	<Dialog.Portal>
		<Dialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-black/50"
		/>
		<Dialog.Content
			class="bg-background fixed top-[50%] left-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">Generate</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Generate Customer Invoice?
			</Dialog.Description>

			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 leading-none font-medium text-zinc-600"
					on:click={() => {
						moveConfirm = false;
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="bg-magnum-100 text-magnum-900 inline-flex h-8 items-center
                        justify-center rounded-sm px-4 leading-none font-medium"
					on:click={() => {
						// generateCustomerInvoice(currentMoveId);
					}}
				>
					Move
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
