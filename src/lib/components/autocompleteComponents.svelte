<script>
	import { flyAndScale } from "$lib/utils";
	import { Combobox } from "bits-ui";
    // import AutoComplete from "simple-svelte-autocomplete"
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

    let touchedInput = $state(false)

    let disabled = $state(false)

    let searchObj = $state("")
    let curentValue = $state(null)
    if (bindValue !== null) {
        if (typeof bindValue === 'string') {
            try {
                let temp = items.find(item => item[valueFieldName].toLowerCase() == bindValue.toLowerCase())
                searchObj = temp[labelFieldName]
            } catch (error) {
                console.log(error)
            }
        }else{
            let temp = items.find(item => item[valueFieldName] == bindValue)
            searchObj = temp[labelFieldName]
        }
    }

    if (items.length === 0) {
        disabled = true
    }

    let filteredItem = $derived(searchObj && touchedInput ? items.filter(item => item[labelFieldName].toLowerCase().includes(searchObj.toLowerCase())) : items);
</script>

<fieldset class="table-fieldset">
    <div class="flex">
        <div class="table-field-label">{fieldLable}</div>
        {#if required}
            <svg class="ast"><use xlink:href="#asterisk"></use></svg>
        {/if}
    </div>

    <!-- {#if searchFunction !== null}
        <AutoComplete
        labelFieldName={labelFieldName}
        valueFieldName={valueFieldName}
        inputClassName="table-field-input"
        bind:value={bindValue}
        searchFunction={searchFunction}
        localFiltering={false}
        delay={500}
        >
        </AutoComplete>
    {:else}
        <AutoComplete
        items={items}
        labelFieldName={labelFieldName}
        valueFieldName={valueFieldName}
        inputClassName="table-field-input"
        bind:selectedItem={searchObj}
        bind:value={bindValue}
        maxItemsToShowInList={20}
        disabled={disabled}
        >
        </AutoComplete>
    {/if} -->

    
 
<Combobox.Root items={filteredItem} bind:inputValue={searchObj} bind:touchedInput onSelectedChange={(value)=> bindValue = value.value}>
  <div class="">
    <Combobox.Input
      class="inline-flex h-input w-[296px] truncate rounded-9px border border-border-input bg-background px-11 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
      placeholder="Search"
      aria-label="Search"
    />
  </div>
 
  <Combobox.Content
    class="w-full rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
    transition={flyAndScale}
    overlap={true}
  >
    {#each filteredItem as fruit}
      <Combobox.Item
        class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-muted "
        value={fruit[valueFieldName]}
        label={fruit[labelFieldName]}
      >
        {fruit[labelFieldName]}
        
      </Combobox.Item>
    {:else}
      <span class="block px-5 py-2 text-sm text-muted-foreground">
        No results found
      </span>
    {/each}
  </Combobox.Content>
  <Combobox.HiddenInput name="favoriteFruit" />
</Combobox.Root>

</fieldset>

<style>
    .ast {
      width: 8px;
      height: 8px;
    }
    </style>