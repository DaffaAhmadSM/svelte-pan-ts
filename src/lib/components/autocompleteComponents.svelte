<script>
	/**
	 * @typedef {Object} Props
	 * @property {Array<Record<string, any>>} items
	 * @property {string} labelFieldName
	 * @property {string} valueFieldName
	 * @property {any} bindValue
	 * @property {string} fieldLable
	 * @property {boolean} [required]
	 */

	/** @type {Props} */
	let {
		items,
		labelFieldName,
		valueFieldName,
		bindValue = $bindable(),
		fieldLable,
		required = false
	} = $props();

	let inputValue = $state('');
	let open = $state(false);
	let highlightedIndex = $state(-1);
	let containerEl = $state();

	let selectedLabel = $derived.by(() => {
		if (bindValue == null || bindValue === '') return '';
		const found = items.find((item) => String(item[valueFieldName]) === String(bindValue));
		return found ? String(found[labelFieldName]) : '';
	});

	// Initialize input with selected label on mount
	$effect(() => {
		inputValue = selectedLabel;
	});

	let filtered = $derived(
		items.filter((item) =>
			String(item[labelFieldName]).toLowerCase().includes(inputValue.toLowerCase())
		)
	);

	function selectItem(item) {
		bindValue = item[valueFieldName];
		inputValue = item[labelFieldName];
		open = false;
		highlightedIndex = -1;
	}

	function handleFocus() {
		if (inputValue !== selectedLabel) {
			inputValue = '';
		}
		open = true;
	}

	function handleBlur() {
		// Delay to allow click on dropdown item
		setTimeout(() => {
			open = false;
			if (!selectedLabel) return;
			// If nothing matched, restore selected label
			const found = items.find((item) => String(item[valueFieldName]) === String(bindValue));
			if (!found) {
				inputValue = selectedLabel;
			}
		}, 150);
	}

	function handleInput(e) {
		inputValue = e.target.value;
		highlightedIndex = -1;
		open = true;
	}

	function handleKeydown(e) {
		if (!open) return;

		if (e.key === 'ArrowDown') {
			highlightedIndex = Math.min(highlightedIndex + 1, filtered.length - 1);
			e.preventDefault();
		} else if (e.key === 'ArrowUp') {
			highlightedIndex = Math.max(highlightedIndex - 1, 0);
			e.preventDefault();
		} else if (e.key === 'Enter' && highlightedIndex >= 0) {
			selectItem(filtered[highlightedIndex]);
			e.preventDefault();
		} else if (e.key === 'Escape') {
			open = false;
			highlightedIndex = -1;
		}
	}

	function handleClickOutside(e) {
		if (containerEl && !containerEl.contains(e.target)) {
			open = false;
			// Restore label on click outside
			if (!inputValue || inputValue !== selectedLabel) {
				const found = items.find((item) => String(item[valueFieldName]) === String(bindValue));
				inputValue = found ? String(found[labelFieldName]) : '';
			}
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<fieldset class="table-fieldset">
	<div class="flex">
		<div class="table-field-label">{fieldLable}</div>
		{#if required}
			<svg class="ast" viewBox="0 0 128 128" width="8" height="8">
				<path
					class="st0"
					d="M110.1,16.4L75.8,56.8l0.3,1l50.6-10.2v32.2l-50.9-8.9l-0.3,1l34.7,39.1l-28.3,16.5L63.7,78.2L63,78.5   l-18.5,49L17.2,111l34.1-39.8v-0.6l-50,9.2V47.6l49.3,9.9l0.3-0.6L17.2,16.7L45.5,0.5l17.8,48.7H64L82.1,0.5L110.1,16.4z"
				/>
			</svg>
		{/if}
	</div>

	<div class="relative" bind:this={containerEl}>
		<input
			type="text"
			class="table-field-input"
			value={inputValue}
			onfocus={handleFocus}
			oninput={handleInput}
			onkeydown={handleKeydown}
			autocomplete="off"
			role="combobox"
			aria-expanded={open}
			aria-controls="autocomplete-list"
		/>

		{#if open && filtered.length > 0}
			<ul
				id="autocomplete-list"
				role="listbox"
				class="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-lg"
			>
				{#each filtered as item, i}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<li
						role="option"
						aria-selected={i === highlightedIndex}
						class="cursor-pointer px-3 py-2 text-sm {i === highlightedIndex
							? 'bg-blue-100 text-blue-900'
							: 'text-gray-700 hover:bg-gray-100'}"
						onclick={() => selectItem(item)}
						onmouseenter={() => (highlightedIndex = i)}
					>
						{item[labelFieldName]}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</fieldset>

<style>
	.st0 {
		fill: #ff0000;
	}
	.ast {
		width: 8px;
		height: 8px;
	}
</style>
