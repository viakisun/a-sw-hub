<script lang="ts">
  /**
   * Heading Component
   * Semantic heading with industrial typography
   */

  export let level: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  export let uppercase = false;
</script>

{#if level === 1}
  <h1 class="heading heading--1" class:uppercase>
    <slot />
  </h1>
{:else if level === 2}
  <h2 class="heading heading--2" class:uppercase>
    <slot />
  </h2>
{:else if level === 3}
  <h3 class="heading heading--3" class:uppercase>
    <slot />
  </h3>
{:else if level === 4}
  <h4 class="heading heading--4" class:uppercase>
    <slot />
  </h4>
{:else if level === 5}
  <h5 class="heading heading--5" class:uppercase>
    <slot />
  </h5>
{:else}
  <h6 class="heading heading--6" class:uppercase>
    <slot />
  </h6>
{/if}

<style>
  .heading {
    font-weight: var(--weight-medium);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--fg);
  }

  .heading--1 {
    font-size: var(--text-32);
  }

  .heading--2 {
    font-size: var(--text-24);
  }

  .heading--3 {
    font-size: var(--text-20);
  }

  .heading--4 {
    font-size: var(--text-16);
  }

  .heading--5 {
    font-size: var(--text-14);
  }

  .heading--6 {
    font-size: var(--text-12);
  }

  .uppercase {
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }
</style>