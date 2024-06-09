import toast from 'svelte-french-toast'
/**
 * 
 * @param {String} message 
 * @param {String} color
 * @param {number} status
 */
export function toastTrigger (message, status = 200, color = 'green') {
    let icon = ''
    switch (status) {
        case 200 || 201 || 202 || 203 || 204 || 205 || 206 || 207 || 208 || 226:
            icon = '✅'
            color = 'background: #00A96E;'
            break;
        case 400 || 401 || 404 || 500 || 503 || 504:
            icon = '❌'
            color = 'background: #FF5861;'
            break;
        default:
            icon = '❗'
            color = 'background: #00B5FF;'
            break;
    }

    toast(message, {
        icon: icon,
        style: color,
        duration: 3000,
        position: 'top-center',
    })
  }

  /**
 * 
 * @param {String} successMessage 
 * @param {String} error
 * @param {Promise} fetch
 */
  export function toastTriggerPromise (successMessage, error, fetch) {
    toast.promise(
        fetch,
        {
            loading: 'Saving...',
            success: successMessage,
            error: 'Could not save.',
        }
    )
  }