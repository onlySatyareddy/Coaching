// Paste this in browser console to test login API
(async function testLogin() {
  try {
    console.log('🧪 Testing login API...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "admin@coaching.com",
        password: "admin123"
      })
    });
    
    const data = await response.json();
    console.log('✅ Login API Response:', data);
    console.log('👤 User data:', data.data.user);
    console.log('🔐 User role:', data.data.user.role);
    console.log('🔑 Token:', data.data.accessToken);
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
  }
})();
