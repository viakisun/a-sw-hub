// Test login script
console.log('Testing login...');

// Go to the browser at http://localhost:5173/login
// Open the browser console (F12)
// Paste this code to test login directly:

const testLoginCode = `
// Test login directly in browser console
(async function testLogin() {
  console.log('[TEST] Starting login test...');

  const credentials = {
    email: 'test@test.com',
    password: 'test'
  };

  console.log('[TEST] Using credentials:', credentials);

  // Import authStore from page context
  try {
    const { authStore } = await import('/src/domains/auth/auth.store.ts');
    console.log('[TEST] authStore imported:', authStore);

    const result = await authStore.login(credentials, false);
    console.log('[TEST] Login result:', result);

    if (result.success) {
      console.log('[TEST] ✅ Login successful!', result.user);
    } else {
      console.error('[TEST] ❌ Login failed:', result.error);
    }
  } catch (error) {
    console.error('[TEST] Error:', error);
  }
})();
`;

console.log('Copy and paste this code into the browser console at http://localhost:5173/login:\n');
console.log(testLoginCode);