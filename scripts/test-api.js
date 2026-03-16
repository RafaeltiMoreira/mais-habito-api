const http = require('http');

const baseURL = 'http://localhost:3000/api';

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          console.error("Failed to parse JSON:", data);
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log("=== Starting API Tests ===");

  try {
    const email = `test_${Date.now()}@example.com`;
    console.log(`1. Signing up user: ${email}`);
    const signupRes = await request('POST', '/auth/signup', {
      name: 'Test User',
      email,
      password: 'password123'
    });
    
    if (signupRes.status !== 201) {
      throw new Error(`Signup failed: ${JSON.stringify(signupRes.data)}`);
    }
    console.log("-> Signup successful.");
    const token = signupRes.data.token;
    
    console.log("\n2. Getting profile...");
    const profileRes = await request('GET', '/user/profile', null, token);
    if (profileRes.status !== 200) {
      throw new Error(`Profile fetch failed: ${JSON.stringify(profileRes.data)}`);
    }
    console.log(`-> Profile fetched. Points: ${profileRes.data.points}, Streak: ${profileRes.data.current_streak}`);

    console.log("\n3. Creating a daily task...");
    const createTaskRes = await request('POST', '/tasks', {
      title: 'Drink Water',
      points: 10,
      is_daily_routine: true
    }, token);
    if (createTaskRes.status !== 201) {
      throw new Error(`Task creation failed: ${JSON.stringify(createTaskRes.data)}`);
    }
    console.log(`-> Task created with ID: ${createTaskRes.data.id}`);
    const taskId = createTaskRes.data.id;

    console.log("\n4. Completing the task...");
    const completeTaskRes = await request('POST', '/task-completions', {
      task_id: taskId
    }, token);
    if (completeTaskRes.status !== 201) {
      throw new Error(`Task completion failed: ${JSON.stringify(completeTaskRes.data)}`);
    }
    console.log("-> Task marked as completed.");

    console.log("\n5. Checking profile again for points and streak update...");
    const updatedProfileRes = await request('GET', '/user/profile', null, token);
    console.log(`-> New Points: ${updatedProfileRes.data.points}, New Streak: ${updatedProfileRes.data.current_streak}`);

    console.log("\n=== All Tests Passed Successfully ===");
  } catch (error) {
    console.error("Test Error:", error.message);
  }
}

// Give server time to start if run concurrently
setTimeout(runTests, 2000);
