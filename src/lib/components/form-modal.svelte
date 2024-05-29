<script>
import { createDialog, melt } from '@melt-ui/svelte';
import {openModal} from '$lib/stores/formModal.js';

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
    open: openModal,
  });
    /**
     * @type {boolean}
     */
</script>
{#if $openModal}
<div class="selection:bg-primary-300" use:melt={$portalled}>
  <slot class="selection:bg-primary-300" data-theme="wintry"/>
</div>
{/if}