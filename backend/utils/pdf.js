const {jsPDF}=require('jspdf')


exports.pdf=(tasks)=>{
       let y = 20;

   const doc=new jsPDF()       

  tasks.forEach((task, index) => {
    doc.text(`Task ${index + 1}`, 10, y);
    y += 10;

    doc.text(`Name: ${task.taskname}`, 10, y);
    y += 10;

    doc.text(`Description: ${task.taskdescription}`, 10, y);
    y += 10;

    doc.text(`Due Date: ${task.taskduedate}`, 10, y);
    y += 10;

    doc.text(`Status: ${task.taskactivity}`, 10, y);
    y += 20;

    // Add a new page if the current page is full
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return pdfBuffer;
}