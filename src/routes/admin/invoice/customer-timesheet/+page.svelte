<script>
	import UniversalTableField from '$lib/components/universal-table-field.svelte';
	import { fade } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import { toastTrigger, toastTriggerLoading } from '$lib/helpers/toasterTrigger';
	import { getCookie } from '$lib/helpers/getLocalCookies';
    export let data;

    let formData = {
        filename: null,
        from_date: null,
        to_date: null,
        description: null,
        csvmcd: null,
        csvpns: null,
        customer_id: null,
    }

    let dumpformData = {
        filename: null,
        from_date: null,
        to_date: null,
        description: null,
        csvmcd: null,
        csvpns: null,
        customer_id: null,
    }

    let tableList = [
        {
            name: "Filename",
            id: "filename",
            type: "text"
        },
        {
            name: "Description",
            id: "description",
            type: "text",
        },
        {
            name: "From Date",
            id: "from_date",
            type: "date"
        },
        {
            name: "To Date",
            id: "to_date",
            type: "date"
        },
        {
            name: "CSV MCD",
            id: "csvmcd",
            type: "file",
            showFileName: true
        },
        {
            name: "CSV PNS",
            id: "csvpns",
            type: "file",
            showFileName: true
        }
    ]

    let search;

    let addModal = false;
    let moveConfirm = false;
    let dataDetail = false;
    let currentMoveId = null;

    let tableLoading = false;
    const deleteUrl = "/timesheet/delete-pns-mcd";
    const fetchUrl = "/customer-timesheet/list";


    $: tableData = data.list.data
    let observer;
    let loading = false;
    async function loadMore() {
      let page = setting.sizePage ? setting.sizePage : 70;
        try {
        if(!tableData.next_page_url) return;
		// @ts-ignore
        loading = true
        let loadMoreTableData;
        if (search == '') {
        loadMoreTableData = await fetch(tableData.next_page_url+ '&perpage=' + page, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          }
          });
      } else {
          loadMoreTableData = await fetch(tableData.next_page_url + '&perpage=' + page, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getCookie('token')
          },

          body: JSON.stringify({ search: search })
          });
      }
        const data = await loadMoreTableData.json();
        tableData.data = [...tableData.data, ...data.data.data];
        tableData.next_page_url = data.data.next_page_url;

        loading = false
        } catch (error) {
            loading = false
        }
        
	}
    
    let setting = data.setting;
    async function fetchTable(){
    let page = setting.sizePage ? setting.sizePage : 70;
    const get = await fetch(import.meta.env.VITE_API_URL + fetchUrl + '?perpage=' + page, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
    })
    return await get.json();
  }


  let tempMcddata;
  let tempPnsdata;
  async function createTable() {
    const toastId = toastTriggerLoading("importing data...");
    const tempTimesheet = await fetch(import.meta.env.VITE_API_URL + "/timesheet/create-temp-timesheet", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: JSON.stringify({
        filename: formData.filename,
        from_date: formData.from_date,
        to_date: formData.to_date,
        description: formData.description,
        customer_id: formData.customer_id,
      })
    })

    if (!tempTimesheet.ok) {
      return toastTrigger(tempTimesheet.statusText, toastId, tempTimesheet.status);
    }

    const tempTimesheetJson = await tempTimesheet.json();

    let mcdCsv = new FormData();
    mcdCsv.append("csv", formData.csvmcd);
    mcdCsv.append("temptimesheet_id", tempTimesheetJson.data.id);
    // const tempMcd = await fetch(import.meta.env.VITE_API_URL + "/timesheet/import-to-temp-mcd", {
    //   method: 'POST',
    //   headers: {
    //     // 'Content-Type': 'multipart/form-data',
    //     'Authorization': 'Bearer ' +  getCookie('token')
    //   },
    //   body: mcdCsv
    // })

    let pnsCsv = new FormData();
    pnsCsv.append("csv", formData.csvpns);
    pnsCsv.append("temptimesheet_id", tempTimesheetJson.data.id);
    // const tempPNS = await fetch(import.meta.env.VITE_API_URL + "/timesheet/import-to-temp-pns", {
    //   method: 'POST',
    //   headers: {
    //     // 'Content-Type': 'multipart/form-data',
    //     'Authorization': 'Bearer ' +  getCookie('token')
    //   },
    //   body: pnsCsv
    // })

    const tempMcd = await fetch(import.meta.env.VITE_API_URL + "/timesheet/import-to-temp-mcd", {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' +  getCookie('token')
        },
        body: mcdCsv
      });
     const tempPNS = await fetch(import.meta.env.VITE_API_URL + "/timesheet/import-to-temp-pns", {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' +  getCookie('token')
        },
        body: pnsCsv
      });

    if (!tempMcd.ok && !tempPNS.ok) {
        await fetch(import.meta.env.VITE_API_URL + deleteUrl + '/' + tempTimesheetJson.data.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });
        return toastTrigger(tempMcd.statusText, toastId, tempMcd.status);
    }

    await fetch(import.meta.env.VITE_API_URL + '/timesheet/compare-pns-mcd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('token')
      },
      body: JSON.stringify({
        random_string: tempTimesheetJson.data.random_string
      })
    });

    data.list = await fetchTable();
    addModal = false;
    tempMcddata = await tempMcd.json();
    tempPnsdata = await tempPNS.json();

    dataDetail = true;
    formData = dumpformData;
    return toastTrigger("data imported", toastId, 200);
  }


    async function deleteRow(id) {
        const toastId = toastTriggerLoading('Deleting...');
        const res = await fetch(import.meta.env.VITE_API_URL + deleteUrl + '/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });
        if (res.ok) {
            data.list = await fetchTable();
            return toastTrigger("Data Deleted", toastId, 200, 500);
        }

        return toastTrigger(data.list.data.message, toastId, res.status);
    }

    async function getCustomerAll(){
        const res = await fetch(import.meta.env.VITE_API_URL + '/customer/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        return await res.json();
    }

    async function  generateCustomerInvoice(id) {
        const toastId = toastTriggerLoading('Generating...');
        const res = await fetch(import.meta.env.VITE_API_URL + '/customer-timesheet/generate-invoice/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + getCookie('token')
            }
        });
        if (res.ok) {
            moveConfirm = false;
            data.list = await fetchTable();
            return toastTrigger("Data Generated", toastId, 200, 500);
        }

        let message = await res.json();

        if (!res.ok) {
            console.log("res not ok");
            moveConfirm = false;
            return toastTrigger(message.message, toastId, res.status);
        }

        return toastTrigger(data.list.data.message, toastId, res.status);
      
    }
</script>
<div class="table-container">
  <div class="flex w-full flex-col mb-6 font-poppins p-5">
      <h1 class="text-5xl">Customer Timesheet Data</h1>
  </div>
  
  <div class="flex flex-col gap-4">
      <div class="flex justify-between px-5">
              <!-- {#if searchUrl != null} -->
                  <div id="search-bar" class="w-96 bg-white  z-10">
                      <div class="flex items-center justify-center p-2 rounded-md shadow-lg">
                          <input type="text" placeholder="Search here"
                              class="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent">
                          <button
                              class="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                              Search
                          </button>
                      </div>
                  </div>
              <!-- {/if} -->
      </div>
  </div>
  
  <div class="container-table">
    {#if tableLoading}
    <div class="fixed left-0 top-0 z-99 w-full h-full flex items-center justify-center">
      <div class="loading" />
    </div>
    {:else}
    <div class="container-table">
      <table class="table-style">
        <thead class="table-thead">
          <tr>
            <th scope="col" class="table-header">
              <p>No</p>
            </th>
            {#each Object.values(data.list.header) as columnHeading}
                <th scope="col" class="table-header">
                  <p>{columnHeading}</p>
                </th>
            {/each}
            <slot name="table-header"></slot>
            <th scope="col" class="table-header">
              <p>Action</p>
            </th>
          <tr/>
        </thead>
        <tbody class="table-tbody">
          {#each data.list.data.data as row, i}
            <tr class="hover">
              <td class="table-td">{i+1}</td>
              <td class="table-td">{row.filename}</td>
              <td class="table-td">{row.customer.name}</td>
              <td class="table-td">{row.random_string}</td>
              <td class="table-td">{row.from_date}</td>
              <td class="table-td">{row.to_date}</td>
              <td class="table-td truncate max-w-20">{row.description}</td>
              <td class="table-td truncate max-w-20">{row.status}</td>
              <td class="table-td flex items-center gap-4">
                <a class="" href="/admin/invoice/customer-timesheet/{row.random_string}">
                  <div class="flex gap-2">
                    <svg fill="#3584e4" width="18px" height="18px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" stroke="#3584e4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="7.872"></g><g id="SVGRepo_iconCarrier"> <title></title> <g> <path d="M18,24H78a6,6,0,0,0,0-12H18a6,6,0,0,0,0,12Z"></path> <path d="M78,42H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path> <path d="M78,72H18a6,6,0,0,0,0,12H78a6,6,0,0,0,0-12Z"></path> </g> </g></svg>
                    <span>Detail</span>
                  </div>
                </a>
                <!-- {#if row.status == 'open'} -->
                <button class="btn btn-primary hover:btn-error" on:click={()=> {moveConfirm = true; currentMoveId=row.id}}>
                    Generate Invoice
                </button>
                <!-- {/if} -->
              </td>
              
            </tr>
          {/each}
            <tr id="observer" class="h-4" bind:this={observer}></tr>
        </tbody>
      </table>
      {#if loading}
      <div class="loading" />
      {/if}
    </div>
    {/if}
  </div>
  
  <Dialog.Root bind:open={addModal} closeOnEscape closeOnOutsideClick>
      <Dialog.Portal>
          <Dialog.Overlay
          transition={fade}
          transitionConfig={{ duration: 150 }}
          class="fixed inset-0 z-50 bg-black/50"
        />
          <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
            <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
              Add
            </Dialog.Title>
            <Dialog.Description class="mb-6 text-sm text-black">
                Fill in the form below to add a new data.
            </Dialog.Description>
            <UniversalTableField {tableList} formData={formData} />
            {#await getCustomerAll() then customerAll}
            <fieldset class="table-fieldset">
                <div class="table-field-label">Customer</div>
                <select name="customer_id" bind:value={formData.customer_id} class="table-field-input">
                    {#if customerAll}
                        {#each customerAll.data as customer}
                            <option value={customer.id}>{customer.name}</option>
                        {/each}
                    {/if}
                </select>
            </fieldset>
            {/await}
            <div class="mt-6 flex justify-end gap-4">
                <button
                  class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                    on:click={() => {
                        addModal = false;
                        formData = dumpformData;
                    }}
                >
                  Cancel
  
                </button>
                <button
                type="submit"
                  class="inline-flex h-8 items-center justify-center rounded-sm
                            bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
                  on:click={() => {
                    createTable();
                  }}
                >
                  Save changes
                </button>
            </div>
          </Dialog.Content>
      </Dialog.Portal>
  </Dialog.Root>
</div>

<Dialog.Root bind:open={moveConfirm} closeOnEscape closeOnOutsideClick>
  <Dialog.Portal>
      <Dialog.Overlay
      transition={fade}
      transitionConfig={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/50"
    />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
          Generate
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-sm text-black">
           Generate Customer Invoice?
        </Dialog.Description>
       
        <div class="mt-6 flex justify-end gap-4">
            <button
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                on:click={() => {
                    moveConfirm = false;
                }}
            >
              Cancel

            </button>
            <button
            type="submit"
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
              on:click={() => {
                generateCustomerInvoice(currentMoveId);
              }}
            >
              Move
            </button>
        </div>
      </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>


<Dialog.Root bind:open={dataDetail} closeOnEscape closeOnOutsideClick>
  <Dialog.Portal>
      <Dialog.Overlay
      transition={fade}
      transitionConfig={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/50"
    />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full max-h-[80%] overflow-scroll">
        <Dialog.Title class="m-0 text-lg font-medium text-primary-400">
          Detail Imported Data
        </Dialog.Title>
        <Dialog.Description class="mb-6 text-sm text-black">
          <div class="flex flex-row justify-between">
            <p>Total pns data: {tempPnsdata?.count}</p>
            <p>Total mcd data: {tempMcddata?.count}</p>
          </div>
        </Dialog.Description>
       
        <div class="mt-6 flex justify-end gap-4">
            <button
              class="inline-flex h-8 items-center justify-center rounded-sm
                        bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
                on:click={() => {
                    dataDetail = false;
                }}
            >
              Close

            </button>
        </div>
      </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

