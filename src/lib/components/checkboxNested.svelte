<script>
    import CheckboxNested from './checkboxNested.svelte';
	import { slide } from 'svelte/transition';
    import { expoInOut } from "svelte/easing";


    
    
    
    
    /**
     * @typedef {Object} Props
     * @property {any} menu
     * @property {any} [parrentNode]
     * @property {number[]} [checkedNodes]
     * @property {number[]} [createGroup]
     * @property {number[]} [updateGroup]
     * @property {number[]} [deleteGroup]
     */

    /** @type {Props} */
    let {
        menu,
        parrentNode = null,
        checkedNodes = $bindable([]),
        createGroup = $bindable([]),
        updateGroup = $bindable([]),
        deleteGroup = $bindable([])
    } = $props();
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

    function checkParent(){

        if(parrentNode !== null){
            let parent = /** @type {HTMLInputElement} */(document.getElementById(parrentNode));
            let checked = document.querySelectorAll('input[data-parent="'+parrentNode+'"]:checked');

            if(checked.length > 0){
                if (!checkedNodes.includes(parrentNode)) {
                    checkedNodes = [...checkedNodes, parrentNode];
                }
                parent.checked = true;
            }else{
                parent.checked = false;
                checkedNodes = checkedNodes.filter(id => id !== parrentNode);
            }
        }

        return;   
    }

    /**
     * 
     * @param {number} id 
     * @param {boolean} isChecked 
     * @param {string} type 
     */

    function permisSet(id, isChecked, type){
        if(isChecked){
            switch(type){
                case "create":
                    createGroup = [...createGroup, id];
                    break;
                case "update":
                    updateGroup = [...updateGroup, id];
                    break;
                case "delete":
                    deleteGroup = [...deleteGroup, id];
                    break;
            }

            /** @type {HTMLInputElement} */(document.getElementById("check-"+id)).checked = true;
            if (!checkedNodes.includes(id)) {
                    checkedNodes = [...checkedNodes, id];
                }
        }else{
            switch(type){
                case "create":
                    createGroup = createGroup.filter(item => item !== id);
                    break;
                case "update":
                    updateGroup = updateGroup.filter(item => item !== id);
                    break;
                case "delete":
                    deleteGroup = deleteGroup.filter(item => item !== id);
                    break;
            }
        }

        let checked = document.querySelectorAll('input[data-permis-id="'+id+'"]:checked');

        if(checked.length == 0){
            /** @type {HTMLInputElement} */(document.getElementById("check-"+id)).checked = false;
            checkedNodes = checkedNodes.filter(item => item !== id);
        }
    }
</script>
    <ul>
        {#each menu as item}
            <li>
                {#if item.children}
                <details class="flex items-center gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
                <summary class="flex flex-row">
                    <input type="checkbox" checked={checkedNodes.includes(item.id)} onchange={e => {toggleItem(item,/** @type {HTMLInputElement} */ (e.target).checked); checkParent()}} id={"check-"+item.id} data-parent={parrentNode}/>
                    <span class="text-gray-900 gap-2 pl-2">{item.content}</span>
                    <svg class="w-5 h-5 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                        </path>
                    </svg>
                </summary>
                <div class="flex flex-row ml-3 gap-3">
                    <div>
                        <input type="checkbox" name="create" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "create")}} checked={createGroup.includes(item.id)}>
                        <span>Create</span>
                    </div>
                    <div>
                        <input type="checkbox" name="update" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "update")}} checked={updateGroup.includes(item.id)}>
                        <span>update</span>
                    </div>
                    <div>
                        <input type="checkbox" name="delete" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "delete")}} checked={deleteGroup.includes(item.id)}>
                        <span>delete</span>
                    </div>
                </div>
                    <article class="mx-4">
                        <ul class="flex flex-col gap-2 pl-2 mt-4 border-l" transition:slide={{easing: expoInOut}}>
                            <CheckboxNested menu={item.children} bind:checkedNodes={checkedNodes} parrentNode={item.id} bind:deleteGroup bind:updateGroup bind:createGroup/>
                        </ul>
                    </article>
                </details>
                {:else}
                    <details class="flex items-center font-medium marker:content-none hover:cursor-pointer">
                        <summary class="flex flex-row gap-2 p-2">
                            <input type="checkbox" checked={checkedNodes.includes(item.id)} onchange={e => {toggleItem(item, /** @type {HTMLInputElement} */ (e.target).checked); checkParent()}} data-parent={parrentNode}/>
                            <span>{item.content}</span>
                            <svg class="w-5 h-5 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                                </path>
                            </svg>
                        </summary>
                            <article class="mx-4">
                                <div class="flex flex-row ml-4 gap-3">
                                    <div>
                                        <input type="checkbox" name="create" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "create")}} checked={createGroup.includes(item.id)}>
                                        <span>Create</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="update" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "update")}} checked={updateGroup.includes(item.id)}>
                                        <span>update</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="delete" data-permis-id={item.id} onchange={e => {permisSet(item.id, /** @type {HTMLInputElement} */ (e.target).checked, "delete")}} checked={deleteGroup.includes(item.id)}>
                                        <span>delete</span>
                                    </div>
                                </div>
                            </article>
                    </details>
                {/if}
            </li>
        {/each}
    </ul>

    <style>
        details[open] > summary > svg {
            transform: rotate(90deg);
        }
    </style>