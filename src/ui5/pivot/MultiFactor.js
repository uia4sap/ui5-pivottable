sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    return Element.extend("ui5.pivot.MultiFactor", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                aggType: { type: "string", group: "data", defaultValue: "top" },

                name: { type: "string", group: "data" },

                propName: { type: "string", group: "data" },

                varName: { type: "string", group: "data" },

                renderer: { type: "string", group: "data", defaultValue: "heatmap" },

                hidden: { type: "boolean", group: "data", defaultValue: false }
            }
        },

        create: function() {
            return {
                aggType: this.getAggType(),
                arguments: [this.getPropName()],
                name: this.getName(),
                varName: this.getVarName() || this.getPropName(),
                renderEnhancement: this.getRenderer(),
                hidden: this.getHidden()
            };
        },


    });

}, /* bExport= */ true);
