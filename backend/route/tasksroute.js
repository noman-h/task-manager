const express = require("express");
const router = express.Router();

const taskscontroller = require("../controller/taskscontroller");
const auth = require("../middleware/auth");
const firebaseauth = require("../middleware/firebaseauth");

router.post("/addtask", auth, taskscontroller.addtask);
router.get("/gettask", auth, taskscontroller.gettask);
router.get("/getdeltask", auth, taskscontroller.getdeltask);
router.get("/viewtask/:id", auth, taskscontroller.viewtask);
router.patch("/updatetask", auth, taskscontroller.updatetask);
router.delete("/deletetask/:id", auth, taskscontroller.deletetask);
router.patch("/tempdele/:id", auth, taskscontroller.tempdele);
router.patch("/restoredele/:id", auth, taskscontroller.restoredele);
router.patch("/taskactive", auth, taskscontroller.taskactive);
router.post("/taskpdf", auth, taskscontroller.taskpdf);

module.exports = router;
