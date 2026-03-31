export const authorize =
  (...roles) =>
  (req, res, next) => {
    const userRole =
      req.user?.app_metadata?.role ?? req.user?.user_metadata?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Accesso não permitido" });
    }

    req.user.role = userRole;

    next();
  };
