import {toast} from 'svelte-sonner'
/**
 * 
 * @param {String} message 
 * @param {null | string | number} toastId
 * @param {number} status
 * @param {number} duration
 */
export function toastTrigger (message = "request error", toastId = null, status = 200, duration = 3000) {
    const toastDuration = duration
    if (toastId !== null) {
        switch (status) {
            case 200:
            case 201:
            case 202:
            case 203:
            case 204:
            case 205:
            case 206:
            case 207:
            case 208:
            case 226:
                toast.success(message, {id: toastId, duration: toastDuration})
                break;
            case 400:
            case 401:
            case 404:
            case 500:
            case 503:
            case 504:
                toast.error(message, {id: toastId, duration: toastDuration})
                break;
            default:
                toast(message, {id: toastId, duration: toastDuration})
                break;
        }
        return;
    }
    switch (status) {
        case 200:
        case 201:
        case 202:
        case 203:
        case 204:
        case 205:
        case 206:
        case 207:
        case 208:
        case 226:
            toast.success(message, {duration: toastDuration})
            break;
        case 400:
        case 400:
        case 401:
        case 404:
        case 500:
        case 503:
        case 504:
            toast.error(message, {duration: toastDuration})
            break;
        default:
            toast(message, {duration: toastDuration})
            break;
    }
  }

  /**
 * 
 * @param {String} message 
 * @param {null | string | number} toastId
 * @param {number} status
 * @param {number} duration
 */
export function toastTriggerUpdate (message, toastId, status = 200, duration = 3000) {
    const toastDuration = duration
        switch (status) {
            case 200:
            case 201:
            case 202:
            case 203:
            case 204:
            case 205:
            case 206:
            case 207:
            case 208:
            case 226:
                toast.success(message, {id: toastId, duration: toastDuration})
                break;
            case 400:
            case 401:
            case 404:
            case 500:
            case 503:
            case 504:
                toast.error(message, {id: toastId, duration: toastDuration})
                break;
            default:
                toast(message, {id: toastId, duration: toastDuration})
                break;
        }
        return;
  }
/**
 * 
 * @param {String} message 
 * @param {null | string | number} toastId
 */
  export function toastTriggerLoading(message, toastId = null) {
    if (toastId !== null) {
        return toast.loading(message, {id: toastId})
    }
    return toast.loading(message, {
        duration: Number.POSITIVE_INFINITY
    })
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
                return data.message || 'Saved.'
            },
            error: 'Could not save.',
        }
    )
  }