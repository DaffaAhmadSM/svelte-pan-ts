<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';
	import UniversalTableField from '$lib/components/universal-table-field.svelte';
	import { getCookie } from '$lib/helpers/getLocalCookies.js';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { holdInput } from '$lib/stores/holdinput.js';
	import { Dialog } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	let setting = data.setting;

	let formData = {
		name: '',
		from_date: '',
		to_date: ''
	};

	let tableList = [
		{
			name: 'Name',
			id: 'name',
			type: 'text',
			required: true
		},
		{
			name: 'From Date',
			id: 'from_date',
			type: 'date',
			required: true
		},
		{
			name: 'To Date',
			id: 'to_date',
			type: 'date',
			required: true
		}
	];

	const fetchUrl = '/employee-rates/list';
	const updateUrl = '/employee-rates/update';
	const deleteUrl = '/employee-rates/delete';
	const detailUrl = '/employee-rates/detail';
	const searchUrl = '/employee-rates/search';
	const namePage = 'Employee Rate';

	let modalImportExcel = false;
	let formImport = {
		name: '',
		from_date: '',
		to_date: '',
		file: null
	};

	let tableImport = [
		{
			name: 'Name',
			id: 'name',
			type: 'text',
			required: true
		},
		{
			name: 'From Date',
			id: 'from_date',
			type: 'date',
			required: true
		},
		{
			name: 'To Date',
			id: 'to_date',
			type: 'date',
			required: true
		},
		{
			name: 'File',
			id: 'file',
			type: 'file',
			required: true,
			showFileName: true
		}
	];

	async function importFromExcel() {
		holdInput.set(true);

		const toastId = toastTriggerLoading('Importing rates, please wait…');

		let body = new FormData();
		body.append('file', formImport.file);
		body.append('name', formImport.name);
		body.append('from_date', formImport.from_date);
		body.append('to_date', formImport.to_date);

		const res = await fetch(import.meta.env.VITE_API_URL + '/employee-rates/import-excel', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + getCookie('token')
			},
			body
		});

		holdInput.set(false);

		if (!res.ok) {
			const err = await res.json();
			toastTrigger(err.message || 'Import failed', toastId, res.status);
			return;
		}

		modalImportExcel = false;
		toastTrigger('Rates imported successfully', toastId, 200);

		// Refetch table data
		let page = setting.sizePage ?? 70;
		const get = await fetch(import.meta.env.VITE_API_URL + fetchUrl + '?perpage=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		});
		data.list = await get.json();
	}

	function formatDate(dateStr) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString();
	}
</script>

<div class="w-full overflow-auto">
	<UniversalSetupTable
		{namePage}
		bind:data
		{fetchUrl}
		{deleteUrl}
		{updateUrl}
		{detailUrl}
		{searchUrl}
		bind:formData
		{tableList}
	>
		<svelte:fragment slot="table-row" let:row let:index>
			<td class="table-td">{index + 1}</td>
			<td class="table-td">{row.name}</td>
			<td class="table-td">{formatDate(row.from_date)}</td>
			<td class="table-td">{formatDate(row.to_date)}</td>
		</svelte:fragment>

		<svelte:fragment slot="add-row" let:nullform let:openAddRow>
			<div class="flex gap-5">
				<button
					class="button-table-add"
					on:click={() => {
						modalImportExcel = true;
					}}
				>
					<p>Import CSV</p>
				</button>
			</div>
		</svelte:fragment>

		<svelte:fragment slot="additional-action" let:row>
			<button
				class="btn btn-primary hover:btn-error"
				on:click={() =>
					goto(
						'/admin/employee/employee-rate/detail/' +
							row.id +
							'?menuid=' +
							$page.url.searchParams.get('menuid')
					)}
			>
				Detail
			</button>
		</svelte:fragment>
	</UniversalSetupTable>
</div>

<!-- Import CSV Modal -->
<Dialog.Root
	bind:open={modalImportExcel}
>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/50"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid max-h-[80%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-scroll border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
		>
			<Dialog.Title class="text-primary-400 m-0 text-lg font-medium">
				Import Employee Rates
			</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-black">
				Upload a CSV file with columns: emp_id, classification, rate.
			</Dialog.Description>
			<UniversalTableField tableList={tableImport} formData={formImport} />
			<div class="mt-6 flex justify-end gap-4">
				<button
					class="inline-flex h-8 items-center justify-center rounded-sm bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					on:click={() => {
						modalImportExcel = false;
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={$holdInput}
					class="bg-magnum-100 text-magnum-900 inline-flex h-8 items-center justify-center rounded-sm px-4 font-medium leading-none"
					on:click={importFromExcel}
				>
					Import
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
