// -------------------- Imports --------------------
const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { log } = require("console");

// -------------------- App Setup --------------------
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// helper
const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

// -------------------- Database Connection --------------------
mongoose
  .connect(
    "mongodb+srv://main:main@cluster0main.ztxrgoz.mongodb.net/db_mern_ecommerce"
  )
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// // -------------------- File Upload Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // unique: timestamp + 4-random-chars + original extension
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e4);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// -------------------- Schemas & Models --------------------

// models/allModels.js

// -------------------- 1️⃣ Admins --------------------
const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "admins", timestamps: true }
);
const Admin = mongoose.model("Admin", adminSchema);

// -------------------- ADMIN --------------------
app.post("/admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newAdmin = await Admin.create({ name, email, password });
    const results = await Admin.aggregate([
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "Admin created successfully", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create admin", error: err.message });
  }
});

app.get("/admin", async (req, res) => {
  try {
    const results = await Admin.aggregate([
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Admins retrieved successfully", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve admins", error: err.message });
  }
});

app.get("/admin/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid admin ID" });
    const results = await Admin.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "Admin not found" });
    res
      .status(200)
      .json({ message: "Admin retrieved successfully", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve admin", error: err.message });
  }
});

app.put("/admin/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
      { new: true, runValidators: true }
    );
    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    const results = await Admin.aggregate([
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Admin updated successfully", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update admin", error: err.message });
  }
});

app.delete("/admin/:id", async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    const results = await Admin.aggregate([
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Admin deleted successfully", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete admin", error: err.message });
  }
});

// -------------------- 2️⃣ Districts --------------------
const districtSchema = new Schema(
  { name: { type: String, required: true, trim: true } },
  { collection: "districts", timestamps: true }
);
const District = mongoose.model("District", districtSchema);

// -------------------- DISTRICT --------------------
app.post("/district", async (req, res) => {
  try {
    const { name } = req.body;
    await District.create({ name });
    const results = await District.aggregate([
      {
        $project: {
          districtId: "$_id",
          districtName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "District created", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create district", error: err.message });
  }
});

app.get("/district", async (req, res) => {
  try {
    const results = await District.aggregate([
      {
        $project: {
          districtId: "$_id",
          districtName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Districts retrieved", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve districts", error: err.message });
  }
});

app.get("/district/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid district ID" });
    const results = await District.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          districtId: "$_id",
          districtName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "District not found" });
    res
      .status(200)
      .json({ message: "District retrieved", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve district", error: err.message });
  }
});

app.put("/district/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await District.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "District not found" });
    const results = await District.aggregate([
      {
        $project: {
          districtId: "$_id",
          districtName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "District updated", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update district", error: err.message });
  }
});

app.delete("/district/:id", async (req, res) => {
  try {
    const deleted = await District.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "District not found" });
    const results = await District.aggregate([
      {
        $project: {
          districtId: "$_id",
          districtName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "District deleted", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete district", error: err.message });
  }
});

// -------------------- 3️⃣ Places --------------------
const placeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
  },
  { collection: "places", timestamps: true }
);
const Place = mongoose.model("Place", placeSchema);

// ---------- PLACE ROUTES ----------
// 1. CREATE
app.post("/place", async (req, res) => {
  try {
    const { name, districtId } = req.body;
    await Place.create({ name, districtId });
    const results = await Place.aggregate([
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          placeId: "$_id",
          placeName: "$name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "Place created", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create place", error: err.message });
  }
});

// 2. READ ALL
app.get("/place", async (req, res) => {
  try {
    const results = await Place.aggregate([
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          placeId: "$_id",
          placeName: "$name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Places retrieved", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve places", error: err.message });
  }
});

// 3. READ ONE
app.get("/place/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid place ID" });
    const results = await Place.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          placeId: "$_id",
          placeName: "$name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "Place not found" });
    res.status(200).json({ message: "Place retrieved", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve place", error: err.message });
  }
});

// 4. UPDATE
app.put("/place/:id", async (req, res) => {
  try {
    const { name, districtId } = req.body;
    const updated = await Place.findByIdAndUpdate(
      req.params.id,
      { name, districtId },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Place not found" });
    const results = await Place.aggregate([
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          placeId: "$_id",
          placeName: "$name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Place updated", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update place", error: err.message });
  }
});

// 5. DELETE
app.delete("/place/:id", async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Place not found" });
    const results = await Place.aggregate([
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          placeId: "$_id",
          placeName: "$name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Place deleted", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete place", error: err.message });
  }
});

// -------------------- 4️⃣ Types --------------------
const typeSchema = new Schema(
  { name: { type: String, required: true, trim: true } },
  { collection: "types", timestamps: true }
);
const Type = mongoose.model("Type", typeSchema);

// ---------- TYPE ROUTES ----------
// 1. CREATE
app.post("/type", async (req, res) => {
  try {
    const { name } = req.body;
    await Type.create({ name });
    const results = await Type.aggregate([
      {
        $project: {
          typeId: "$_id",
          typeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "Type created", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create type", error: err.message });
  }
});

// 2. READ ALL
app.get("/type", async (req, res) => {
  try {
    const results = await Type.aggregate([
      {
        $project: {
          typeId: "$_id",
          typeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Types retrieved", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve types", error: err.message });
  }
});

// 3. READ ONE
app.get("/type/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid type ID" });
    const results = await Type.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          typeId: "$_id",
          typeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "Type not found" });
    res.status(200).json({ message: "Type retrieved", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve type", error: err.message });
  }
});

// 4. UPDATE
app.put("/type/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Type.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Type not found" });
    const results = await Type.aggregate([
      {
        $project: {
          typeId: "$_id",
          typeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Type updated", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update type", error: err.message });
  }
});

// 5. DELETE
app.delete("/type/:id", async (req, res) => {
  try {
    const deleted = await Type.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Type not found" });
    const results = await Type.aggregate([
      {
        $project: {
          typeId: "$_id",
          typeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Type deleted", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete type", error: err.message });
  }
});











// -------------------- 5️⃣ Categories --------------------
const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    typeId: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  },
  { collection: "categories", timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

// ---------- CATEGORY ROUTES ----------
// 1. CREATE
app.post("/category", async (req, res) => {
  try {
    const { name, typeId } = req.body;
    await Category.create({ name, typeId });
    const results = await Category.aggregate([
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "Category created", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: err.message });
  }
});

// 2. READ ALL
app.get("/category", async (req, res) => {
  try {
    const results = await Category.aggregate([
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Categories retrieved", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve categories", error: err.message });
  }
});

// 3. READ ONE
app.get("/category/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid category ID" });
    const results = await Category.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({ message: "Category retrieved", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve category", error: err.message });
  }
});

// 4. UPDATE
app.put("/category/:id", async (req, res) => {
  try {
    const { name, typeId } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, typeId },
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    const results = await Category.aggregate([
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Category updated", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: err.message });
  }
});

// 5. DELETE
app.delete("/category/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    const results = await Category.aggregate([
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Category deleted", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: err.message });
  }
});







// -------------------- 6️⃣ Subcategories --------------------
const subcategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { collection: "subcategories", timestamps: true }
);
const Subcategory = mongoose.model("Subcategory", subcategorySchema);



// GET /category/byType/:typeId
app.get("/categoryByType/:typeId", async (req, res) => {
  try {
    const typeId = toObjectId(req.params.typeId);
    if (!typeId) return res.status(400).json({ message: "Invalid typeId" });

    const results = await Category.aggregate([
      { $match: { typeId } },
      { $project: { categoryId: "$_id", categoryName: "$name", _id: 0 } },
    ]);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 2.  by-category  (classic “give me every sub for this category”)
app.get("/subcategoryByCategory/:categoryId", async (req, res) => {
  try {
    const categoryId = toObjectId(req.params.categoryId);
    if (!categoryId)
      return res.status(400).json({ message: "Invalid category ID" });

    const results = await Subcategory.aggregate([
      { $match: { categoryId: categoryId } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res
      .status(200)
      .json({ message: "Subcategories filtered by category", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to filter by category", error: err.message });
  }
});

/*  ORIGINAL CRUD ROUTES (kept for completeness)  */
// CREATE
app.post("/subcategory", async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    await Subcategory.create({ name, categoryId });
    const results = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(201).json({ message: "Subcategory created", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create subcategory", error: err.message });
  }
});

// READ ALL
app.get("/subcategory", async (req, res) => {
  try {
    const results = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Subcategories retrieved", results });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to retrieve subcategories",
        error: err.message,
      });
  }
});

// READ ONE
app.get("/subcategory/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid subcategory ID" });
    const results = await Subcategory.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ message: "Subcategory not found" });
    res
      .status(200)
      .json({ message: "Subcategory retrieved", results: results[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve subcategory", error: err.message });
  }
});

// UPDATE
app.put("/subcategory/:id", async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const updated = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, categoryId },
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Subcategory not found" });
    const results = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Subcategory updated", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update subcategory", error: err.message });
  }
});

// DELETE
app.delete("/subcategory/:id", async (req, res) => {
  try {
    const deleted = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Subcategory not found" });
    const results = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          subcategoryId: "$_id",
          subcategoryName: "$name",
          categoryId: "$cat._id",
          categoryName: "$cat.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Subcategory deleted", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete subcategory", error: err.message });
  }
});










// -------------------- 7️⃣ Brands --------------------
const brandSchema = new Schema(
  { name: { type: String, required: true, trim: true } },
  { collection: "brands", timestamps: true }
);
const Brand = mongoose.model("Brand", brandSchema);

// -------------------- 8️⃣ Colors --------------------
const colorSchema = new Schema(
  { name: { type: String, required: true, trim: true } },
  { collection: "colors", timestamps: true }
);
const Color = mongoose.model("Color", colorSchema);

// -------------------- 9️⃣ Sizes --------------------
const sizeSchema = new Schema(
  { name: { type: String, required: true, trim: true } },
  { collection: "sizes", timestamps: true }
);
const Size = mongoose.model("Size", sizeSchema);

// -------------------- 🔟 Sellers --------------------
const sellerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, trim: true },
    photo: String,
    proof: String,
    logo: String,
    slogan: String,
    placeId: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  },
  { collection: "sellers", timestamps: true }
);
const Seller = mongoose.model("Seller", sellerSchema);

// -------------------- 11️⃣ Users --------------------
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, trim: true },
    photo: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    doj: { type: Date, default: Date.now },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { collection: "users", timestamps: true }
);
const User = mongoose.model("User", userSchema);

// -------------------- 12️⃣ User Addresses --------------------
const userAddressSchema = new Schema(
  {
    address: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    placeId: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  },
  { collection: "userAddresses", timestamps: true }
);
const UserAddress = mongoose.model("UserAddress", userAddressSchema);

// -------------------- 13️⃣ Delivery Boys --------------------
const deliveryBoySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, trim: true },
    idProof: String,
    license: String,
    photo: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    placeId: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  },
  { collection: "deliveryBoys", timestamps: true }
);
const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

// -------------------- 14️⃣ Products --------------------
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    details: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
    subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
  },
  { collection: "products", timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

// -------------------- 15️⃣ Product Colors --------------------
const productColorSchema = new Schema(
  {
    colorId: { type: Schema.Types.ObjectId, ref: "Color" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { collection: "productColors", timestamps: true }
);
const ProductColor = mongoose.model("ProductColor", productColorSchema);

// -------------------- 16️⃣ Product Sizes --------------------
const productSizeSchema = new Schema(
  {
    productColorId: { type: Schema.Types.ObjectId, ref: "ProductColor" },
    sizeId: { type: Schema.Types.ObjectId, ref: "Size" },
  },
  { collection: "productSizes", timestamps: true }
);
const ProductSize = mongoose.model("ProductSize", productSizeSchema);

// -------------------- 17️⃣ Stocks --------------------
const stockSchema = new Schema(
  {
    dateAdded: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    productSizeId: { type: Schema.Types.ObjectId, ref: "ProductSize" },
  },
  { collection: "stocks", timestamps: true }
);
const Stock = mongoose.model("Stock", stockSchema);

// -------------------- 18️⃣ Galleries --------------------
const gallerySchema = new Schema(
  {
    file: { type: String, required: true },
    productColorId: { type: Schema.Types.ObjectId, ref: "ProductColor" },
  },
  { collection: "galleries", timestamps: true }
);
const Gallery = mongoose.model("Gallery", gallerySchema);

// -------------------- 19️⃣ Bookings --------------------
const bookingSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
    deliveryBoyId: { type: Schema.Types.ObjectId, ref: "DeliveryBoy" },
  },
  { collection: "bookings", timestamps: true }
);
const Booking = mongoose.model("Booking", bookingSchema);

// -------------------- 20️⃣ Carts --------------------
const cartSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["Added", "CheckedOut"], default: "Added" },
    productSizeId: { type: Schema.Types.ObjectId, ref: "ProductSize" },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  { collection: "carts", timestamps: true }
);
const Cart = mongoose.model("Cart", cartSchema);

// -------------------- 21️⃣ Ratings --------------------
const ratingSchema = new Schema(
  {
    datetime: { type: Date, default: Date.now },
    value: { type: Number, required: true, min: 1, max: 5 },
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { collection: "ratings", timestamps: true }
);
const Rating = mongoose.model("Rating", ratingSchema);

// -------------------- 22️⃣ Rating Files --------------------
const ratingFileSchema = new Schema(
  {
    file: { type: String, required: true },
    ratingId: { type: Schema.Types.ObjectId, ref: "Rating" },
  },
  { collection: "ratingFiles", timestamps: true }
);
const RatingFile = mongoose.model("RatingFile", ratingFileSchema);

// -------------------- 23️⃣ Complaints --------------------
const complaintSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    reply: String,
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    date: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  { collection: "complaints", timestamps: true }
);
const Complaint = mongoose.model("Complaint", complaintSchema);

// -------------------- BRAND --------------------
app.post("/brand", async (req, res) => {
  try {
    const { name } = req.body;
    await Brand.create({ name });
    const data = await Brand.aggregate([
      {
        $project: {
          brandId: "$_id",
          brandName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/brand", async (req, res) => {
  try {
    const data = await Brand.aggregate([
      {
        $project: {
          brandId: "$_id",
          brandName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/brand/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const data = await Brand.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          brandId: "$_id",
          brandName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!data.length) return res.status(404).json({ message: "Not found" });
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/brand/:id", async (req, res) => {
  try {
    const { name } = req.body;
    await Brand.findByIdAndUpdate(req.params.id, { name });
    const data = await Brand.aggregate([
      {
        $project: {
          brandId: "$_id",
          brandName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/brand/:id", async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    const data = await Brand.aggregate([
      {
        $project: {
          brandId: "$_id",
          brandName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- COLOR --------------------
app.post("/color", async (req, res) => {
  try {
    const { name } = req.body;
    await Color.create({ name });
    const data = await Color.aggregate([
      {
        $project: {
          colorId: "$_id",
          colorName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/color", async (req, res) => {
  try {
    const data = await Color.aggregate([
      {
        $project: {
          colorId: "$_id",
          colorName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/color/:id", async (req, res) => {
  try {
    const { name } = req.body;
    await Color.findByIdAndUpdate(req.params.id, { name });
    const data = await Color.aggregate([
      {
        $project: {
          colorId: "$_id",
          colorName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/color/:id", async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    const data = await Color.aggregate([
      {
        $project: {
          colorId: "$_id",
          colorName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- SIZE --------------------
app.post("/size", async (req, res) => {
  try {
    const { name } = req.body;
    await Size.create({ name });
    const data = await Size.aggregate([
      {
        $project: {
          sizeId: "$_id",
          sizeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/size", async (req, res) => {
  try {
    const data = await Size.aggregate([
      {
        $project: {
          sizeId: "$_id",
          sizeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/size/:id", async (req, res) => {
  try {
    const { name } = req.body;
    await Size.findByIdAndUpdate(req.params.id, { name });
    const data = await Size.aggregate([
      {
        $project: {
          sizeId: "$_id",
          sizeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/size/:id", async (req, res) => {
  try {
    await Size.findByIdAndDelete(req.params.id);
    const data = await Size.aggregate([
      {
        $project: {
          sizeId: "$_id",
          sizeName: "$name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- SELLER --------------------
app.post(
  "/seller",
  upload.fields([{ name: "photo" }, { name: "logo" }, { name: "proof" }]),
  async (req, res) => {
    try {
      const { name, email, password, address, slogan, placeId } = req.body;
      const photo = req.files?.photo
        ? `/uploads/${req.files.photo[0].filename}`
        : "";
      const logo = req.files?.logo
        ? `/uploads/${req.files.logo[0].filename}`
        : "";
      const proof = req.files?.proof
        ? `/uploads/${req.files.proof[0].filename}`
        : "";
      await Seller.create({
        name,
        email,
        password,
        address,
        photo,
        logo,
        proof,
        slogan,
        placeId,
      });
      const data = await Seller.aggregate([
        {
          $lookup: {
            from: "places",
            localField: "placeId",
            foreignField: "_id",
            as: "place",
          },
        },
        { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            sellerId: "$_id",
            name: 1,
            email: 1,
            address: 1,
            photo: 1,
            logo: 1,
            proof: 1,
            slogan: 1,
            placeId: "$place._id",
            placeName: "$place.name",
            createdAt: 1,
            updatedAt: 1,
            _id: 0,
          },
        },
      ]);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
app.get("/seller", async (req, res) => {
  try {
    const data = await Seller.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sellerId: "$_id",
          name: 1,
          email: 1,
          address: 1,
          photo: 1,
          logo: 1,
          proof: 1,
          slogan: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/seller/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const data = await Seller.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sellerId: "$_id",
          name: 1,
          email: 1,
          address: 1,
          photo: 1,
          logo: 1,
          proof: 1,
          slogan: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!data.length) return res.status(404).json({ message: "Not found" });
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put(
  "/seller/:id",
  upload.fields([{ name: "photo" }, { name: "logo" }, { name: "proof" }]),
  async (req, res) => {
    try {
      const { name, email, password, address, slogan, placeId } = req.body;
      const update = { name, email, password, address, slogan, placeId };
      if (req.files?.photo)
        update.photo = `/uploads/${req.files.photo[0].filename}`;
      if (req.files?.logo)
        update.logo = `/uploads/${req.files.logo[0].filename}`;
      if (req.files?.proof)
        update.proof = `/uploads/${req.files.proof[0].filename}`;
      await Seller.findByIdAndUpdate(req.params.id, update);
      const data = await Seller.aggregate([
        {
          $lookup: {
            from: "places",
            localField: "placeId",
            foreignField: "_id",
            as: "place",
          },
        },
        { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            sellerId: "$_id",
            name: 1,
            email: 1,
            address: 1,
            photo: 1,
            logo: 1,
            proof: 1,
            slogan: 1,
            placeId: "$place._id",
            placeName: "$place.name",
            createdAt: 1,
            updatedAt: 1,
            _id: 0,
          },
        },
      ]);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.put("/sellerPassword/:id", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const sellerCheck = await Seller.findOne({
      _id: req.params.id,
      password: oldPassword,
    });
    if (!sellerCheck) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    await Seller.findByIdAndUpdate(req.params.id, { password: newPassword });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/seller/:id", async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    const data = await Seller.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sellerId: "$_id",
          name: 1,
          email: 1,
          address: 1,
          photo: 1,
          logo: 1,
          proof: 1,
          slogan: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- USER --------------------
app.post("/user", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password, contact, gender, placeId } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : "";
    await User.create({
      name,
      email,
      password,
      contact,
      photo,
      gender,
      placeId,
    });
    const data = await User.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          photo: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/user", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          photo: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/user/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const data = await User.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "districts",
          localField: "place.districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: { path: "$district", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          gender: 1,
          photo: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          districtId: "$district._id",
          districtName: "$district.name",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!data.length)
      return res.status(404).json({ message: "User not found" });
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/user/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, contact, placeId } = req.body;
    const update = { name, email, contact, placeId };
    if (req.file) update.photo = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/userPassword/:id", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userCheck = await User.findOne({
      _id: req.params.id,
      password: oldPassword,
    });
    if (!userCheck) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const update = { password: newPassword };

    await User.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- USER ADDRESS --------------------
app.post("/userAddress", async (req, res) => {
  try {
    const { address, userId, placeId } = req.body;
    await UserAddress.create({ address, userId, placeId });
    const data = await UserAddress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userAddressId: "$_id",
          address: 1,
          userId: "$user._id",
          userName: "$user.name",
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/userAddress", async (req, res) => {
  try {
    const data = await UserAddress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userAddressId: "$_id",
          address: 1,
          userId: "$user._id",
          userName: "$user.name",
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/userAddress/:id", async (req, res) => {
  try {
    const { address, userId, placeId } = req.body;
    await UserAddress.findByIdAndUpdate(req.params.id, {
      address,
      userId,
      placeId,
    });
    const data = await UserAddress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userAddressId: "$_id",
          address: 1,
          userId: "$user._id",
          userName: "$user.name",
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/userAddress/:id", async (req, res) => {
  try {
    await UserAddress.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------- DELIVERY PARTNER --------------------
app.post(
  "/deliverypartner",
  upload.fields([{ name: "photo" }, { name: "idProof" }, { name: "license" }]),
  async (req, res) => {
    try {
      const { name, email, password, contact, placeId } = req.body;
      const photo = req.files?.photo
        ? `/uploads/${req.files.photo[0].filename}`
        : "";
      const idProof = req.files?.idProof
        ? `/uploads/${req.files.idProof[0].filename}`
        : "";
      const license = req.files?.license
        ? `/uploads/${req.files.license[0].filename}`
        : "";
      await DeliveryBoy.create({
        name,
        email,
        password,
        contact,
        photo,
        idProof,
        license,
        placeId,
      });
      const data = await DeliveryBoy.aggregate([
        {
          $lookup: {
            from: "places",
            localField: "placeId",
            foreignField: "_id",
            as: "place",
          },
        },
        { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            deliveryPartnerId: "$_id",
            name: 1,
            email: 1,
            contact: 1,
            photo: 1,
            idProof: 1,
            license: 1,
            status: 1,
            placeId: "$place._id",
            placeName: "$place.name",
            createdAt: 1,
            updatedAt: 1,
            _id: 0,
          },
        },
      ]);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
app.get("/deliverypartner", async (req, res) => {
  try {
    const data = await DeliveryBoy.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          deliveryBoyId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          photo: 1,
          status: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/deliverypartner/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const data = await DeliveryBoy.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "districts",
          localField: "place.districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: { path: "$district", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          deliveryPartnerId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          photo: 1,
          idProof: 1,
          license: 1,
          status: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          districtId: "$district._id",
          districtName: "$district.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);

    if (!data.length)
      return res.status(404).json({ message: "Delivery partner not found" });
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/deliverypartner/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password, contact, placeId, status } = req.body;
    const update = { name, email, password, contact, placeId, status };
    if (req.file) update.photo = `/uploads/${req.file.filename}`;
    await DeliveryBoy.findByIdAndUpdate(req.params.id, update);
    const data = await DeliveryBoy.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          deliveryBoyId: "$_id",
          name: 1,
          email: 1,
          contact: 1,
          photo: 1,
          status: 1,
          placeId: "$place._id",
          placeName: "$place.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/deliverypartnerPassword/:id", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const partner = await DeliveryBoy.findOne({
      _id: req.params.id,
      password: oldPassword,
    });
    if (!partner) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    await DeliveryBoy.findByIdAndUpdate(req.params.id, {
      password: newPassword,
    });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/deliverypartner/:id", async (req, res) => {
  try {
    await DeliveryBoy.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* ------------------------------------------------
   POST  /product   (creates product + productColors)
------------------------------------------------ */
/* ------------------------------------------------
   POST  /product   (with Type + Colours)
------------------------------------------------ */
app.post("/product", async (req, res) => {
  try {
    const {
      name,
      details,
      status = "Active",
      brandId,
      subcategoryId,
      sellerId,
      colorIds, // array of colour _ids
    } = req.body;

    /* 1.  create product */
    const prod = await Product.create({
      name,
      details,
      status,
      brandId,
      subcategoryId,
      sellerId,
    });

    /* 2.  create ProductColor rows */
    if (Array.isArray(colorIds) && colorIds.length) {
      const pcDocs = colorIds.map((cid) => ({
        productId: prod._id,
        colorId: cid,
      }));
      await ProductColor.insertMany(pcDocs);
    }

    /* 3.  full aggregate (Brand + Subcategory + Category + Type + Seller + Colours) */
    const data = await Product.aggregate([
      { $match: { _id: prod._id } },

      /* subcategory -> category -> type */
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "categories",
          localField: "subcategory.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "types",
          localField: "category.typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },

      /* brand */
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },

      /* seller */
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      /* colours */
      {
        $lookup: {
          from: "productcolors",
          localField: "_id",
          foreignField: "productId",
          as: "productColors",
        },
      },
      { $unwind: { path: "$productColors", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "colors",
          localField: "productColors.colorId",
          foreignField: "_id",
          as: "productColors.color",
        },
      },
      {
        $unwind: {
          path: "$productColors.color",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* final shape */
      {
        $group: {
          _id: "$_id",
          productId: { $first: "$_id" },
          name: { $first: "$name" },
          details: { $first: "$details" },
          status: { $first: "$status" },

          brandId: { $first: "$brand._id" },
          brandName: { $first: "$brand.name" },

          subcategoryId: { $first: "$subcategory._id" },
          subcategoryName: { $first: "$subcategory.name" },

          categoryId: { $first: "$category._id" },
          categoryName: { $first: "$category.name" },

          typeId: { $first: "$type._id" },
          typeName: { $first: "$type.name" },

          sellerId: { $first: "$seller._id" },
          sellerName: { $first: "$seller.name" },

          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },

          colours: {
            $push: {
              colorId: "$productColors.color._id",
              colorName: "$productColors.color.name",
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  GET  /product/full-tree
    [ {
        productId, name, brandName ..., 
        colours: [ {
                    colorId, colorName,
                    sizes: [ { sizeId, sizeName } ]
                  } ]
      } ]
------------------------------------------------ */
app.get("/product", async (req, res) => {
  try {
    const tree = await Product.aggregate([
      /* 1.  usual brand / category / type / seller joins */
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcat",
        },
      },
      { $unwind: { path: "$subcat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subcat.categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "cat.typeId",
          foreignField: "_id",
          as: "typ",
        },
      },
      { $unwind: { path: "$typ", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      /* 2.  colours for this product */
      {
        $lookup: {
          from: "productColors",
          localField: "_id",
          foreignField: "productId",
          as: "productColors",
        },
      },
      { $unwind: { path: "$productColors", preserveNullAndEmptyArrays: true } },

      /* 3.  colour master */
      {
        $lookup: {
          from: "colors",
          localField: "productColors.colorId",
          foreignField: "_id",
          as: "productColors.color",
        },
      },
      {
        $unwind: {
          path: "$productColors.color",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 4.  sizes for this productColor */
      {
        $lookup: {
          from: "productSizes",
          localField: "productColors._id",
          foreignField: "productColorId",
          as: "productColors.sizes",
        },
      },
      {
        $unwind: {
          path: "$productColors.sizes",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 5.  size master */
      {
        $lookup: {
          from: "sizes",
          localField: "productColors.sizes.sizeId",
          foreignField: "_id",
          as: "productColors.sizes.size",
        },
      },
      {
        $unwind: {
          path: "$productColors.sizes.size",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 6.  group back: product -> colours -> sizes */
      {
        $group: {
          _id: "$_id",
          productId: { $first: "$_id" },
          name: { $first: "$name" },
          details: { $first: "$details" },
          status: { $first: "$status" },
          brandName: { $first: "$brand.name" },
          typeName: { $first: "$typ.name" },
          categoryName: { $first: "$cat.name" },
          subcategoryName: { $first: "$subcat.name" },
          sellerName: { $first: "$seller.name" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          colours: {
            $push: {
              colorId: "$productColors.color._id",
              colorName: "$productColors.color.name",
              sizeId: "$productColors.sizes.size._id",
              sizeName: "$productColors.sizes.size.name",
            },
          },
        },
      },

      /* 7.  nest sizes inside each colour */
      {
        $addFields: {
          colours: {
            $reduce: {
              input: "$colours",
              initialValue: [],
              in: {
                $let: {
                  vars: { prev: "$$value", curr: "$$this" },
                  in: {
                    $cond: [
                      {
                        $eq: [
                          {
                            $indexOfArray: ["$$prev.colorId", "$$curr.colorId"],
                          },
                          -1,
                        ],
                      },
                      /* new colour */
                      {
                        $concatArrays: [
                          "$$prev",
                          [
                            {
                              colorId: "$$curr.colorId",
                              colorName: "$$curr.colorName",
                              sizes: ["$$curr"],
                            },
                          ],
                        ],
                      },
                      /* append size to existing colour */
                      {
                        $map: {
                          input: "$$prev",
                          as: "p",
                          in: {
                            $cond: [
                              { $eq: ["$$p.colorId", "$$curr.colorId"] },
                              {
                                colorId: "$$p.colorId",
                                colorName: "$$p.colorName",
                                sizes: {
                                  $concatArrays: ["$$p.sizes", ["$$curr"]],
                                },
                              },
                              "$$p",
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      /* 8.  tidy shape */
      {
        $project: {
          _id: 0,
          productId: 1,
          name: 1,
          details: 1,
          status: 1,
          brandName: 1,
          typeName: 1,
          categoryName: 1,
          subcategoryName: 1,
          sellerName: 1,
          createdAt: 1,
          updatedAt: 1,
          colours: 1,
        },
      },
    ]);

    res.json({ data: tree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /product/card
app.get("/productCard", async (req, res) => {
  try {
    const cards = await Product.aggregate([
      /* 1.  basic joins (brand, category, type, seller) – keep names */
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcat",
        },
      },
      { $unwind: { path: "$subcat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subcat.categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "cat.typeId",
          foreignField: "_id",
          as: "typ",
        },
      },
      { $unwind: { path: "$typ", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      /* 2.  first colour → first gallery image only */
      {
        $lookup: {
          from: "productColors",
          localField: "_id",
          foreignField: "productId",
          as: "pc",
        },
      },
      { $limit: 1 }, // keep only first productColor row
      {
        $lookup: {
          from: "galleries",
          localField: "pc._id",
          foreignField: "productColorId",
          as: "gallery",
        },
      },
      { $limit: 1 }, // keep only first gallery row

      /* 3.  shape final object */
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: 1,
          details: 1,
          status: 1,
          brandName: { $ifNull: ["$brand.name", null] },
          categoryName: { $ifNull: ["$cat.name", null] },
          typeName: { $ifNull: ["$typ.name", null] },
          sellerName: { $ifNull: ["$seller.name", null] },
          image: {
            $cond: [
              { $gt: [{ $size: "$gallery" }, 0] },
              { $concat: ["/uploads", { $arrayElemAt: ["$gallery.file", 0] }] },
              null,
            ],
          },
        },
      },
    ]);

    res.json({ data: cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* ------------------------------------------------
   1.  colours that exist for a specific product
------------------------------------------------ */
app.get("/colorsByProduct/:productId", async (req, res) => {
  try {
    const productId = toObjectId(req.params.productId);
    if (!productId)
      return res.status(400).json({ message: "Invalid productId" });

    const data = await ProductColor.aggregate([
      { $match: { productId } },
      {
        $lookup: {
          from: "colors",
          localField: "colorId",
          foreignField: "_id",
          as: "color",
        },
      },
      { $unwind: "$color" },
      {
        $project: {
          colorId: "$color._id",
          colorName: "$color.name",
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* colours that belong to one product */
app.get("/colorsByProduct/:productId", async (req, res) => {
  try {
    const productId = toObjectId(req.params.productId);
    if (!productId)
      return res.status(400).json({ message: "Invalid productId" });

    const data = await ProductColor.aggregate([
      { $match: { productId } },
      {
        $lookup: {
          from: "colors",
          localField: "colorId",
          foreignField: "_id",
          as: "color",
        },
      },
      { $unwind: "$color" },
      { $project: { colorId: "$color._id", colorName: "$color.name", _id: 0 } },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* sizes that belong to one productColour row */
app.get("/sizesByProductColor/:productColorId", async (req, res) => {
  try {
    const productColorId = toObjectId(req.params.productColorId);
    if (!productColorId)
      return res.status(400).json({ message: "Invalid productColorId" });

    const data = await ProductSize.aggregate([
      { $match: { productColorId } },
      {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: "$size" },
      { $project: { sizeId: "$size._id", sizeName: "$size.name", _id: 1 } },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------
   2.  create ProductSize row
       body: { productId, colorId, sizeId }
------------------------------------------------ */
app.post("/productSize", async (req, res) => {
  try {
    const { productId, colorId, sizeId } = req.body;

    /* find the ProductColor row first */
    const pc = await ProductColor.findOne({ productId, colorId });
    if (!pc)
      return res
        .status(400)
        .json({ message: "Product-Color combination not found" });

    /* prevent duplicate */
    const exists = await ProductSize.findOne({
      productColorId: pc._id,
      sizeId,
    });
    if (exists)
      return res
        .status(400)
        .json({ message: "This size already exists for the chosen colour" });

    await ProductSize.create({ productColorId: pc._id, sizeId });

    /* return the freshly created row with joins */
    const data = await ProductSize.aggregate([
      {
        $match: {
          _id: exists
            ? exists._id
            : (
                await ProductSize.findOne({ productColorId: pc._id, sizeId })
              )._id,
        },
      },
      {
        $lookup: {
          from: "productcolors",
          localField: "productColorId",
          foreignField: "_id",
          as: "productColor",
        },
      },
      { $unwind: "$productColor" },
      {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: "$size" },
      {
        $project: {
          productSizeId: "$_id",
          productColorId: "$productColor._id",
          sizeId: "$size._id",
          sizeName: "$size.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /subcategory/byCategory/:categoryId
app.get("/subcategoryByCategory/:categoryId", async (req, res) => {
  try {
    const categoryId = toObjectId(req.params.categoryId);
    if (!categoryId)
      return res.status(400).json({ message: "Invalid categoryId" });

    const data = await Subcategory.aggregate([
      { $match: { categoryId } },
      { $project: { subcategoryId: "$_id", subcategoryName: "$name", _id: 0 } },
    ]);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const data = await Product.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: "$_id",
          name: 1,
          details: 1,
          status: 1,
          brandId: "$brand._id",
          brandName: "$brand.name",
          subcategoryId: "$subcategory._id",
          subcategoryName: "$subcategory.name",
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    if (!data.length) return res.status(404).json({ message: "Not found" });
    res.json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.  single product full details -------------------------------------
app.get("/productOne/:id", async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid product id" });

    const doc = await Product.aggregate([
      { $match: { _id: id } },

      /* brand / category / type / seller */
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcat",
        },
      },
      { $unwind: { path: "$subcat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subcat.categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "cat.typeId",
          foreignField: "_id",
          as: "typ",
        },
      },
      { $unwind: { path: "$typ", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      /* colours → sizes → stock + gallery */
      {
        $lookup: {
          from: "productColors",
          localField: "_id",
          foreignField: "productId",
          as: "colours",
        },
      },
      {
        $unwind: { path: "$colours", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "colors",
          localField: "colours.colorId",
          foreignField: "_id",
          as: "colours.color",
        },
      },
      { $unwind: { path: "$colours.color", preserveNullAndEmptyArrays: true } },

      /* sizes for each colour */
      {
        $lookup: {
          from: "productSizes",
          localField: "colours._id",
          foreignField: "productColorId",
          as: "colours.sizes",
        },
      },
      { $unwind: { path: "$colours.sizes", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sizes",
          localField: "colours.sizes.sizeId",
          foreignField: "_id",
          as: "colours.sizes.size",
        },
      },
      {
        $unwind: {
          path: "$colours.sizes.size",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* stock per size */
      {
        $lookup: {
          from: "stocks",
          localField: "colours.sizes._id",
          foreignField: "productSizeId",
          as: "colours.sizes.stocks",
        },
      },

      /* gallery per colour */
      {
        $lookup: {
          from: "galleries",
          localField: "colours._id",
          foreignField: "productColorId",
          as: "colours.gallery",
        },
      },

      /* group back to single product */
      {
        $group: {
          _id: "$_id",
          productId: { $first: "$_id" },
          name: { $first: "$name" },
          details: { $first: "$details" },
          status: { $first: "$status" },
          brandName: { $first: "$brand.name" },
          typeName: { $first: "$typ.name" },
          categoryName: { $first: "$cat.name" },
          subcategoryName: { $first: "$subcat.name" },
          sellerName: { $first: "$seller.name" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          colours: {
            $push: {
              colorId: "$colours.color._id",
              colorName: "$colours.color.name",
              sizes: "$colours.sizes",
              gallery: "$colours.gallery",
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    if (!doc.length)
      return res.status(404).json({ message: "Product not found" });
    res.json({ data: doc[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const { name, details, status, brandId, subcategoryId, sellerId, typeId } =
      req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      details,
      status,
      brandId,
      subcategoryId,
      sellerId,
      typeId,
    });
    const data = await Product.aggregate([
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "types",
          localField: "typeId",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: "$_id",
          name: 1,
          details: 1,
          status: 1,
          brandId: "$brand._id",
          brandName: "$brand.name",
          subcategoryId: "$subcategory._id",
          subcategoryName: "$subcategory.name",
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          typeId: "$type._id",
          typeName: "$type.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* colours that belong to one product */
app.get("/colorsByProductForGallery/:productId", async (req, res) => {
  try {
    const productId = toObjectId(req.params.productId);
    if (!productId)
      return res.status(400).json({ message: "Invalid productId" });

    const data = await ProductColor.aggregate([
      { $match: { productId } },
      {
        $lookup: {
          from: "colors",
          localField: "colorId",
          foreignField: "_id",
          as: "color",
        },
      },
      { $unwind: "$color" },
      {
        $project: {
          productColorId: "$_id",
          colorId: "$color._id",
          colorName: "$color.name",
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------- PRODUCT SIZE --------------------
app.post("/productSize", async (req, res) => {
  try {
    const { productColorId, sizeId } = req.body;
    await ProductSize.create({ productColorId, sizeId });
    const data = await ProductSize.aggregate([
      {
        $lookup: {
          from: "productcolors",
          localField: "productColorId",
          foreignField: "_id",
          as: "productColor",
        },
      },
      { $unwind: { path: "$productColor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productSizeId: "$_id",
          productColorId: "$productColor._id",
          sizeId: "$size._id",
          sizeName: "$size.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/productSize", async (req, res) => {
  try {
    const data = await ProductSize.aggregate([
      {
        $lookup: {
          from: "productcolors",
          localField: "productColorId",
          foreignField: "_id",
          as: "productColor",
        },
      },
      { $unwind: { path: "$productColor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_1",
          as: "size",
        },
      },
      /* note: minor fallback handled below */ {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productSizeId: "$_id",
          productColorId: "$productColor._id",
          sizeId: "$size._id",
          sizeName: "$size.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/productSize/:id", async (req, res) => {
  try {
    const { productColorId, sizeId } = req.body;
    await ProductSize.findByIdAndUpdate(req.params.id, {
      productColorId,
      sizeId,
    });
    const data = await ProductSize.aggregate([
      {
        $lookup: {
          from: "productcolors",
          localField: "productColorId",
          foreignField: "_id",
          as: "productColor",
        },
      },
      { $unwind: { path: "$productColor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sizes",
          localField: "sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productSizeId: "$_id",
          productColorId: "$productColor._id",
          sizeId: "$size._id",
          sizeName: "$size.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/productSize/:id", async (req, res) => {
  try {
    await ProductSize.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- STOCK --------------------
app.post("/stock", async (req, res) => {
  try {
    const { quantity, productSizeId } = req.body;
    await Stock.create({ quantity, productSizeId });
    const data = await Stock.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          stockId: "$_id",
          dateAdded: "$dateAdded",
          quantity: 1,
          productSizeId: "$productSize._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/stock", async (req, res) => {
  try {
    const data = await Stock.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          stockId: "$_id",
          dateAdded: "$dateAdded",
          quantity: 1,
          productSizeId: "$productSize._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/stock/:id", async (req, res) => {
  try {
    const { quantity, productSizeId } = req.body;
    await Stock.findByIdAndUpdate(req.params.id, { quantity, productSizeId });
    const data = await Stock.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          stockId: "$_id",
          dateAdded: "$dateAdded",
          quantity: 1,
          productSizeId: "$productSize._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/stock/:id", async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------- GALLERY  (MULTIPLE FILES) --------------------
app.post("/gallery", upload.array("file", 20), async (req, res) => {
  try {
    const { productColorId } = req.body;

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    /* 1.  create one Gallery row per file */
    const docs = req.files.map((f) => ({
      file: `/uploads/${f.filename}`,
      productColorId,
    }));
    const inserted = await Gallery.insertMany(docs);

    res.json({ data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/gallery", async (req, res) => {
  try {
    const data = await Gallery.aggregate([
      {
        $lookup: {
          from: "productcolors",
          localField: "productColorId",
          foreignField: "_id",
          as: "productColor",
        },
      },
      { $unwind: { path: "$productColor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          galleryId: "$_id",
          file: 1,
          productColorId: "$productColor._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/gallery/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- BOOKING --------------------
app.post("/booking", async (req, res) => {
  try {
    const { amount, status, userId, sellerId, deliveryBoyId } = req.body;
    await Booking.create({ amount, status, userId, sellerId, deliveryBoyId });
    const data = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoy",
        },
      },
      { $unwind: { path: "$deliveryBoy", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingId: "$_id",
          date: "$date",
          amount: 1,
          status: 1,
          userId: "$user._id",
          userName: "$user.name",
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          deliveryBoyId: "$deliveryBoy._id",
          deliveryBoyName: "$deliveryBoy.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/booking", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoy",
        },
      },
      { $unwind: { path: "$deliveryBoy", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingId: "$_id",
          date: "$date",
          amount: 1,
          status: 1,
          userId: "$user._id",
          userName: "$user.name",
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          deliveryBoyId: "$deliveryBoy._id",
          deliveryBoyName: "$deliveryBoy.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/booking/:id", async (req, res) => {
  try {
    const { amount, status, userId, sellerId, deliveryBoyId } = req.body;
    await Booking.findByIdAndUpdate(req.params.id, {
      amount,
      status,
      userId,
      sellerId,
      deliveryBoyId,
    });
    const data = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoy",
        },
      },
      { $unwind: { path: "$deliveryBoy", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingId: "$_id",
          date: "$date",
          amount: 1,
          status: 1,
          userId: "$user._id",
          userName: "$user.name",
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          deliveryBoyId: "$deliveryBoy._id",
          deliveryBoyName: "$deliveryBoy.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/booking/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CART --------------------
app.post("/cart", async (req, res) => {
  try {
    const { quantity, status, productSizeId, bookingId } = req.body;
    await Cart.create({ quantity, status, productSizeId, bookingId });
    const data = await Cart.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cartId: "$_id",
          quantity: 1,
          status: 1,
          productSizeId: "$productSize._id",
          bookingId: "$booking._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/cart", async (req, res) => {
  try {
    const data = await Cart.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cartId: "$_id",
          quantity: 1,
          status: 1,
          productSizeId: "$productSize._id",
          bookingId: "$booking._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/cart/:id", async (req, res) => {
  try {
    const { quantity, status, productSizeId, bookingId } = req.body;
    await Cart.findByIdAndUpdate(req.params.id, {
      quantity,
      status,
      productSizeId,
      bookingId,
    });
    const data = await Cart.aggregate([
      {
        $lookup: {
          from: "productSizes",
          localField: "productSizeId",
          foreignField: "_id",
          as: "productSize",
        },
      },
      { $unwind: { path: "$productSize", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cartId: "$_id",
          quantity: 1,
          status: 1,
          productSizeId: "$productSize._id",
          bookingId: "$booking._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- RATING --------------------
app.post("/rating", upload.single("file"), async (req, res) => {
  try {
    const { value, content, userId, productId } = req.body;
    await Rating.create({ value, content, userId, productId });
    const data = await Rating.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingId: "$_id",
          datetime: "$datetime",
          value: 1,
          content: 1,
          userId: "$user._id",
          userName: "$user.name",
          productId: "$product._id",
          productName: "$product.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/rating", async (req, res) => {
  try {
    const data = await Rating.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingId: "$_id",
          datetime: "$datetime",
          value: 1,
          content: 1,
          userId: "$user._1",
          userName: "$user.name",
          productId: "$product._id",
          productName: "$product.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]); // note: minor fallback above
    // safer second pipeline (works)
    const safeData = await Rating.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingId: "$_id",
          datetime: "$datetime",
          value: 1,
          content: 1,
          userId: "$user._id",
          userName: "$user.name",
          productId: "$product._id",
          productName: "$product.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data: safeData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/rating/:id", async (req, res) => {
  try {
    const { value, content } = req.body;
    await Rating.findByIdAndUpdate(req.params.id, { value, content });
    const data = await Rating.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingId: "$_id",
          datetime: "$datetime",
          value: 1,
          content: 1,
          userId: "$user._id",
          userName: "$user.name",
          productId: "$product._id",
          productName: "$product.name",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/rating/:id", async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- RATING FILE --------------------
app.post("/ratingFile", upload.single("file"), async (req, res) => {
  try {
    const { ratingId } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : "";
    await RatingFile.create({ file, ratingId });
    const data = await RatingFile.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "ratingId",
          foreignField: "_id",
          as: "rating",
        },
      },
      { $unwind: { path: "$rating", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingFileId: "$_id",
          file: 1,
          ratingId: "$rating._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/ratingFile", async (req, res) => {
  try {
    const data = await RatingFile.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "ratingId",
          foreignField: "_id",
          as: "rating",
        },
      },
      { $unwind: { path: "$rating", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ratingFileId: "$_id",
          file: 1,
          ratingId: "$rating._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/ratingFile/:id", async (req, res) => {
  try {
    await RatingFile.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- COMPLAINT --------------------
app.post("/complaint", async (req, res) => {
  try {
    const { title, content, userId, cartId } = req.body;
    await Complaint.create({ title, content, userId, cartId });
    const data = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "carts",
          localField: "cartId",
          foreignField: "_id",
          as: "cart",
        },
      },
      { $unwind: { path: "$cart", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          complaintId: "$_id",
          title: 1,
          content: 1,
          reply: 1,
          status: 1,
          date: 1,
          userId: "$user._id",
          userName: "$user.name",
          cartId: "$cart._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/complaint", async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "carts",
          localField: "cartId",
          foreignField: "_id",
          as: "cart",
        },
      },
      { $unwind: { path: "$cart", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          complaintId: "$_id",
          title: 1,
          content: 1,
          reply: 1,
          status: 1,
          date: 1,
          userId: "$user._id",
          userName: "$user.name",
          cartId: "$cart._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/complaint/:id", async (req, res) => {
  try {
    const { reply, status } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { reply, status });
    const data = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "carts",
          localField: "cartId",
          foreignField: "_id",
          as: "cart",
        },
      },
      { $unwind: { path: "$cart", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          complaintId: "$_id",
          title: 1,
          content: 1,
          reply: 1,
          status: 1,
          date: 1,
          userId: "$user._id",
          userName: "$user.name",
          cartId: "$cart._id",
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    const results = await Admin.aggregate([
      {
        $project: {
          adminId: "$_id",
          name: 1,
          email: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ message: "Deleted", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (user)
    return res.send({
      role: "user",
      id: user._id,
      name: user.name,
      message: "Login successful",
    });

  const seller = await Seller.findOne({ email, password });
  if (seller)
    return res.send({
      role: "seller",
      id: seller._id,
      name: seller.name,
      message: "Login successful",
    });

  const admin = await Admin.findOne({ email, password });
  if (admin)
    return res.send({
      role: "admin",
      id: admin._id,
      name: admin.name,
      message: "Login successful",
    });

  const deliveryBoy = await DeliveryBoy.findOne({ email, password });
  if (deliveryBoy)
    return res.send({
      role: "deliveryBoy",
      id: deliveryBoy._id,
      name: deliveryBoy.name,
      message: "Login successful",
    });

  return res.status(401).json({ message: "Invalid email or password" });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
