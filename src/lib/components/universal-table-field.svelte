<script>
    export let tableList;
    export let formData;
</script>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1"style="display:none;">
    <defs>
      <symbol id="asterisk" viewBox="0 0 128 128">
      <g>
        <path class="st0" d="M110.1,16.4L75.8,56.8l0.3,1l50.6-10.2v32.2l-50.9-8.9l-0.3,1l34.7,39.1l-28.3,16.5L63.7,78.2L63,78.5   l-18.5,49L17.2,111l34.1-39.8v-0.6l-50,9.2V47.6l49.3,9.9l0.3-0.6L17.2,16.7L45.5,0.5l17.8,48.7H64L82.1,0.5L110.1,16.4z"/>
      </g>
      </symbol>
    </defs>
</svg>

{#each tableList as list}
    {#if list.type === "file" || list.id === "img"}
        <fieldset class="table-fieldset">
            <div class="flex">
                <label class="table-field-label" for="code"> {list.name} </label>
                {#if list.required}
                <svg class="ast"><use xlink:href="#asterisk"></use></svg>
                {/if}
            </div>
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
            <div class="flex">
                <label class="table-field-label" for="code"> {list.name} </label>
                {#if list.required}
                <svg class="ast"><use xlink:href="#asterisk"></use></svg>
                {/if}
            </div>
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
            <div class="flex">
                <label class="table-field-label" for="code"> {list.name} </label>
                {#if list.required}
                <svg class="ast"><use xlink:href="#asterisk"></use></svg>
                {/if}
            </div>
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
            <div class="flex">
                <label class="table-field-label" for="code"> {list.name} </label>
                {#if list.required}
                <svg class="ast"><use xlink:href="#asterisk"></use></svg>
                {/if}
            </div>
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
            <div class="flex">
                <label class="table-field-label" for="code"> {list.name} </label>
                {#if list.required}
                <svg class="ast"><use xlink:href="#asterisk"></use></svg>
                {/if}
            </div>
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
<style>
.st0{
 fill:#ff0000;
}
.ast {
  width: 8px;
  height: 8px;
}
</style>