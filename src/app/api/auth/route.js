import { NextResponse } from 'next/server';

// Simulated user database - in a real app, you'd use a proper database
const users = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, isLogin } = body;

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 });
    }

    if (isLogin) {
      // Login logic
      const user = users.get(username);
      if (!user || user.password !== password) {
        return NextResponse.json({
          success: false,
          message: 'Invalid credentials'
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: { username: user.username }
      });

    } else {
      // Sign up logic
      if (users.has(username)) {
        return NextResponse.json({
          success: false,
          message: 'Username already exists'
        }, { status: 400 });
      }

      // Store new user
      users.set(username, { username, password });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: { username }
      });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 