import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
  console.log('\n=== DEEPER DIAGNOSTICS ===\n');

  // Check if profiles table exists and what columns it has
  console.log('1. Checking profiles table structure...');
  const { data: tableSchema, error: schemaError } = await supabase
    .from('profiles')
    .select()
    .limit(1);
  
  if (schemaError) {
    console.error('   Error accessing profiles:', schemaError.message);
  }

  // Get ALL profiles to see what exists
  console.log('\n2. All profiles in database:');
  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, school, created_at');
  
  if (profilesError) {
    console.error('   Error:', profilesError);
  } else if (allProfiles) {
    console.log(`   Total profiles: ${allProfiles.length}`);
    allProfiles.forEach(p => {
      console.log(`   - ${p.full_name} (${p.username}) - Role: ${p.role}, School: ${p.school}`);
    });
  }

  // Check auth.users again and see if profiles were auto-created
  console.log('\n3. All auth users:');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (!usersError && users) {
    users.forEach(u => {
      console.log(`   - ${u.email} (ID: ${u.id.substring(0, 8)}...)`);
    });
  }

  // Try to manually create the profile for aluno if it doesn't exist
  console.log('\n4. Attempting to ensure aluno profile exists...');
  const { data: upsertData, error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: 'f15a5b96-ae63-4e47-b4f8-85fc5a001fa8',
      full_name: 'Armindo',
      username: 'armindo',
      role: 'Aluno',
      school: 'ESCE'
    }, { onConflict: 'id' })
    .select();
  
  if (upsertError) {
    console.error('   Error upserting profile:', upsertError);
  } else {
    console.log('   ✓ Profile ensured');
  }

  // Now test if RPC works
  console.log('\n5. Testing resolve_login_email again...');
  const { data: rpcResult, error: rpcError } = await supabase.rpc('resolve_login_email', {
    login_identifier: 'armindo'
  });
  
  if (rpcError) {
    console.error('   Error calling RPC:', rpcError);
  } else if (rpcResult) {
    console.log(`   ✓ RPC now returns: ${rpcResult}`);
  } else {
    console.log('   ✗ RPC still returns null');
  }
}

diagnose().catch(console.error);
