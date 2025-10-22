<script lang="ts">
  /**
   * Button Component
   * Industrial design with three variants: primary, outline, ghost
   * Zero radius, monochrome only
   */

  export let variant: 'primary' | 'outline' | 'ghost' | 'text' = 'primary';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | undefined = undefined;
  export let fullWidth = false;
</script>

{#if href && !disabled}
  <a
    {href}
    class="btn btn--{variant} btn--{size}"
    class:btn--full-width={fullWidth}
    class:btn--disabled={disabled}
    on:click
  >
    <slot />
  </a>
{:else}
  <button
    {type}
    {disabled}
    class="btn btn--{variant} btn--{size}"
    class:btn--full-width={fullWidth}
    class:btn--disabled={disabled}
    on:click
  >
    <slot />
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: inherit;
    font-weight: var(--weight-medium);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
    border-radius: 0 !important;
    position: relative;
    user-select: none;
  }

  /* Size Variants */
  .btn--small {
    height: 28px;
    padding: 0 var(--space-3);
    font-size: var(--text-11);
  }

  .btn--medium {
    height: var(--button-height);
    padding: 0 var(--space-4);
    font-size: var(--text-12);
  }

  .btn--large {
    height: 44px;
    padding: 0 var(--space-6);
    font-size: var(--text-14);
  }

  /* Primary Variant */
  .btn--primary {
    background: var(--fg);
    color: var(--bg);
    border: 1px solid var(--fg);
  }

  .btn--primary:hover:not(.btn--disabled) {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(0, 0, 0, 0.85);
  }

  .btn--primary:active:not(.btn--disabled) {
    background: rgba(0, 0, 0, 0.95);
  }

  /* Outline Variant */
  .btn--outline {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--fg);
  }

  .btn--outline:hover:not(.btn--disabled) {
    background: var(--surface-1);
  }

  .btn--outline:active:not(.btn--disabled) {
    background: var(--surface-2);
  }

  /* Ghost Variant */
  .btn--ghost {
    background: transparent;
    color: var(--fg);
    border: 1px solid transparent;
  }

  .btn--ghost:hover:not(.btn--disabled) {
    background: var(--surface-1);
  }

  .btn--ghost:active:not(.btn--disabled) {
    background: var(--surface-2);
  }

  /* Text Variant */
  .btn--text {
    background: transparent;
    color: var(--fg);
    border: none;
    padding: 0 var(--space-2);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  .btn--text:hover:not(.btn--disabled) {
    text-decoration-thickness: 2px;
  }

  .btn--text:active:not(.btn--disabled) {
    opacity: 0.8;
  }

  /* Full Width */
  .btn--full-width {
    width: 100%;
  }

  /* Disabled State */
  .btn--disabled,
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Focus State */
  .btn:focus-visible {
    outline: var(--focus-width) solid var(--focus-black);
    outline-offset: 2px;
  }
</style>