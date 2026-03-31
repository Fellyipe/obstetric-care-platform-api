import express from "express";
import {
  forgotPassword,
  login,
  loginAdmin,
  loginMobile,
  loginWeb,
  logout,
  refreshToken,
  resetPassword,
  signup,
  signupAdmin,
  signupMobile,
  signupWeb,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 */

/**
 * @swagger
 * /api/auth/signup/mobile:
 *   post:
 *     summary: Criar conta de paciente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "paciente@email.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "senha123"
 *               data:
 *                 type: object
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/signup/mobile", signupMobile);

/**
 * @swagger
 * /api/auth/signup/web:
 *   post:
 *     summary: Criar conta de médico
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "medico@email.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "senha123"
 *               data:
 *                 type: object
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos ou role não permitido
 */
router.post("/signup/web", signupWeb);

/**
 * @swagger
 * /api/auth/signup/admin:
 *   post:
 *     summary: Criar conta admin (uso interno e testes)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@mail.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "senha123"
 *               data:
 *                 type: object
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *     responses:
 *       201:
 *         description: Conta admin criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/signup/admin", signupAdmin);

/**
 * @swagger
 * /api/auth/login/mobile:
 *   post:
 *     summary: Login de paciente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "paciente@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *                 profile:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "patient"
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Acesso não permitido nesta plataforma
 */
router.post("/login/mobile", loginMobile);

/**
 * @swagger
 * /api/auth/login/web:
 *   post:
 *     summary: Login de médico
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "medico@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *                 profile:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "doctor"
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Acesso não permitido nesta plataforma
 */
router.post("/login/web", loginWeb);

/**
 * @swagger
 * /api/auth/login/admin:
 *   post:
 *     summary: Login admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@mail.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *                 profile:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Acesso não permitido nesta plataforma
 */
router.post("/login/admin", loginAdmin);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Criar nova conta
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               data:
 *                 type: object
 *                 required:
 *                   - name
 *                   - role
 *                 properties:
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado
 *       401:
 *         description: Refresh token inválido
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado
 */
router.post("/logout", authenticate, logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar reset de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Resetar senha com token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada
 */
router.post("/reset-password", resetPassword);

export default router;
