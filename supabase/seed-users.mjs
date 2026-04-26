/*
  UNIIP - Seed users with Supabase Admin API
  Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/seed-users.mjs
*/

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const usersToSeed = [
  {
    email: "professor@uniip.pt",
    password: "prof123",
    full_name: "Prof. Armando Silva",
    username: "professor",
    role: "Professor",
    school: "ESCE",
  },
  {
    email: "aluno@uniip.pt",
    password: "aluno123",
    full_name: "Armindo",
    username: "armindo",
    role: "Aluno",
    school: "ESCE",
  },
  {
    email: "secretaria@uniip.pt",
    password: "secret123",
    full_name: "Secretaria UNIIP",
    username: "secretaria",
    role: "Secretaria",
    school: "ESCE",
  },
];

async function upsertUser(user) {
  const { data: existing, error: listError } = await admin.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const found = existing.users.find((u) => u.email?.toLowerCase() === user.email.toLowerCase());

  if (found) {
    const { error: updateError } = await admin.auth.admin.updateUserById(found.id, {
      password: user.password,
      user_metadata: {
        full_name: user.full_name,
        username: user.username,
        role: user.role,
        school: user.school,
      },
      email_confirm: true,
    });

    if (updateError) {
      throw updateError;
    }

    // Also update the profile since the trigger only fires on INSERT
    const { error: profileError } = await admin
      .from("profiles")
      .upsert({
        id: found.id,
        full_name: user.full_name,
        username: user.username.toLowerCase(),
        role: user.role,
        school: user.school,
      });

    if (profileError) {
      throw profileError;
    }

    console.log(`Updated user: ${user.email}`);
    return;
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      full_name: user.full_name,
      username: user.username,
      role: user.role,
      school: user.school,
    },
  });

  if (createError) {
    throw createError;
  }

  console.log(`Created user: ${user.email}`);
}

(async () => {
  try {
    for (const user of usersToSeed) {
      await upsertUser(user);
    }

    console.log("Seed completed.");
  } catch (error) {
    console.error("Seed failed:", error.message || error);
    process.exit(1);
  }
})();
