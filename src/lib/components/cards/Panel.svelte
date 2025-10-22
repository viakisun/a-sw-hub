<script lang="ts">
  /**
   * Panel Component
   * Industrial container with optional title
   */

  export let title = '';
  export let noPadding = false;
</script>

<div class="panel">
  {#if title}
    <div class="panel__header">
      <h3 class="panel__title">{title}</h3>
      {#if $$slots.actions}
        <div class="panel__actions">
          <slot name="actions" />
        </div>
      {/if}
    </div>
  {/if}

  <div class="panel__body" class:panel__body--no-padding={noPadding}>
    <slot />
  </div>
</div>

<style>
  .panel {
    background: var(--bg);
    border: 1px solid var(--hair);
    border-radius: 0 !important;
  }

  .panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--divider);
  }

  .panel__title {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .panel__actions {
    display: flex;
    gap: var(--space-2);
  }

  .panel__body {
    padding: var(--space-4);
  }

  .panel__body--no-padding {
    padding: 0;
  }
</style>