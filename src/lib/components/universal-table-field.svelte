<script>
    export let tableList;
    export let formData;
</script>

{#each tableList as list}
    {#if list.type === "file" || list.id === "img"}
        <fieldset class="table-fieldset">
            <label class="table-field-label" for="code"> {list.name} </label>
            <input
            type="file"
            class="table-field-input"
            id={list.id}
            on:change={(e) => {
            // @ts-ignore
            formData[list.id] = e.target.files[0];
            }}
            />
        </fieldset>
        {/if}
        {#if list.type === "text"}
        <fieldset class="table-fieldset">
            <label class="table-field-label" for="code"> {list.name} </label>
            <input
            class="table-field-input"
            id={list.id}
            disabled={list.disabled}
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "number"}
        <fieldset class="table-fieldset">
            <label class="table-field-label" for="code"> {list.name} </label>
            <input
            type="number"
            class="table-field-input"
            id={list.id}
            placeholder="1.00"
            step="0.01"
            min="1.00"
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "date"}
        <fieldset class="table-fieldset">
            <label class="table-field-label" for="code"> {list.name} </label>
            <input
            type="date"
            class="table-field-input"
            id={list.id}
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "select"}
        <fieldset class="table-fieldset">
            <label class="table-field-label" for="code"> {list.name} </label>
            <select
            class="table-field-input"
            id={list.id}
            bind:value={formData[list.id]}
            >
            {#each list.options as option}
                <option value={option.value}>{option.name}</option>
            {/each}
            </select>
        </fieldset>
        {/if}
{/each}