import { db } from "../../config/database.js";
import { idSchema } from "../../schemas/common.schema.js";
import {
  createDiaryEntrySchema,
  updateDiaryEntrySchema,
} from "../../schemas/diary.schema.js";
import { NotFoundError } from "../../utils/errors.js";
import { validate } from "../../utils/validate.js";
import { calculateCurrentWeek } from "../../utils/weekCalculator.js";

export const listDiaryEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { record_id } = req.query;

    let query = db
      .from("diary_entries")
      .select("id, week, feeling, content, entry_date, created_at")
      .eq("user_id", userId)
      .order("entry_date", { ascending: false });

    if (record_id) {
      query = query.eq("record_id", record_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ entries: data });
  } catch (error) {
    next(error);
  }
};

export const getDiaryEntry = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    const { data, error } = await db
      .from("diary_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) throw new NotFoundError("Entry not found");

    res.json({ entry: data });
  } catch (error) {
    next(error);
  }
};

export const createDiaryEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const body = validate(createDiaryEntrySchema, req.body);

    const { data: record, error: recordError } = await db
      .from("records")
      .select("start_date, end_date")
      .eq("id", body.record_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (recordError || !record)
      throw new NotFoundError("Active record not found");

    const currentWeek = calculateCurrentWeek(record.start_date);

    const { data, error } = await db
      .from("diary_entries")
      .insert({
        user_id: userId,
        record_id: body.record_id,
        content: body.content,
        feeling: body.feeling,
        week: currentWeek,
        entry_date: body.entry_date ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Entry created successfully", entry: data });
  } catch (error) {
    next(error);
  }
};

export const updateDiaryEntry = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);
    const body = validate(updateDiaryEntrySchema, req.body);

    const { data, error } = await db
      .from("diary_entries")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Entry not found");

    res.json({ message: "Entry updated successfully", entry: data });
  } catch (error) {
    next(error);
  }
};

export const deleteDiaryEntry = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    const { data, error } = await db
      .from("diary_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Entry not found");

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
