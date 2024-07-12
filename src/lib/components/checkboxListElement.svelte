<script>
function toggleItem(item, isChecked) {
if (isChecked) {
    if (!checkedNodes.includes(item.id)) {
        checkedNodes = [...checkedNodes, item.id];
    }
} else {
    checkedNodes = checkedNodes.filter(id => id !== item.id);
}
if (item.children) {
item.children.forEach(child => toggleItem(child, isChecked));
}
}   
export let item;
export let checkedNodes = [];
</script>

<li>
    {#if item.children}
    <details class="flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
    <summary class="flex flex-row">
        <input type="checkbox" checked={checkedNodes.includes(item.id)} on:change={e => toggleItem(item, e.target.checked)} id="parent"/>
        <span class="text-gray-900 gap-2 pl-2">{item.content}</span>
        <svg class="w-5 h-5 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg"
        width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
            </path>
        </svg>
    </summary>
        <article class="mx-4">
                <svelte:self menu={item.children} bind:checkedNodes={checkedNodes}/>
        </article>
    </details>
    {:else}
        <label class="flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
            <input type="checkbox" checked={checkedNodes.includes(item.id)} on:change={e => toggleItem(item, e.target.checked)} />
            {item.content}
        </label>
    {/if}
</li>