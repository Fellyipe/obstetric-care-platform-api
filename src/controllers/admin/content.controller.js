import { validate } from "../../utils/validate.js";
import { NotFoundError } from "../../utils/errors.js";
import { uploadFile, getPublicUrl } from "../../utils/storage.js";
import multer from "multer";
import {
  categorySchema,
  contentSchema,
  reorderSchema,
  contentFilterSchema,
} from "../../schemas/admin/content.schema.js";
import { idSchema } from "../../schemas/common.schema.js";
import { supabase } from "../../config/supabase.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas arquivos de imagem são permitidos"));
    }
    cb(null, true);
  },
});

export const uploadImageMiddleware = upload.single("image");

export const listCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*, content(id)")
      .order("order", { ascending: true });

    if (error) throw error;

    const result = data.map((cat) => ({
      ...cat,
      content_count: (cat.content ?? []).length,
      content: undefined,
    }));

    res.json({ categories: result });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const body = validate(categorySchema, req.body);

    const { data, error } = await supabase
      .from("categories")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Categoria criada", category: data });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);
    const body = validate(categorySchema.partial(), req.body);

    const { data, error } = await supabase
      .from("categories")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Categoria não encontrada");

    res.json({ message: "Categoria atualizada", category: data });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    const { data, error } = await supabase
      .from("categories")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Categoria não encontrada");

    res.json({ message: "Categoria desativada" });
  } catch (error) {
    next(error);
  }
};

export const reorderCategories = async (req, res, next) => {
  try {
    const items = validate(reorderSchema, req.body);

    const updates = items.map(({ id, order }) =>
      supabase
        .from("categories")
        .update({ order, updated_at: new Date().toISOString() })
        .eq("id", id),
    );

    const results = await Promise.all(updates);
    const failed = results.filter((r) => r.error);

    if (failed.length > 0) {
      return res
        .status(500)
        .json({ error: "Algumas categorias não puderam serem reordenadas" });
    }

    res.json({ message: "Categorias reordernadas" });
  } catch (error) {
    next(error);
  }
};

export const uploadCategoryImage = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem selecionada" });
    }

    const ext = req.file.mimetype.split("/")[1];
    const path = `categories/${id}.${ext}`;

    await uploadFile({
      bucket: "content",
      path,
      file: req.file,
      accessToken: req.accessToken,
    });

    const imageUrl = getPublicUrl("content", path);

    const { data, error } = await supabase
      .from("categories")
      .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Categoria não encontrada");

    res.json({ image_url: imageUrl, category: data });
  } catch (error) {
    next(error);
  }
};

export const listContent = async (req, res, next) => {
  try {
    const filters = validate(contentFilterSchema, req.query);

    let query = supabase
      .from("content")
      .select("*")
      .order("order", { ascending: true });

    if (filters.category_id)
      query = query.eq("category_id", filters.category_id);
    if (filters.week) query = query.eq("week", filters.week);
    if (filters.q)
      query = query.or(
        `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`,
      );

    const { data, error } = await query;
    if (error) throw error;

    res.json({ content: data });
  } catch (error) {
    next(error);
  }
};

export const createContent = async (req, res, next) => {
  try {
    const body = validate(contentSchema, req.body);

    const { data, error } = await supabase
      .from("content")
      .insert(body)
      .select()
      .single();
    if (error) throw error;

    res.status(201).json({ message: "Conteúdo criado", item: data });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);
    const body = validate(contentSchema.partial(), req.body);

    const { data, error } = await supabase
      .from("content")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Conteúdo não encontrado");

    res.json({ message: "Conteúdo atualizado", item: data });
  } catch (error) {
    next(error);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    const { data, error } = await supabase
      .from("content")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Conteúdo não encontrado");

    res.json({ message: "Conteúdo desativado" });
  } catch (error) {
    next(error);
  }
};

export const reorderContent = async (req, res, next) => {
  try {
    const items = validate(reorderSchema, req.body);

    const updates = items.map(({ id, order }) =>
      supabase
        .from("content")
        .update({ order, updated_at: new Date().toISOString() })
        .eq("id", id),
    );

    const results = await Promise.all(updates);
    const failed = results.filter((r) => r.error);

    if (failed.length > 0) {
      return res
        .status(500)
        .json({ error: "Alguns itens não puderam ser reordenados" });
    }

    res.json({ message: "Itens reordernados" });
  } catch (error) {
    next(error);
  }
};

export const uploadContentImage = async (req, res, next) => {
  try {
    const id = validate(idSchema, req.params);

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem selecionada" });
    }

    const ext = req.file.mimetype.split("/")[1];
    const path = `items/${id}.${ext}`;

    await uploadFile({
      bucket: "content",
      path,
      file: req.file,
      accessToken: req.accessToken,
    });

    const imageUrl = getPublicUrl("content", path);

    const { data, error } = await supabase
      .from("content")
      .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("Conteúdo não encontrado");

    res.json({ image_url: imageUrl, item: data });
  } catch (error) {
    next(error);
  }
};
