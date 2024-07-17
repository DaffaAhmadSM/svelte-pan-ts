<script>
    import AutoComplete from "simple-svelte-autocomplete"
    export let items;
    export let labelFieldName;
    export let valueFieldName;
    export let bindValue
    export let fieldLable
    export let searchFunction = null;
    export let required = false;

    let disabled = false

    let searchObj = null
    if (bindValue !== null) {
        console.log(bindValue)
         searchObj = items.find(item => item[valueFieldName] === bindValue)
    }

    if (items.length === 0) {
        disabled = true
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
        debug={true}
        disabled={disabled}
        >
        </AutoComplete>
    {/if}

</fieldset>

<style>
    .ast {
      width: 8px;
      height: 8px;
    }
    </style>