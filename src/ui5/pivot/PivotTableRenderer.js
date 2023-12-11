sap.ui.define([
    'jquery.sap.global'
], function(
    jQuery
) {

    "use strict";

    var PivotTableRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oPivotTable An object representation of the control that should be rendered.
     */
    PivotTableRenderer.render = function(oRm, oPivotTable) {
        oRm.write("<div ");
        oRm.writeControlData(oPivotTable);
        oRm.write(">");
        oRm.write("</div>");
    };

    return PivotTableRenderer;

}, /* bExport= */ true);
