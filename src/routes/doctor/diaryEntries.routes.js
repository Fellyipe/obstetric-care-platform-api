import express from "express";
import {
  getPatientDiaryEntry,
  listPatientDiary,
} from "../../controllers/doctor/diaryEntries.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Doctor - Diary
 */

/**
 * @swagger
 * /api/doctor/diary-entries/{patient_id}/diary:
 *   get:
 *     summary: Listar entradas do diário de uma paciente
 *     tags: [Doctor - Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da paciente
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
 *                       content:
 *                         type: string
 *                         nullable: true
 *                         description: Presente apenas se a paciente compartilhou o diário
 *                       entry_date:
 *                         type: string
 *                         format: date-time
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 full_access:
 *                   type: boolean
 *                   description: Indica se o médico tem acesso ao conteúdo completo
 *                   example: true
 *       403:
 *         description: Paciente não vinculada a este médico
 *       401:
 *         description: Não autorizado
 */
router.get("/:patient_id/diary", listPatientDiary);

/**
 * @swagger
 * /api/doctor/diary-entries/{patient_id}/diary/{id}:
 *   get:
 *     summary: Buscar entrada específica do diário de uma paciente
 *     tags: [Doctor - Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da paciente (necessário para validação de acesso do médico)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da entrada do diário
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
 *                       nullable: true
 *                       description: Presente apenas se a paciente compartilhou o diário
 *                     entry_date:
 *                       type: string
 *                       format: date-time
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                 full_access:
 *                   type: boolean
 *                   description: Indica se o médico tem acesso ao conteúdo completo
 *                   example: false
 *       403:
 *         description: Paciente não vinculada a este médico
 *       404:
 *         description: Entrada não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get("/:patient_id/diary/:id", getPatientDiaryEntry);

export default router;
