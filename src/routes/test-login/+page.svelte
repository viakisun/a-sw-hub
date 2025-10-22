<script>
  import { onMount } from 'svelte';
  import { authStore } from '../../domains/auth/auth.store';

  let result = '';
  let loading = false;

  async function testLogin() {
    loading = true;
    result = 'Testing login...\n';

    const credentials = {
      email: 'test@test.com',
      password: 'test123'
    };

    console.log('[TEST PAGE] Starting test with:', credentials);
    result += `Using credentials: ${JSON.stringify(credentials)}\n`;

    try {
      const response = await authStore.login(credentials, false);
      console.log('[TEST PAGE] Response:', response);

      if (response.success) {
        result += `✅ SUCCESS!\n`;
        result += `User: ${JSON.stringify(response.user, null, 2)}\n`;
      } else {
        result += `❌ FAILED!\n`;
        result += `Error: ${response.error}\n`;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[TEST PAGE] Error:', error);
      result += `❌ EXCEPTION!\n`;
      result += `Error: ${errorMessage}\n`;
      result += `Stack: ${errorStack || 'N/A'}\n`;
    }

    loading = false;
  }

  onMount(() => {
    testLogin();
  });
</script>

<div style="padding: 20px; font-family: monospace;">
  <h1>Login Test Page</h1>
  <button on:click={testLogin} disabled={loading}>
    {loading ? 'Testing...' : 'Run Test Again'}
  </button>
  <pre style="background: #f0f0f0; padding: 20px; margin-top: 20px; white-space: pre-wrap;">
{result}
  </pre>
</div>