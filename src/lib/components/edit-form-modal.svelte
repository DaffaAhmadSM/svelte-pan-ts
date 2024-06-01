<script>
    import { createDialog, melt } from '@melt-ui/svelte';
    import {editForm} from '$lib/stores/formModal.js';
    
      export let {
        elements: {
          trigger,
          overlay,
          content,
          title,
          description,
          close,
          portalled,
        }
      } = createDialog({
        forceVisible: true,
        open: editForm,
      });
        /**
         * @type {boolean}
         */
    </script>
    {#if $editForm}
    <div class="" use:melt={$portalled}>
      <slot class="" data-theme="wintry"/>
    </div>
    {/if}