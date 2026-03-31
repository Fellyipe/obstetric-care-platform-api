import { db } from "../../config/database.js";
import { idSchema } from "../../schemas/common.schema.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { validate } from "../../utils/validate.js";

const FULL_FIELDS = "id, week, feeling, content, entry_date, created_at";

const LIMITED_FIELDS = "id, week, feeling, entry_date, created_at";

// Verifica se determinado doctor possui acesso aos registros de patient
const getAccessLevel = async (patientId) => {
  const { data, error } = await db.rpc("get_patient_diary_sharing", {
    p_patient_id: patientId,
  });

  if (error || data === null) return null;

  return { hasAccess: true, sharesDiary: data };
};

export const listPatientDiary = async (req, res, next) => {
  try {
    const { patient_id } = req.params;

    const access = await getAccessLevel(patient_id);
    if (!access) throw new ForbiddenError("Patient not linked to this doctor");

    const fields = access.sharesDiary ? FULL_FIELDS : LIMITED_FIELDS;

    const { data, error } = await db
      .from("diary_entries")
      .select(fields)
      .eq("user_id", patient_id)
      .order("entry_date", { ascending: false });

    if (error) throw error;

    res.json({
      entries: data,
      full_access: access.sharesDiary,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientDiaryEntry = async (req, res, next) => {
  try {
    const { patient_id, id } = req.params;

    validate(idSchema, { id });

    const access = await getAccessLevel(patient_id);
    if (!access) throw new ForbiddenError("Patient not linked to this doctor");

    const fields = access.sharesDiary ? FULL_FIELDS : LIMITED_FIELDS;

    const { data, error } = await db
      .from("diary_entries")
      .select(fields)
      .eq("id", id)
      .eq("user_id", patient_id)
      .single();

    if (error || !data) throw new NotFoundError("Entry not found");

    res.json({ entry: data, full_access: access.sharesDiary });
  } catch (error) {
    next(error);
  }
};
