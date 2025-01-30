<script>
	import { fade } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	let search;

	let moveConfirm = false;
	let dataDetail = false;
	let currentMoveId = null;

	let tableLoading = false;
	// const deleteUrl = "/timesheet/delete-pns-mcd";
	const fetchUrl = '/timesheet-data/list';

	onMount(() => {
		const interval = setInterval(async () => {
			const res = await fetch(import.meta.env.VITE_API_URL + fetchUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + getCookie('token')
				}
			});

			const data = await res.json();
			tableData = data.data;
		}, 20000);

		return () => clearInterval(interval);
	});

	$: tableData = data.list.data;
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

	async function moveToCustomerTimesheet(id) {
		const toastId = toastTriggerLoading('Moving...');
		const res = await fetch(
			import.meta.env.VITE_API_URL + '/timesheet-data/generate-customer-timesheet/' + id,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: 'Bearer ' + getCookie('token')
				}
			}
		);
		if (res.ok) {
			moveConfirm = false;
			data.list = await fetchTable();
			return toastTrigger('Data Moved', toastId, 200, 500);
		}

		let message = await res.json();

		if (!res.ok) {
			moveConfirm = false;
			return toastTrigger(message.message, toastId, res.status);
		}

		return toastTrigger(data.list.data.message, toastId, res.status);
	}
</script>

<div class="table-container">
	<div class="mb-6 flex w-full flex-col p-5 font-poppins">
		<h1 class="text-5xl">Timesheet Data</h1>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex justify-between px-5">
			<!-- {#if searchUrl != null} -->
			<div id="search-bar" class="z-10 w-96 bg-white">
				<div class="flex items-center justify-center rounded-md p-2 shadow-lg">
					<input
						type="text"
						placeholder="Search here"
						class="w-full rounded-md px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600"
					/>
					<button
						class="ml-2 rounded-md bg-gray-800 px-4 py-1 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
					>
						Search
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="container-table">
		{#if tableLoading}
			<div class="z-99 fixed left-0 top-0 flex h-full w-full items-center justify-center">
				<div class="loading" />
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
								<td class="table-td">{row.user.name}</td>
								<td class="table-td">{row.random_string}</td>
								<td class="table-td">{row.from_date}</td>
								<td class="table-td">{row.to_date}</td>
								<td class="table-td max-w-20 truncate">{row.description}</td>
								<td class="table-td">{row.status}</td>
								<td class="table-td flex items-center gap-1">
									{#if row.status != 'generating' && row.file_path != null}
										<a class="" href="/admin/timesheet/timesheet-data/{row.random_string}">
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
													<path
														d="M16 17H12H8"
														stroke="#4bf94e"
														stroke-width="1.5"
														stroke-linecap="round"
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
										{#if row.status != 'moved'}
											<button
												class="btn btn-primary hover:btn-error"
												on:click={() => {
													moveConfirm = true;
													currentMoveId = row.id;
												}}
											>
												Generate Customer TS
											</button>
										{/if}
									{:else}
										<div class="loading"></div>
									{/if}

									{#if row.status == 'failed'}
										<button class="btn btn-primary hover:btn-error" on:click={() => {}}>
											Regenerate
										</button>
										<!-- <button class="btn btn-primary hover:btn-error" on:click={() => {}}>
											show log error
										</button> -->
									{/if}
								</td>
							</tr>
						{/each}
						<tr id="observer" class="h-4" bind:this={observer}></tr>
					</tbody>
				</table>
				{#if loading}
					<div class="loading" />
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
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">Move Confirm</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Move File to Customer Timesheet
			</Dialog.Description>

			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					on:click={() => {
						moveConfirm = false;
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="bg-magnum-100 text-magnum-900 inline-flex h-8 items-center
                        justify-center rounded-sm px-4 font-medium leading-none"
					on:click={() => {
						moveToCustomerTimesheet(currentMoveId);
					}}
				>
					Move
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={dataDetail} closeOnEscape closeOnOutsideClick>
	<Dialog.Portal>
		<Dialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-black/50"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">
				Detail Imported Data
			</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				<div class="flex flex-row justify-between">
					<p>Total pns data: {tempPnsdata?.count}</p>
					<p>Total mcd data: {tempMcddata?.count}</p>
				</div>
			</Dialog.Description>

			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					on:click={() => {
						dataDetail = false;
					}}
				>
					Close
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
