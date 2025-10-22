<script lang="ts">
  /**
   * Input Component
   * Industrial text input with square corners and hairline border
   */

  export let type: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' = 'text';
  export let value: string | number = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let id = `input-${Math.random().toString(36).substr(2, 9)}`;
  export let name = '';
  export let autocomplete: string | null | undefined = '';
</script>

<div class="input-wrapper">
  {#if label}
    <label for={id} class="input-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {type}
    {name}
    {placeholder}
    {disabled}
    {required}
    {autocomplete}
    bind:value
    class="input"
    class:input--error={error}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${id}-error` : undefined}
    on:input
    on:change
    on:focus
    on:blur
  />

  {#if error}
    <span id="{id}-error" class="input-error" role="alert">
      {error}
    </span>
  {/if}
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .input-label {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--fg);
  }

  .required {
    color: var(--fg);
  }

  .input {
    width: 100%;
    height: var(--input-height);
    padding: 0 var(--space-3);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    background: var(--bg);
    border: 1px solid var(--hair);
    border-radius: 0 !important;
    transition: border-color var(--transition-fast);
  }

  .input::placeholder {
    color: var(--subtle);
  }

  .input:hover:not(:disabled) {
    border-color: var(--muted);
  }

  .input:focus {
    outline: none;
    border-color: var(--fg);
    box-shadow: inset 0 0 0 1px var(--fg);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--surface-1);
  }

  .input--error {
    border-color: var(--fg);
    background: var(--surface-1);
  }

  .input-error {
    font-size: var(--text-12);
    color: var(--fg);
    font-weight: var(--weight-medium);
  }
</style>