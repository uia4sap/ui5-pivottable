sap.ui.define([
    'jquery.sap.global',
    "./BaseAggregator"
], function(
    jQuery,
    BaseAggregator
) {
    "use strict";

    return BaseAggregator.extend("ui5.pivot.UniqueCountAggregator", {

        metadata: {

            library: "ui5.pivot",

        },
        
        build: function(aggregators) {
            aggregators[this.getName()] = jQuery.pivotUtilities.aggregators["Count"];
        }

    });

}, /* bExport= */ true);
