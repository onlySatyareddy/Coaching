const http = require('http');

// Get valid IDs for testing
const getValidIds = () => {
  // Login to get token
  const loginData = JSON.stringify({
    email: "admin@coaching.com",
    password: "admin123"
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const loginReq = http.request(loginOptions, (loginRes) => {
    let loginData = '';
    loginRes.on('data', (chunk) => {
      loginData += chunk;
    });

    loginRes.on('end', () => {
      try {
        const loginResponse = JSON.parse(loginData);
        console.log('Login Response Status:', loginRes.statusCode);

        if (loginResponse.success && loginResponse.data.accessToken) {
          const token = loginResponse.data.accessToken;
          console.log('\n🔑 Got token, getting valid IDs...');

          // Get courses to get a valid course ID
          const coursesOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/courses',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          };

          const coursesReq = http.request(coursesOptions, (coursesRes) => {
            let coursesData = '';
            coursesRes.on('data', (chunk) => {
              coursesData += chunk;
            });

            coursesRes.on('end', () => {
              try {
                const coursesResponse = JSON.parse(coursesData);
                if (coursesResponse.success && coursesResponse.data.courses.length > 0) {
                  const courseId = coursesResponse.data.courses[0]._id;
                  console.log('\n✅ Valid Course ID:', courseId);

                  // Get users to get a valid user ID
                  const usersOptions = {
                    hostname: 'localhost',
                    port: 5000,
                    path: '/api/admin/users',
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  };

                  const usersReq = http.request(usersOptions, (usersRes) => {
                    let usersData = '';
                    usersRes.on('data', (chunk) => {
                      usersData += chunk;
                    });

                    usersRes.on('end', () => {
                      try {
                        const usersResponse = JSON.parse(usersData);
                        if (usersResponse.success && usersResponse.data.users.length > 0) {
                          const userId = usersResponse.data.users[0]._id;
                          console.log('✅ Valid User ID:', userId);

                          // Now test result creation with valid IDs
                          testResultCreation(token, userId, courseId);
                        } else {
                          console.log('❌ No users found');
                        }
                      } catch (error) {
                        console.log('Users Response Error:', error.message);
                      }
                    });
                  });

                  usersReq.on('error', (error) => {
                    console.error('Users Request Error:', error.message);
                  });

                  usersReq.end();
                } else {
                  console.log('❌ No courses found');
                }
              } catch (error) {
                console.log('Courses Response Error:', error.message);
              }
            });
          });

          coursesReq.on('error', (error) => {
            console.error('Courses Request Error:', error.message);
          });

          coursesReq.end();
        }
      } catch (error) {
        console.log('Login Error:', error.message);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('Login Error:', error.message);
  });

  loginReq.write(loginData);
  loginReq.end();
};

const testResultCreation = (token, userId, courseId) => {
  console.log('\n🏆 Testing result creation with valid IDs...');
  
  const resultData = {
    student: userId,
    course: courseId,
    exam: 'JEE Advanced 2024',
    score: 245,
    rank: 156,
    totalMarks: 360,
    percentage: 68.1,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    examDate: '2024-06-01'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/results',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(resultData))
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Result Creation Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log('✅ Result creation successful');
          console.log('Result Response:', JSON.stringify(response, null, 2));
        } else {
          console.log('❌ Result creation failed:', JSON.stringify(response, null, 2));
        }
      } catch (error) {
        console.log('❌ Result creation failed - Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Result Creation Error:', error.message);
  });

  req.write(JSON.stringify(resultData));
  req.end();
};

getValidIds();
