const tasks = require("../model/taskmodel");
const user = require("../model/usermodel");
const nodemailer = require("nodemailer");
const { uploadimage } = require("../utils/file");

const html = (taskname, taskdescription) => `
<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ddd;border-radius:8px;max-width:500px;margin:auto;">
  <h2>📋 New Task Assigned</h2>
  <p><strong>Task:</strong> ${taskname}</p>
  <p><strong>Description:</strong> ${taskdescription}</p>
</div>
`;
const helper = require("../utils/helper");
exports.addtask = async (req, res) => {
  try {
    const { taskname, taskdescription, taskduedate, taskassignto } = req.body;

    if (!(taskname && taskdescription && taskduedate && taskassignto)) {
      return res.status(400).json({ message: "all keys are required" });
    }

    let url = null;
    if (req.files) {
      const uploaddata = await uploadimage(req.files);
      url = uploaddata[0].url;
    }

    const data = {
      taskname,
      taskduedate,
      taskdescription,
      taskassignby: req.user._id,
      taskassignto,
      images: url,
    };
    const result = await tasks.create(data);
    const mailto = await user.findById(taskassignto);
    if (
      helper.mailsender(
        mailto.email,
        "Task Created",
        html(taskname, taskdescription),
      )
    ) {
      return res.status(201).json({ message: "task added successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.gettask = async (req, res) => {
  try {
    const result = await tasks
      .find({ status: true })
      .populate("taskassignby")
      .populate("taskassignto");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.viewtask = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasks
      .findOne({ _id: id, status: true })
      .populate("taskassignby")
      .populate("taskassignto");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.getdeltask = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const allresult = await tasks
        .find({ status: false })
        .populate("taskassignby")
        .populate("taskassignto");
      return res.status(200).json(allresult);
    } else {
      const result = await tasks
        .find({ status: false })
        .populate("taskassignby")
        .populate("taskassignto");
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

const htmlupdate = (taskname, taskdescription) => `
<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ddd;border-radius:8px;max-width:500px;margin:auto;">
  <h2>📋 New Task Assigned</h2>
  <p><strong>Task:</strong> ${taskname}</p>
  <p><strong>Description:</strong> ${taskdescription}</p>
</div>
`;
exports.updatetask = async (req, res) => {
  try {
    const id = req.body._id;
    const data = req.body;

    const result = await tasks.findByIdAndUpdate(id, data);

    const mailto = await user.findById(data.taskassignto);
    if (
      helper.mailsender(
        mailto.email,
        "Task updated",
        htmlupdate(data.taskname, data.taskdescription),
      )
    ) {
      return res.status(200).json({ message: "task updated successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.tempdele = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasks.findByIdAndUpdate(id, { status: false });
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.taskactive = async (req, res) => {
  try {
    const { id, activity } = req.query;

    const result = await tasks.findByIdAndUpdate(id, {
      taskactivity: activity,
    });
    return res.status(200).json({ message: "activity changed" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.restoredele = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasks.findByIdAndUpdate(id, { status: true });
    return res.status(200).json({ message: "restored successfully" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "internal server erroe", err });
  }
};

exports.deletetask = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasks.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

const { pdf } = require("../utils/pdf");
exports.taskpdf = async (req, res) => {
  try {
    const { tasks } = req.body;

    const pdfBuffer = pdf(tasks);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="tasks.pdf"');

    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "internal server error" });
  }
};
