<script lang="ts">
  /**
   * Checkbox Component
   * Square checkbox with industrial design
   */

  export let checked = false;
  export let label = '';
  export let disabled = false;
  export let id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  export let name = '';
</script>

<div class="checkbox-wrapper">
  <input
    {id}
    type="checkbox"
    {name}
    {disabled}
    bind:checked
    class="checkbox-input"
    on:change
  />
  <label for={id} class="checkbox-label">
    <span class="checkbox-box">
      {#if checked}
        <span class="checkbox-mark">✓</span>
      {/if}
    </span>
    {#if label}
      <span class="checkbox-text">{label}</span>
    {/if}
  </label>
</div>

<style>
  .checkbox-wrapper {
    display: inline-flex;
    align-items: center;
  }

  .checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    user-select: none;
  }

  .checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid var(--fg);
    background: var(--bg);
    border-radius: 0 !important;
    transition: all var(--transition-fast);
  }

  .checkbox-mark {
    font-size: var(--text-12);
    font-weight: bold;
    line-height: 1;
    color: var(--fg);
  }

  .checkbox-text {
    font-size: var(--text-14);
    color: var(--fg);
  }

  /* Hover State */
  .checkbox-label:hover .checkbox-box {
    background: var(--surface-1);
  }

  /* Checked State */
  .checkbox-input:checked + .checkbox-label .checkbox-box {
    background: var(--fg);
    border-color: var(--fg);
  }

  .checkbox-input:checked + .checkbox-label .checkbox-mark {
    color: var(--bg);
  }

  /* Focus State */
  .checkbox-input:focus-visible + .checkbox-label .checkbox-box {
    outline: var(--focus-width) solid var(--focus-black);
    outline-offset: 2px;
  }

  /* Disabled State */
  .checkbox-input:disabled + .checkbox-label {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>