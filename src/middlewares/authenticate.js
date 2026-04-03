import { supabase } from "../config/supabase.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token de autenticação não fornecido",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Token inválido ou expirado",
      });
    }

    req.user = user;
    req.accessToken = token;

    next();
  } catch (e) {
    console.error("Erro na autenticação:", e);
    res.status(500).json({
      error: "Erro ao validar token",
    });
  }
};
