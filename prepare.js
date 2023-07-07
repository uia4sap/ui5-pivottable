var fs = require('fs-extra');

fs.copySync('./node_modules/ui5lab-browser/dist/', './test/ui5lab/browser');
fs.copySync('./node_modules/exceljs/dist/', './src/ui5/pivot/3rdparty/exceljs/');
fs.copySync('./node_modules/plotly.js/dist/plotly.js', './src/ui5/pivot/3rdparty/plotly/plotly.js');
fs.copySync('./node_modules/pivottable/dist/pivot.js', './src/ui5/pivot/3rdparty/pivottable/pivot.js');
fs.copySync('./node_modules/pivottable/dist/pivot.css', './src/ui5/pivot/3rdparty/pivottable/pivot.css');
fs.copySync('./node_modules/pivottable/dist/plotly_renderers.js', './src/ui5/pivot/3rdparty/pivottable/plotly_renderers.js');
fs.copySync('./node_modules/multifact-pivottable/multifact-pivottable.js', './src/ui5/pivot/3rdparty/multifact-pivottable/multifact-pivottable.js');
fs.copySync('./node_missing/subtotal/subtotal.js', './src/ui5/pivot/3rdparty/pivottable/subtotal.js');
fs.copySync('./node_missing/subtotal/subtotal.css', './src/ui5/pivot/3rdparty/pivottable/subtotal.css');

// read library namespace from package.json
var oPackage = require('./package.json');
var sNamespace = oPackage.ui5lab.namespace || "ui5lab.library";

// add library namespace to browser library list
var sBrowserLibraryFile = './test/ui5lab/browser/libraries.json';
fs.readFile(sBrowserLibraryFile, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    var result = data.replace(/\[((\r)?\n\t)*\]/m, '[\r\n\t\t"' + sNamespace + '"\r\n\t]');

    fs.writeFile(sBrowserLibraryFile, result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});
