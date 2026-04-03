import { ValidationError } from "../utils/errors.js";
import { validate } from "../utils/validate.js";
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema.js";
import { emailSchema, passwordSchema } from "../schemas/common.schema.js";
import { supabase } from "../config/supabase.js";

const performLogin = async (email, password, allowedRoles) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new ValidationError(error.message);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, email")
    .eq("user_id", data.user.id)
    .single();

  if (!allowedRoles.includes(profile.role)) {
    await supabaseWithAuth(data.session.access_token).auth.signOut();
    throw new ValidationError("Access not allowed on this platform");
  }

  return { session: data.session, profile };
};

// Each signup methods creates an different role account.

export const signupMobile = async (req, res, next) => {
  try {
    const { email, password } = validate(signupSchema, req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "patient" } },
    });

    if (error) throw new ValidationError(error.message);

    res
      .status(201)
      .json({ message: "Account created successfully", session: data.session });
  } catch (error) {
    next(error);
  }
};

export const signupWeb = async (req, res, next) => {
  try {
    const { email, password } = validate(signupSchema, req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "doctor" } },
    });

    if (error) throw new ValidationError(error.message);

    res
      .status(201)
      .json({ message: "Account created successfully", session: data.session });
  } catch (error) {
    next(error);
  }
};

export const signupAdmin = async (req, res, next) => {
  try {
    const { email, password } = validate(signupSchema, req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "admin" } },
    });

    if (error) throw new ValidationError(error.message);

    res
      .status(201)
      .json({ message: "Admin account created", session: data.session });
  } catch (error) {
    next(error);
  }
};

export const loginMobile = async (req, res, next) => {
  try {
    const { email, password } = validate(loginSchema, req.body);
    const result = await performLogin(email, password, ["patient"]);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const loginWeb = async (req, res, next) => {
  try {
    const { email, password } = validate(loginSchema, req.body);
    const result = await performLogin(email, password, ["doctor"]);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = validate(loginSchema, req.body);
    const result = await performLogin(email, password, ["admin"]);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { error } = await supabaseWithAuth(req.accessToken).auth.signOut();
    if (error) throw new ValidationError(error.message);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = validate(refreshTokenSchema, req.body);
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });
    if (error) throw new ValidationError(error.message);

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = validate(emailSchema, req.body);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new ValidationError(error.message);
    res.json({ message: "Recovery email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = validate(passwordSchema, req.body);
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw new ValidationError(error.message);
    res.json({ message: "Password updated successfully", user: data.user });
  } catch (error) {
    next(error);
  }
};
