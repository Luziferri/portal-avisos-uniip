import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = 'sb_publishable_Q-s7cUs4is8Kp9v4sYxc3g_QdOfW8LI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('\n=== TESTING LOGIN ===\n');

  // Test login with email and password
  console.log('Testing: aluno@uniip.pt / aluno123');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'aluno@uniip.pt',
      password: 'aluno123'
    });
    
    if (error) {
      console.error('✗ Login failed:', error.message);
      console.error('  Error details:', error);
    } else if (data.user) {
      console.log('✓ Login succeeded!');
      console.log('  User ID:', data.user.id);
      console.log('  Email:', data.user.email);
      console.log('  Email confirmed:', data.user.email_confirmed);
    }
  } catch (err) {
    console.error('✗ Exception during login:', err.message);
  }
}

testLogin().catch(console.error);
