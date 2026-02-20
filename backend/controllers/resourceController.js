const Resource = require("../models/resource");

exports.uploadResource = async (req, res) => {
  const { title, subjectCode, semester, professor } = req.body;

  const status =
    req.user.role === "student" ? "Pending" : "Approved";

  const resource = await Resource.create({
    title,
    subjectCode,
    semester,
    professor,
    fileUrl: req.file.path,
    fileType: req.file.mimetype,
    uploadedBy: req.user.id,
    status
  });

  res.json(resource);
};

exports.getResources = async (req, res) => {
  const { subjectCode, semester, professor } = req.query;

  const filter = { status: "Approved" };
  if (subjectCode) filter.subjectCode = subjectCode;
  if (semester) filter.semester = semester;
  if (professor) filter.professor = professor;

  const resources = await Resource.find(filter).populate("uploadedBy");
  res.json(resources);
};

exports.reviewResource = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (action === "approve")
    await Resource.findByIdAndUpdate(id, { status: "Approved" });
  else
    await Resource.findByIdAndDelete(id);

  res.json({ msg: "Action completed" });
};

exports.getPending = async (req, res) => {
  const resources = await Resource.find({ status: "Pending" });
  res.json(resources);
};