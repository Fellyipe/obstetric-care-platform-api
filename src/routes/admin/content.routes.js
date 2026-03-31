import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createCategory,
  createContent,
  deleteCategory,
  deleteContent,
  listCategories,
  listContent,
  reorderCategories,
  reorderContent,
  updateCategory,
  updateContent,
  uploadCategoryImage,
  uploadContentImage,
  uploadImageMiddleware,
} from "../../controllers/admin/content.controller.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Content
 */

/**
 * @swagger
 * /api/content/categories:
 *   get:
 *     summary: Listar todas as categorias com contagem de conteúdos
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get("/categories", listCategories);

/**
 * @swagger
 * /api/content/categories:
 *   post:
 *     summary: Criar categoria
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subtitle
 *               - order
 *               - source
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Desenvolvimento do Bebê"
 *               subtitle:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Semana a semana"
 *               order:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 default: true
 *               source:
 *                 type: string
 *                 enum: [doctor, system]
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Dados inválidos
 */
router.post("/categories", createCategory);

/**
 * @swagger
 * /api/content/categories/reorder:
 *   patch:
 *     summary: Reordenar categorias
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 order:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Reordenado com sucesso
 */
router.patch("/categories/reorder", reorderCategories);

/**
 * @swagger
 * /api/content/categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Desenvolvimento do Bebê"
 *               subtitle:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Semana a semana"
 *               order:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
router.put("/categories/:id", updateCategory);

/**
 * @swagger
 * /api/content/categories/{id}:
 *   delete:
 *     summary: Desativar categoria (soft delete)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria desativada
 *       404:
 *         description: Categoria não encontrada
 */
router.delete("/categories/:id", deleteCategory);

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Listar conteúdos com filtros
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: gestational_week
 *         schema:
 *           type: integer
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de conteúdos
 */
router.get("/", listContent);

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Criar conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *               - description
 *               - read_time_minutes
 *               - content
 *               - order
 *               - source
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "1º Trimestre: a formação"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Entenda como o embrião se desenvolve."
 *               image_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://placehold.co/600x400"
 *               author_name:
 *                 type: string
 *                 nullable: true
 *                 example: "Dra. Ana Silva"
 *               author_role:
 *                 type: string
 *                 nullable: true
 *                 example: "Obstetra"
 *               read_time_minutes:
 *                 type: integer
 *                 default: 3
 *               content:
 *                 type: string
 *                 example: "# Título\n\nConteúdo em Markdown."
 *               gestational_week:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 42
 *                 nullable: true
 *               order:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 default: true
 *               source:
 *                 type: string
 *                 enum: [doctor, system]
 *     responses:
 *       201:
 *         description: Conteúdo criado
 *       400:
 *         description: Dados inválidos
 */
router.post("/", createContent);

/**
 * @swagger
 * /api/content/reorder:
 *   patch:
 *     summary: Reordenar conteúdos dentro de uma categoria
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reordenado com sucesso
 */
router.patch("/reorder", reorderContent);

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Atualizar conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "1º Trimestre: a formação"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Entenda como o embrião se desenvolve."
 *               image_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://placehold.co/600x400"
 *               author_name:
 *                 type: string
 *                 nullable: true
 *                 example: "Dra. Ana Silva"
 *               author_role:
 *                 type: string
 *                 nullable: true
 *                 example: "Obstetra"
 *               read_time_minutes:
 *                 type: integer
 *                 default: 3
 *               content:
 *                 type: string
 *                 example: "# Título\n\nConteúdo em Markdown."
 *               gestational_week:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 42
 *                 nullable: true
 *               order:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Conteúdo atualizado
 *       404:
 *         description: Conteúdo não encontrado
 */
router.put("/:id", updateContent);

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Desativar conteúdo (soft delete)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Conteúdo desativado
 *       404:
 *         description: Conteúdo não encontrado
 */
router.delete("/:id", deleteContent);

/**
 * @swagger
 * /api/content/categories/{id}/image:
 *   post:
 *     summary: Upload de imagem da categoria
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem enviada e categoria atualizada
 *       400:
 *         description: Nenhuma imagem enviada
 *       404:
 *         description: Categoria não encontrada
 */
router.post(
  "/categories/:id/image",
  uploadImageMiddleware,
  uploadCategoryImage,
);

/**
 * @swagger
 * /api/content/{id}/image:
 *   post:
 *     summary: Upload de imagem do conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem enviada e conteúdo atualizado
 *       400:
 *         description: Nenhuma imagem enviada
 *       404:
 *         description: Conteúdo não encontrado
 */
router.post("/:id/image", uploadImageMiddleware, uploadContentImage);

export default router;
