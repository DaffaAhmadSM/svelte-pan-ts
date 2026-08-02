<script>
	import AutoComplete from 'simple-svelte-autocomplete';
	/**
	 * @typedef {Object} Props
	 * @property {any} items
	 * @property {any} labelFieldName
	 * @property {any} valueFieldName
	 * @property {any} bindValue
	 * @property {any} fieldLable
	 * @property {any} [searchFunction]
	 * @property {boolean} [required]
	 */

	/** @type {Props} */
	let {
		items,
		labelFieldName,
		valueFieldName,
		bindValue = $bindable(),
		fieldLable,
		searchFunction = null,
		required = false
	} = $props();

	let disabled = $state(false);

	let searchObj = $state(null);
	if (bindValue !== null) {
		if (typeof bindValue === 'string') {
			try {
				searchObj = items.find(
					(item) => item[valueFieldName].toLowerCase() == bindValue.toLowerCase()
				);
			} catch (error) {
				// console.log(error)
			}
		} else {
			searchObj = items.find((item) => item[valueFieldName] == bindValue);
		}
	}

	if (items.length === 0) {
		disabled = true;
	}
</script>

<fieldset class="table-fieldset">
	<div class="flex">
		<div class="table-field-label">{fieldLable}</div>
		{#if required}
			<svg class="ast"><use xlink:href="#asterisk"></use></svg>
		{/if}
	</div>

	{#if searchFunction !== null}
		<AutoComplete
			{labelFieldName}
			{valueFieldName}
			inputClassName="table-field-input"
			bind:value={bindValue}
			{searchFunction}
			localFiltering={false}
			delay={500}
		></AutoComplete>
	{:else}
		<AutoComplete
			{items}
			{labelFieldName}
			{valueFieldName}
			inputClassName="table-field-input"
			bind:selectedItem={searchObj}
			bind:value={bindValue}
			maxItemsToShowInList={20}
			{disabled}
		></AutoComplete>
	{/if}
</fieldset>

<style>
	.ast {
		width: 8px;
		height: 8px;
	}
</style>
