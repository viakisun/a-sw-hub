<script lang="ts">
  /**
   * Text Component
   * Styled text with various sizes and colors
   */

  export let size: 'xs' | 'sm' | 'base' | 'lg' = 'base';
  export let muted = false;
  export let subtle = false;
  export let uppercase = false;
  export let weight: 'regular' | 'medium' | 'semibold' = 'regular';
</script>

<span
  class="text text--{size} text--{weight}"
  class:text--muted={muted}
  class:text--subtle={subtle}
  class:uppercase
>
  <slot />
</span>

<style>
  .text {
    color: var(--fg);
    line-height: var(--leading-normal);
  }

  .text--xs {
    font-size: var(--text-11);
  }

  .text--sm {
    font-size: var(--text-12);
  }

  .text--base {
    font-size: var(--text-14);
  }

  .text--lg {
    font-size: var(--text-16);
  }

  .text--regular {
    font-weight: var(--weight-regular);
  }

  .text--medium {
    font-weight: var(--weight-medium);
  }

  .text--semibold {
    font-weight: var(--weight-semibold);
  }

  .text--muted {
    color: var(--muted);
  }

  .text--subtle {
    color: var(--subtle);
  }

  .uppercase {
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }
</style>