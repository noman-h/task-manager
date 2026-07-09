const cron = require("node-cron");
const tasks = require("../model/taskmodel");
const moment = require("moment");

const { mailsender } = require("./helper");

module.exports = function cronschedule() {
  cron.schedule("0 0 * * *", async () => {
    const alltasks = await tasks.find();
    const filtered = alltasks.filter((i) => {
      if (
        i.taskactivity !== "completed" &&
        moment(i.taskduedate).isSame(moment(), "day")
      )
        return i;
    });
    if (filtered.length > 0) {
      const tasksrows = filtered
        .map(
          (task, i) =>
            `<tr>
        <td>${i + 1}</td>
        <td>${task.taskname}</td>
        <td>${task.taskactivity}</td>
        <td>${task.taskduedate}</td>
      </tr>
      `,
        )
        .join("");

      const html = `
<!DOCTYPE html>
<html>
<head>
<style>
table{
  border-collapse:collapse;
  width:100%;
}
th,td{
  border:1px solid #ddd;
  padding:10px;
}
th{
  background:#4CAF50;
  color:white;
}
</style>
</head>

<body>

<h2>Pending Tasks</h2>

<p>Here are your pending tasks for today.</p>

<table>
<thead>
<tr>
<th>#</th>
<th>Task</th>
<th>Priority</th>
<th>Due Date</th>
</tr>
</thead>

<tbody>
${tasksrows}
</tbody>

</table>

</body>
</html>
`;
      mailsender(
        "hasanmansuri963656@gmail.com",
        "pending tasks of the date",
        html,
      );
    }
  });
};
