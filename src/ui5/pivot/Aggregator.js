sap.ui.define([
    'jquery.sap.global',
    "./BaseAggregator"
], function(
    jQuery,
    BaseAggregator
) {
    "use strict";

    return BaseAggregator.extend("ui5.pivot.Aggregator", {

        metadata: {

            library: "ui5.pivot",

            properties: {

                key: { type: "string", group: "data" },

                plugin: { type: "function", group: "data", defaultValue: undefined }
            }
        },

        build: function(aggregators) {
            var key = this.getKey();
            var name = this.getName() || key;
            var plugin = this.getPlugin();
            var ag = jQuery.pivotUtilities.aggregators[key];
            if (ag) {
                aggregators[name] = ag;
            } else if (plugin) {
                aggregators[name] = plugin;
            }
        }
    });

}, /* bExport= */ true);
