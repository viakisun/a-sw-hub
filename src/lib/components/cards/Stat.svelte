<script lang="ts">
  /**
   * Stat Component
   * Metric card with value and trend indicator
   */

  export let label = '';
  export let value: string | number = '';
  export let trend: 'up' | 'down' | 'neutral' | null = null;
  export let trendValue: string | null = null;
</script>

<div class="stat">
  <div class="stat__label">{label}</div>
  <div class="stat__value">{value}</div>

  {#if trend && trendValue}
    <div class="stat__trend stat__trend--{trend}">
      <span class="stat__trend-arrow">
        {#if trend === 'up'}
          ▲
        {:else if trend === 'down'}
          ▼
        {:else}
          →
        {/if}
      </span>
      <span class="stat__trend-value">{trendValue}</span>
    </div>
  {/if}
</div>

<style>
  .stat {
    background: var(--bg);
    border: 1px solid var(--hair);
    padding: var(--space-4);
    border-radius: 0 !important;
  }

  .stat__label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
    margin-bottom: var(--space-2);
  }

  .stat__value {
    font-size: var(--text-32);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-2);
  }

  .stat__trend {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
  }

  .stat__trend-arrow {
    font-size: var(--text-11);
  }

  .stat__trend--up {
    color: var(--fg);
  }

  .stat__trend--down {
    color: var(--muted);
  }

  .stat__trend--neutral {
    color: var(--subtle);
  }
</style>