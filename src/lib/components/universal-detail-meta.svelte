<script>
export let detailname;
export let detailData;
export let detailType;
export let arrayGuide = [];
</script>

{#if detailType == "text"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <p>{detailData}</p>
    </div>
{/if}

{#if detailType == "img"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <img src={import.meta.env.VITE_STORAGE_URL + detailData} alt={detailname} class="w-20 h-20 object-cover" />
    </div>
{/if}

{#if detailType == "url"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <a href={detailData} target="_blank" class="text-blue-500 underline">{detailData}</a>
    </div>
{/if}

{#if detailType == "email"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <a href={"mailto:" + detailData} class="text-blue-500 underline">{detailData}</a>
    </div>
{/if}

{#if detailType == "date"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <p>{new Date(detailData).toLocaleDateString()}</p>
    </div>
{/if}

{#if detailType == "number"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <p>{detailData}</p>
    </div>
{/if}

{#if detailType == "boolean"}
    <div class="flex justify-between">
        <p>{detailname}</p>
        <p>{detailData ? "Yes" : "No"}</p>
    </div>
{/if}

{#if detailType == "object"}
    <div class="flex justify-between flex-col">
        <div class="border-b-2 p-2">{detailname}</div>
        <ul class="flex flex-col ml-4 gap-2">
            {#each arrayGuide as guide}
                {#if guide.main_key}
                    <li class="flex justify-between font-bold">
                        <div>{detailData[guide.id]}</div>
                    </li>
                {:else}
                    <li class="flex justify-between ml-2">
                        <div>{guide.name} :</div>
                        <div>{detailData[guide.id]}</div>
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
{/if}



{#if detailType == "array"}
    <div class="flex justify-between flex-col">
        <div class="border-b-2 p-2">{detailname}</div>
        <ul class="flex flex-col ml-4 gap-2">
            {#each detailData as item}
                {#each arrayGuide as guide}
                {#if guide.main_key}
                    <li class="flex justify-between font-bold">
                        <div>{item[guide.id]}</div>
                    </li>
                {:else}
                        <li class="flex justify-between ml-2">
                            <div>{guide.name} :</div>
                            <div>{item[guide.id]}</div>
                        </li>
                {/if}
                {/each}
            {/each}
        </ul>
    </div>
{/if}