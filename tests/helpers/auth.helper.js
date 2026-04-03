import { supabase } from "../../src/config/supabase.js";

export const createTestUser = async (role = "patient") => {
  const email = `test_${Date.now()}@mail.com`;
  const password = "senha123";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) throw error;

  return { email, password, user: data.user, session: data.session };
};

export const cleanTestUser = async (userId) => {
  await supabase.from("profiles").delete().eq("user_id", userId);
  await supabase.auth.admin.deleteUser(userId);
};
