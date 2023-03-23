sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    return Element.extend("ui5.pivot.MultiFactorExp", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                name: { type: "string", group: "data" },

                description: { type: "string", group: "data" },

                expression: { type: "string", group: "data" },

                renderer: { type: "string", group: "data", defaultValue: "heatmap" }
            }
        },

        create: function() {
            return {
                name: this.getName(),
                description: this.getDescription(),
                expression: this.getExpression(),
                renderEnhancement: this.getRenderer()
            };
        },


    });

}, /* bExport= */ true);
