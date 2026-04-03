import { supabase, supabaseWithAuth } from "../config/supabase.js";

export const uploadFile = async ({ bucket, path, file, accessToken }) => {
  const client = accessToken ? supabaseWithAuth(accessToken) : supabase;

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  return data.path;
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};

export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;

  return data.signedUrl;
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
};
