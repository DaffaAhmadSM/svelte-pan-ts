<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	let rate = data.rate.data;
	let rateDetails = data.details.data?.data ?? [];

	function formatDate(dateStr) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString();
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 2
		}).format(value);
	}
</script>

<div class="p-5 font-poppins">
	<!-- Back button + title -->
	<div class="mb-6 flex items-center gap-4">
		<button
			class="btn btn-primary"
			on:click={() => {
				const menuid = $page.url.searchParams.get('menuid');
				goto('/admin/employee/employee-rate' + (menuid ? '?menuid=' + menuid : ''));
			}}
		>
			&larr; Back
		</button>
		<h1 class="text-4xl font-semibold tracking-tight">{rate.name}</h1>
	</div>

	<!-- Rate info cards -->
	<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="rounded-lg border bg-card p-4">
			<p class="text-sm text-muted-foreground">From Date</p>
			<p class="text-lg font-medium">{formatDate(rate.from_date)}</p>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<p class="text-sm text-muted-foreground">To Date</p>
			<p class="text-lg font-medium">{formatDate(rate.to_date)}</p>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<p class="text-sm text-muted-foreground">Total Employees</p>
			<p class="text-lg font-medium">{rateDetails.length}</p>
		</div>
	</div>

	<!-- Details table -->
	<h2 class="mb-4 text-xl font-semibold">Rate Details</h2>

	<div class="container-table">
		{#if rateDetails.length === 0}
			<p class="py-8 text-center text-muted-foreground">No rate details found.</p>
		{:else}
			<table class="table-style">
				<thead class="table-thead">
					<tr>
						<th scope="col" class="table-header"><p>#</p></th>
						<th scope="col" class="table-header"><p>Employee ID</p></th>
						<th scope="col" class="table-header"><p>Classification</p></th>
						<th scope="col" class="table-header"><p>Rate</p></th>
					</tr>
				</thead>
				<tbody class="table-tbody">
					{#each rateDetails as detail, i}
						<tr class="hover">
							<td class="table-td">{i + 1}</td>
							<td class="table-td">{detail.emp_id}</td>
							<td class="table-td">{detail.classification || '—'}</td>
							<td class="table-td">{formatCurrency(detail.rate)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
