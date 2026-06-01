<script>
	import UniversalSetupTable from '$lib/components/universal-setup-table.svelte';

	export let data;

	let formData = {
		emp_id: '',
		department: ''
	};

	let tableList = [
		{
			name: 'Employee ID',
			id: 'emp_id',
			type: 'text',
			required: true
		},
		{
			name: 'Department',
			id: 'department',
			type: 'text',
			required: true
		}
	];

	const fetchUrl = '/employee-department/list';
	const updateUrl = '/employee-department/update';
	const deleteUrl = '/employee-department/delete';
	const createUrl = '/employee-department/create';
	const detailUrl = '/employee-department/detail';
	const searchUrl = '/employee-department/search';
	const namePage = 'Employee Department';
</script>

<div class="w-full overflow-auto">
	<UniversalSetupTable
		{namePage}
		{data}
		{fetchUrl}
		{deleteUrl}
		{updateUrl}
		{createUrl}
		{detailUrl}
		{searchUrl}
		bind:formData
		{tableList}
	>
		<svelte:fragment slot="table-row" let:row let:index>
			<td class="table-td">{index + 1}</td>
			<td class="table-td">{row.emp_id}</td>
			<td class="table-td">{row.department}</td>
		</svelte:fragment>
	</UniversalSetupTable>
</div>
