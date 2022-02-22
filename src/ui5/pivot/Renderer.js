sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    return Element.extend("ui5.pivot.Renderer", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                key: { type: "string", group: "data" },

                name: { type: "string", group: "data" },
            }
        }

    });

}, /* bExport= */ true);
