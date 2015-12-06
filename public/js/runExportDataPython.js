//runs python file exportData.py
var pathToExportDataPy = "public/js/exportData.py";

function runExportDataPython() {
    var exec = require('child_process').exec,
    child;

    child = exec('python '+pathToExportDataPy,
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
}
exports.run = runExportDataPython;