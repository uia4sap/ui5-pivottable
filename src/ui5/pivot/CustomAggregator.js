sap.ui.define([
    'jquery.sap.global',
    "./BaseAggregator"
], function(
    jQuery,
    BaseAggregator
) {
    "use strict";

    return BaseAggregator.extend("ui5.pivot.CustomAggregator", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                attribute: { type: "string", group: "data" },

                handler: { type: "function", group: "data" }
            }
        },
        
        build: function(aggregators) {
            var handler = this.getHandler();
            var attr = this.getAttribute();
            var ag = function() {
                return handler(attr);
            };
            aggregators[this.getName()] = ag;
        }

    });

}, /* bExport= */ true);
