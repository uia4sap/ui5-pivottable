sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    var Aggregator = Element.extend("ui5.pivot.Aggregator", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                key: { type: "string", group: "data" },

                name: { type: "string", group: "data" },

                plugin: { type: "any", group: "data" }
            }
        }

    });


    return Aggregator;

}, /* bExport= */ true);
