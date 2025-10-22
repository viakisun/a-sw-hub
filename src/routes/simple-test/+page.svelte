<script>
  import { onMount } from 'svelte';

  let status = 'Ready to test...';
  let response = '';

  async function directTest() {
    status = 'Testing direct mock login...';

    try {
      // Direct import and test
      const { getCurrentUser } = await import('$lib/data/mockUsers');
      const user = getCurrentUser();

      status = '✅ Mock user loaded successfully!';
      response = JSON.stringify(user, null, 2);

      // Now test auth store
      status += '\n\nTesting auth store...';
      const { authStore } = await import('../../domains/auth/auth.store');

      const result = await authStore.login({
        email: 'any@email.com',
        password: 'anypass'
      }, false);

      if (result.success) {
        status += '\n✅ Login successful!';
        response += '\n\nLogin Result:\n' + JSON.stringify(result, null, 2);
      } else {
        status += '\n❌ Login failed: ' + result.error;
      }

    } catch (error) {
      status = '❌ Error: ' + error.message;
      console.error(error);
      response = error.stack || error.toString();
    }
  }

  onMount(() => {
    directTest();
  });
</script>

<div style="padding: 20px; background: white; color: black;">
  <h1>Simple Login Test</h1>
  <button on:click={directTest}>Run Test</button>
  <h2>Status:</h2>
  <pre>{status}</pre>
  <h2>Response:</h2>
  <pre style="background: #f0f0f0; padding: 10px; overflow: auto;">{response}</pre>
</div>