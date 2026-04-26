import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
  console.log('\n=== DIAGNOSTIC CHECK ===\n');

  // 1. Check if aluno user exists in auth.users
  console.log('1. Checking auth.users for aluno@uniip.pt...');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error fetching users:', usersError);
  } else {
    const aluno = users.find(u => u.email === 'aluno@uniip.pt');
    if (aluno) {
      console.log(`   ✓ Found: ${aluno.email}`);
      console.log(`     - ID: ${aluno.id}`);
      console.log(`     - Email confirmed: ${aluno.email_confirmed}`);
      console.log(`     - Last sign in: ${aluno.last_sign_in_at}`);
      console.log(`     - User metadata:`, aluno.user_metadata);
    } else {
      console.log('   ✗ User NOT found in auth.users');
    }
  }

  // 2. Check profiles table
  console.log('\n2. Checking profiles table for armindo...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.eq.armindo,email.eq.aluno@uniip.pt`);
  
  if (profileError) {
    console.error('   Error:', profileError);
  } else if (profileData && profileData.length > 0) {
    profileData.forEach(p => {
      console.log(`   ✓ Found profile:`);
      console.log(`     - ID: ${p.id}`);
      console.log(`     - Full name: ${p.full_name}`);
      console.log(`     - Username: ${p.username}`);
      console.log(`     - Role: ${p.role}`);
      console.log(`     - School: ${p.school}`);
    });
  } else {
    console.log('   ✗ No profiles found');
  }

  // 3. Test the RPC function
  console.log('\n3. Testing resolve_login_email RPC...');
  const { data: rpcResult, error: rpcError } = await supabase.rpc('resolve_login_email', {
    login_identifier: 'armindo'
  });
  
  if (rpcError) {
    console.error('   Error calling RPC:', rpcError);
  } else if (rpcResult) {
    console.log(`   ✓ RPC returned: ${rpcResult}`);
  } else {
    console.log('   ✗ RPC returned null (username not found)');
  }

  // 4. Try to login with both methods
  console.log('\n4. Testing authentication...');
  
  // Test with email
  const { data: emailAuth, error: emailError } = await supabase.auth.signInWithPassword(
    'aluno@uniip.pt',
    'aluno123'
  );
  
  if (emailError) {
    console.log(`   ✗ Email login failed: ${emailError.message}`);
  } else {
    console.log(`   ✓ Email login succeeded: ${emailAuth.user.email}`);
    await supabase.auth.signOut();
  }

  console.log('\n=== END DIAGNOSTIC ===\n');
}

diagnose().catch(console.error);
