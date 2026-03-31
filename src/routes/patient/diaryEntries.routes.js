import express from "express";
import {
  createDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntry,
  listDiaryEntries,
  updateDiaryEntry,
} from "../../controllers/patient/diaryEntries.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Patient - Diary
 */

/**
 * @swagger
 * /api/patient/diary-entries:
 *   get:
 *     summary: Listar entradas do diário
 *     tags: [Patient - Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pregnancy_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por gestação específica
 *     responses:
 *       200:
 *         description: Lista de entradas do diário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       week:
 *                         type: integer
 *                         example: 12
 *                       feeling:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 4
 *                         example: 3
 *                       content:
 *                         type: string
 *                         example: "Me senti muito bem hoje, o bebê chutou!"
 *                       entry_date:
 *                         type: string
 *                         format: date-time
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Não autorizado
 */
router.get("/", listDiaryEntries);

/**
 * @swagger
 * /api/patient/diary-entries/{id}:
 *   get:
 *     summary: Buscar entrada do diário por ID
 *     tags: [Patient - Diary]
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
 *         description: Entrada do diário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     week:
 *                       type: integer
 *                       example: 12
 *                     feeling:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 4
 *                     content:
 *                       type: string
 *                     entry_date:
 *                       type: string
 *                       format: date-time
 *                     pregnancy_id:
 *                       type: string
 *                       format: uuid
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Entrada não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", getDiaryEntry);

/**
 * @swagger
 * /api/patient/diary-entries:
 *   post:
 *     summary: Criar entrada no diário
 *     tags: [Patient - Diary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pregnancy_id
 *               - content
 *               - feeling
 *             properties:
 *               pregnancy_id:
 *                 type: string
 *                 format: uuid
 *                 example: "uuid-da-gestacao"
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: "Me senti muito bem hoje, o bebê chutou pela primeira vez!"
 *               feeling:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 4
 *                 example: 4
 *               entry_date:
 *                 type: string
 *                 format: date-time
 *                 description: Se não enviado, usa o momento atual
 *     responses:
 *       201:
 *         description: Entrada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entrada criada com sucesso"
 *                 entry:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Gestação não encontrada
 *       422:
 *         description: Semana gestacional fora do intervalo válido
 *       401:
 *         description: Não autorizado
 */
router.post("/", createDiaryEntry);

/**
 * @swagger
 * /api/patient/diary-entries/{id}:
 *   put:
 *     summary: Atualizar entrada do diário
 *     tags: [Patient - Diary]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: "Atualizando minha entrada de hoje"
 *               feeling:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 4
 *                 example: 2
 *               entry_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Entrada atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entrada atualizada com sucesso"
 *                 entry:
 *                   type: object
 *       404:
 *         description: Entrada não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put("/:id", updateDiaryEntry);

/**
 * @swagger
 * /api/patient/diary-entries/{id}:
 *   delete:
 *     summary: Remover entrada do diário
 *     tags: [Patient - Diary]
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
 *         description: Entrada removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entrada removida com sucesso"
 *       404:
 *         description: Entrada não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete("/:id", deleteDiaryEntry);

export default router;
