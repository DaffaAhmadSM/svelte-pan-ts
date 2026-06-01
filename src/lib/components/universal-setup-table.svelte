<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot (add-row to add_row) making the component unusable -->
<script>
	import UniversalDetailMeta from './universal-detail-meta.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies';
	import { infiniteScroll } from '$lib/helpers/itersectionObserver';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { Dialog } from 'bits-ui';
	import { getValueByPath } from '$lib/helpers/getObjectValue';
	import UniversalTableField from './universal-table-field.svelte';
	import { holdInput } from '$lib/stores/holdinput';

	let {
		/** @type {String} */
		namePage = 'Table',
		/** @type {String} */
		fetchUrl = null,
		/** @type {String} */
		deleteUrl = null,
		/** @type {String} */
		updateUrl = null,
		createUrl = null,
		detailUrl = null,
		searchUrl = null,
		data = $bindable(),
		formData = $bindable(),
		tableList = $bindable(),
		detailMeta = null
	} = $props();

	let setting = $derived(data.setting);
	let dataTab = $state(data.list);

	// Sync from parent whenever bind:data changes
	$effect(() => {
		dataTab = data.list;
	});

	let tableData = $derived(dataTab.data);

	let rowId = $state();
	let addModal = $state(false);
	let updateModal = $state(false);
	let deleteModal = $state(false);
	let detailModal = $state(false);
	let observer = $state();
	let loading = $state(false);

	async function loadMore() {
		let page = setting.sizePage ? setting.sizePage : 70;
		try {
			if (!tableData.next_page_url) return;
			// @ts-ignore
			loading = true;
			let loadMoreTableData;
			if (search == '' || search == null || search == undefined) {
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
			const responseJson = await loadMoreTableData.json();
			dataTab.data = [...tableData, ...responseJson.data.data];
			dataTab.next_page_url = responseJson.data.next_page_url;

			loading = false;
		} catch (error) {
			loading = false;
		}
	}

	$effect(() => {
		if (observer) {
			infiniteScroll({
				fetch: loadMore,
				element: observer
			});
		}
	});

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

	async function createTable() {
		holdInput.set(true);
		if ($holdInput != true) return;
		const toastId = toastTriggerLoading('Creating...');
		let formDataPayload = new FormData();
		for (const key in formData) {
			if (formData[key] !== null) {
				formDataPayload.append(key, formData[key]);
			}
		}
		const createData = await fetch(import.meta.env.VITE_API_URL + createUrl, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + getCookie('token')
			},
			body: formDataPayload
		});
		if (createData.status === 500) {
			holdInput.set(false);
			return toastTrigger('Internal Server Error', toastId, createData.status);
		}
		if (createData.status === 401) {
			window.location.href = '/login';
		}
		const datajson = await createData.json();
		if (!createData.ok) {
			holdInput.set(false);
			return toastTrigger(datajson.message, toastId, createData.status);
		}

		let newtable = fetchTable();
		dataTab = await newtable;
		addModal = false;
		holdInput.set(false);
		return toastTrigger(datajson.message, toastId, 200);
	}

	async function updateTable() {
		holdInput.set(true);
		if ($holdInput != true) return;
		const toastId = toastTriggerLoading('Updating...');
		let formDataPayload = new FormData();
		for (const key in formData) {
			if (formData[key] !== null) {
				formDataPayload.append(key, formData[key]);
			}
		}
		const updateData = await fetch(import.meta.env.VITE_API_URL + updateUrl + '/' + rowId, {
			method: 'POST',
			headers: {
				authorization: 'Bearer ' + getCookie('token')
			},
			body: formDataPayload
		});
		let datajson = await updateData.json();
		if (updateData.ok) {
			holdInput.set(false);
			let newtable = fetchTable();
			dataTab = await newtable;
			updateModal = false;
			return toastTrigger(datajson.message, toastId, 200);
		}
		if (updateData.status !== 200) {
			toastTrigger(datajson.message, toastId, updateData.status);
		}
		holdInput.set(false);
	}

	async function deleteTable() {
		holdInput.set(true);
		if ($holdInput != true) return;
		const toastId = toastTriggerLoading('Deleting...');
		const deleteData = await fetch(import.meta.env.VITE_API_URL + deleteUrl + '/' + rowId, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});
		let datajson = await deleteData.json();
		if (deleteData.ok) {
			holdInput.set(false);
			let newtable = fetchTable();
			dataTab = await newtable;
			deleteModal = false;
			return toastTrigger(datajson.message, toastId, 200);
		}
		if (deleteData.status !== 200) {
			toastTrigger(datajson.message, toastId, deleteData.status);
		}
		holdInput.set(false);
	}

	async function updateDetailTable(row) {
		nullForm();
		holdInput.set(true);
		if ($holdInput != true) return;
		const toastId = toastTriggerLoading('Loading...');
		const detailData = await fetch(import.meta.env.VITE_API_URL + detailUrl + '/' + row, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});

		let resData = await detailData.json();
		if (detailData.ok) {
			holdInput.set(false);
			rowId = row;
			formData = resData.data;
			updateModal = true;
			return toastTrigger('Data Loaded', toastId, 200, 500);
		}

		if (detailData.status !== 200) {
			toastTrigger(resData.message, toastId, detailData.status);
		}
		holdInput.set(false);
	}

	let detailTableData = $state();
	async function detailTable(row) {
		nullForm();
		const toastId = toastTriggerLoading('Loading...');
		const detailData = await fetch(import.meta.env.VITE_API_URL + detailUrl + '/' + row, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});

		detailTableData = await detailData.json();
		if (detailData.ok) {
			detailModal = true;
			return toastTrigger('Data Loaded', toastId, 200, 500);
		}

		if (detailData.status !== 200) {
			toastTrigger(detailTableData.message, toastId, detailData.status);
		}
	}

	function nullForm() {
		for (const key in formData) {
			formData[key] = null;
		}
	}

	let search = $state();
	let timer;
	let tableLoading = $state(false);
	async function searchTable() {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			tableLoading = true;
			if (search == '') {
				let newtable = await fetchTable();
				dataTab = newtable;
				tableLoading = false;
				return;
			}
			const searchFetch = fetch(import.meta.env.VITE_API_URL + searchUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + getCookie('token')
				},
				body: JSON.stringify({ search: search })
			});
			searchFetch
				.then((res) => res.json())
				.then((result) => {
					dataTab = result;
					tableLoading = false;
				});
		}, 750);
	}
</script>

<div class="mb-6 flex w-full flex-col p-5 font-poppins">
	<h1 class="text-5xl">{namePage}</h1>
</div>

<div class="flex justify-between px-5">
	{#if searchUrl != null}
		<div id="search-bar" class="z-10 w-96 rounded-md bg-white shadow-lg">
			<div class="flex items-center justify-center p-2">
				<input
					type="text"
					placeholder="Search here"
					bind:value={search}
					oninput={searchTable}
					class="w-full rounded-md px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600"
				/>
				<button
					onclick={searchTable}
					class="ml-2 rounded-md bg-gray-800 px-4 py-1 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
				>
					Search
				</button>
			</div>
		</div>
	{/if}
	{#if data.permissions.permission.create}
		<slot name="add-row" prop={addModal} nullform={nullForm} openAddRow={() => (addModal = true)}>
			<div class="flex gap-5">
				<slot name="add-slots"></slot>
				<button
					class="button-table-add"
					onclick={() => {
						addModal = true;
						nullForm();
					}}><p>Add</p></button
				>
			</div>
		</slot>
	{/if}
</div>
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
				{#each tableData.data as row, i}
					<tr class="hover">
						<slot name="table-row" {row} header={data.list.header} index={i}>
							<td class="table-td">{i + 1}</td>
							{#each Object.entries(row) as [title, column]}
								{#if title !== 'id' && title !== 'calc_id'}
									<td class="table-td">{column}</td>
								{/if}
							{/each}
							<slot name="additional-table-row" {row}></slot>
						</slot>
						<td class="table-td">
							{#if data.permissions.permission.update}
								<slot name="user-menu-edit" id={row.id}></slot>

								<slot name="edit-row" prop={row} detailTable={updateDetailTable} {rowId}>
									<button
										class="btn btn-warning hover:btn-error"
										onclick={() => {
											updateDetailTable(row.id);
											console.log(tableData);
										}}
									>
										<svg
											width="18px"
											height="18px"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g id="SVGRepo_bgCarrier" stroke-width="0" />

											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>

											<g id="SVGRepo_iconCarrier">
												<path
													d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z"
													stroke="#3584e4"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</g>
										</svg>
									</button>
								</slot>
							{/if}
							{#if data.permissions.permission.delete}
								<slot name="delete-row" prop={row}>
									<button
										class="btn btn-primary hover:btn-error"
										onclick={() => {
											rowId = row.id;
											deleteModal = true;
										}}
									>
										<svg
											width="18px"
											height="18px"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g id="SVGRepo_bgCarrier" stroke-width="0" />

											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>

											<g id="SVGRepo_iconCarrier">
												<path
													d="M8 1.5V2.5H3C2.44772 2.5 2 2.94772 2 3.5V4.5C2 5.05228 2.44772 5.5 3 5.5H21C21.5523 5.5 22 5.05228 22 4.5V3.5C22 2.94772 21.5523 2.5 21 2.5H16V1.5C16 0.947715 15.5523 0.5 15 0.5H9C8.44772 0.5 8 0.947715 8 1.5Z"
													fill="#e01b24"
												/>
												<path
													d="M3.9231 7.5H20.0767L19.1344 20.2216C19.0183 21.7882 17.7135 23 16.1426 23H7.85724C6.28636 23 4.98148 21.7882 4.86544 20.2216L3.9231 7.5Z"
													fill="#e01b24"
												/>
											</g>
										</svg>
									</button>
								</slot>
							{/if}

							<slot name="additional-action" {row}></slot>
							{#if detailMeta !== null}
								<button
									class="btn btn-primary hover:btn-error"
									onclick={() => {
										detailTable(row.id);
									}}
								>
									Detail
								</button>
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

<Dialog.Root bind:open={deleteModal}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title>Are you sure you want to delete this?</Dialog.Title>
			<div class="flex flex-row items-end justify-end">
				<button class="btn btn-error" onclick={deleteTable}>Yes</button>
				<button
					class="btn btn-base-200"
					onclick={() => {
						deleteModal = false;
						rowId = null;
					}}>No</button
				>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={addModal}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">Add</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Fill in the form below to add a new data.
			</Dialog.Description>
			<slot name="aditional-form-create"></slot>
			<UniversalTableField {tableList} {formData} />

			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm
                          bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					onclick={() => {
						addModal = false;
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={$holdInput}
					class="bg-magnum-100 text-magnum-900 inline-flex h-8 items-center
                          justify-center rounded-sm px-4 font-medium leading-none"
					onclick={() => {
						createTable();
					}}
				>
					Save changes
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={updateModal}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">Edit</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Fill in the form below to edit data.
			</Dialog.Description>
			<slot name="aditional-form-update"></slot>
			<UniversalTableField {tableList} {formData} />

			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					onclick={() => {
						updateModal = false;
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="bg-magnum-100 text-magnum-900 inline-flex h-8 items-center
                        justify-center rounded-sm px-4 font-medium leading-none"
					onclick={() => {
						updateTable();
					}}
				>
					Save changes
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={detailModal}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">Detail</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Detail {namePage}
			</Dialog.Description>

			{#each detailMeta as metaData}
				{#if metaData.type == 'array'}
					<UniversalDetailMeta
						detailname={metaData.name}
						detailData={getValueByPath(detailTableData.data, metaData.id)}
						detailType={metaData.type}
						arrayGuide={metaData.arrayGuide}
					/>
				{:else}
					<UniversalDetailMeta
						detailname={metaData.name}
						detailData={getValueByPath(detailTableData.data, metaData.id)}
						detailType={metaData.type}
					/>
				{/if}
			{/each}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
