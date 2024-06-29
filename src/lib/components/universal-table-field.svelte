<script>
    export let tableList;
    export let formData;
</script>

{#each tableList as list}
    {#if list.type === "file" || list.id === "img"}
        <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            type="file"
            class="inline-flex h-8 w-full flex-1
                        rounded-sm px-3 leading-none text-black input input-bordered"
            id={list.id}
            on:change={(e) => {
            // @ts-ignore
            formData[list.id] = e.target.files[0];
            }}
            />
        </fieldset>
        {/if}
        {#if list.type === "text"}
        <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            class="inline-flex h-8 w-full flex-1
                        rounded-sm px-3 leading-none text-black input input-bordered"
            id={list.id}
            disabled={list.disabled}
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "number"}
        <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            type="number"
            class="inline-flex h-8 w-full flex-1
                        rounded-sm px-3 leading-none text-black input input-bordered"
            id={list.id}
            placeholder="1.00"
            step="0.01"
            min="1.00"
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "date"}
        <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <input
            type="date"
            class="inline-flex h-8 w-full flex-1
                        rounded-sm px-3 leading-none text-black input input-bordered"
            id={list.id}
            bind:value={formData[list.id]}
            />
        </fieldset>
        {/if}
        {#if list.type === "select"}
        <fieldset class="mb-4 flex items-center gap-5">
            <label class="w-[90px] text-right text-black" for="code"> {list.name} </label>
            <select
            class="inline-flex h-8 w-full flex-1
                        rounded-sm px-3 leading-none text-black input input-bordered"
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