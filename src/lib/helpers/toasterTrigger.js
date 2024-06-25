import {toast} from 'svelte-sonner'
/**
 * 
 * @param {String} message 
 * @param {any} toastId
 * @param {number} status
 */
export function toastTrigger (message, toastId = null, status = 200) {
    if (toastId !== null) {
        switch (status) {
            case 200 || 201 || 202 || 203 || 204 || 205 || 206 || 207 || 208 || 226:
                toast.success(message, {id: toastId})
                break;
            case 400 || 401 || 404 || 500 || 503 || 504:
                toast.error(message, {id: toastId})
                break;
            default:
                toast(message, {id: toastId})
                break;
        }
        return;
    }
    let icon = ''
    switch (status) {
        case 200 || 201 || 202 || 203 || 204 || 205 || 206 || 207 || 208 || 226:
            toast.success(message)
            break;
        case 400 || 401 || 404 || 500 || 503 || 504:
            toast.error(message)
            break;
        default:
            toast(message)
            break;
    }
  }

  /**
 * @param {Promise} fetch
 */
  export function toastTriggerPromise (fetch) {
    toast.promise(
        fetch,
        {
            loading: 'Saving...',
            success: (data) => {
                return 'Saved!'
            },
            error: 'Could not save.',
        }
    )
  }