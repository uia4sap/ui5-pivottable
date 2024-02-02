sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    return Element.extend("ui5.pivot.BaseAggregator", {

        metadata: {

            "abstract": true,

            "library": "ui5.pivot",

            "properties": {

                name: { type: "string", group: "data" },
            }
        },

        build: function(aggregators) {
        }
    });

}, /* bExport= */ true);
