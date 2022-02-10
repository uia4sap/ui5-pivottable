/*!
 * ${copyright}
 */

sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/library',
    "./3rdparty/jquery-ui/jquery-ui",
    "./3rdparty/pivottable/pivot",
    "./3rdparty/polyfill/polyfill",
    "./3rdparty/exceljs/exceljs"
], function(
    jQuery,
    library,
    jQueryUI,
    Pivot,
    Polyfill,
    ExcelJS

) {
    "use strict";

    // library dependencies

    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
        name: "ui5.pivot",
        dependencies: ["sap.ui.core"],
        types: [
            "ui5.pivot.AggregatorType",
            "ui5.pivot.RendererType"
        ],
        interfaces: [],
        controls: [
            "ui5.pivot.PivotTable"
        ],
        elements: [
            "ui5.pivot.Aggregator"
        ],
        noLibraryCSS: false,
        version: "${version}"
    });

    ui5.pivot.AggregatorType = {
        Count: "Count",
        CountUniqueValues: "Count Unique Values",
        ListUniqueValues: "List Unique Values",
        Sum: "Sum",
        IntegerSum: "Integer Sum",
        Average: "Average",
        Median: "Median",
        SumVariance: "Sample Variance",
        SumSD: "Sample Standard Deviation",
        Min: "Minimum",
        Max: "Maximum",
        First: "First",
        Last: "Last",
        SumOverSum: "Sum over Sum",
        P80UpperBound: "80% Upper Bound",
        P80LowerBound: "80% Lower Bound",
        SumAsFractionOfTotal: "Sum as Fraction of Total",
        SumAsFractionOfRows: "Sum as Fraction of Rows",
        SumAsFractionOfColumns: "Sum as Fraction of Columns",
        CountAsFractionOfTotal: "Count as Fraction of Total",
        CountAsFractionOfRows: "Count as Fraction of Rows",
        CountAsFractionOfColumns: "Count as Fraction of Columns"
    };

    ui5.pivot.RendererType = {
        Table: "Count",
        TableBarchart: "Table Barchart",
        Heatmap: "Heatmap",
        RowHeatmap: "Heatmap",
        ColHeatmap: "Col Heatmap"
    };

    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/jquery-ui/jquery-ui.css");
    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/jquery-ui/jquery-ui.theme.css");
    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/pivottable/pivot.css");

    return ui5.pivot;

});
