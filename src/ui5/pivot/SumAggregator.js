sap.ui.define([
    'jquery.sap.global',
    "./BaseAggregator"
], function(
    jQuery,
    BaseAggregator
) {
    "use strict";

    return BaseAggregator.extend("ui5.pivot.SumAggregator", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                attribute: { type: "string", group: "data" }
            }
        },
        
        build: function(aggregators) {
            var ag = jQuery.pivotUtilities.aggregatorTemplates.sum()([this.getAttribute()]);
            aggregators[this.getName()] = function() { return ag };
        }

    });

}, /* bExport= */ true);
