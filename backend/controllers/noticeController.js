const Notice = require("../models/notice");

exports.createNotice = async (req, res) => {
  const notice = await Notice.create({
    title: req.body.title,
    content: req.body.content,
    postedBy: req.user.id
  });

  res.json(notice);
};

exports.getNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });

  const now = new Date();
  const updated = notices.map(n => {
    const diff = (now - n.createdAt) / (1000 * 60 * 60);
    return { ...n._doc, isNew: diff < 24 };
  });

  res.json(updated);
};