/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library ui5.pivot.
 */
sap.ui.define([
    "jquery.sap.global",
    'sap/ui/core/library',
    "./3rdparty/jquery-ui/jquery-ui",
    "./3rdparty/exceljs/exceljs",
    "./3rdparty/plotly/plotly",
    "./3rdparty/pivottable/pivot"
], function(
    jQuery,
    library
) {
    "use strict";

    /**
     * The pivot library.
     *
     * @namespace
     * @name ui5.pivot
     * @public
     */

    // library dependencies

    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
        name: "ui5.pivot",
        dependencies: ["sap.ui.core"],
        types: [],
        interfaces: [],
        controls: [
            "ui5.pivot.PivotTable"
        ],
        elements: [
            "ui5.pivot.Aggregator",
            "ui5.pivot.Renderer",
            "ui5.pivot.MultiFactor",
            "ui5.pivot.MultiFactorExp"
        ],
        noLibraryCSS: false,
        version: "0.1.0"
    });

    jQuery.sap.includeScript("resources/ui5/pivot/3rdparty/pivottable/plotly_renderers.js");
    jQuery.sap.includeScript("resources/ui5/pivot/3rdparty/multifact-pivottable/multifact-pivottable.js");

    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/pivottable/pivot.css");
    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/jquery-ui/jquery-ui.css");
    jQuery.sap.includeStyleSheet("resources/ui5/pivot/3rdparty/jquery-ui/jquery-ui.theme.css");

    return ui5.pivot;

});
