sap.ui.define([
    'jquery.sap.global',
    "sap/ui/core/Control",
    "sap/ui/core/Element",
    "./library"
], function(
    jQuery,
    Control,
    Element,
    library
) {
    "use strict";

    /**
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * CartesianChart constructor
     * @extends ui5.pivot.PivotTable
     * @alias ui5.pivot.PivotTable
     * @version ${version}
     *
     * @constructor
     * @public
     * @since 1.40
     * @name ui5.pivot.PivotTable
     */
    var PivotTable = Control.extend("ui5.pivot.PivotTable", /** @lends ui5.pivot.PivotTable.prototype */ {

        __pivot: null,

        metadata: {

            library: 'ui5.pivot',

            properties: {

                data: { type: "any", group: "data", defaultValue: [] },

                rows: { type: "string[]", group: "data", defaultValue: [] },

                cols: { type: "string[]", group: "data", defaultValue: [] },

                values: { type: "string[]", group: "data", defaultValue: [] },

                hiddenAttributes: { type: "string[]", group: "data", defaultValue: [] },

                hiddenFromAggregators: { type: "string[]", group: "data", defaultValue: [] },

                hiddenFromDragDrop: { type: "string[]", group: "data", defaultValue: [] },

                aggregatorName: { type: "string", group: "data", defaultValue: "Count" },

                rendererName: { type: "string", group: "data", defaultValue: "Table" },

                rendererOptions: { type: "any", group: "data" }
            },

            aggregations: {
                aggregators: {
                    type: "ui5.pivot.Aggregator",
                    multiple: true,
                    singularName: "aggregator"
                },

                renderers: {
                    type: "ui5.pivot.Renderer",
                    multiple: true,
                    singularName: "renderer"
                },

                multiFactors: {
                    type: "ui5.pivot.MultiFactor",
                    multiple: true,
                    singularName: "multiFactor"
                },

                multiFactorExps: {
                    type: "ui5.pivot.MultiFactorExp",
                    multiple: true,
                    singularName: "multiFactorExp"
                }
            },

            events: {

            }
        },

        constructor: function(sId, mSettings) {
            Element.apply(this, arguments);
        },

        onBeforeRendering: function() {},

        onAfterRendering: function() {},

        pivot: function() {
            return this.__pivot;
        },

        setData: function(data) {
            this.load(data);
            this.setProperty("data", data, true);
        },

        load: function(data) {
            // custom aggregator: multi factor
            var mfs = this.getMultiFactors();
            var mfAggMap = {};
            var mfDerivedAggregations = [];
            if (mfs.length > 0) {
                // standard
                for (var i = 0; i < mfs.length; i++) {
                    var mf = mfs[i];
                    mfAggMap["agg" + (i + 1)] = mf.create();
                }
                // expression
                var mfExps = this.getMultiFactorExps();
                for (var j = 0; j < mfExps.length; j++) {
                    mfDerivedAggregations.push(mfExps[j].create());
                }

                var customAggs = {};
                customAggs['Multiple Factors'] = jQuery.pivotUtilities.multifactAggregatorGenerator(mfAggMap, mfDerivedAggregations)
                jQuery.pivotUtilities.customAggs = customAggs;

            }

            // aggregators
            var dags = jQuery.pivotUtilities.aggregators;
            var ags = this.getAggregators();
            var aggregators = {};
            if (ags.length > 0) {
                ags.forEach(function(e) {
                    var key = e.getKey();
                    var ag = dags[key];
                    if (ag) {
                        aggregators[key] = ag;
                    }
                });
            } else {
                aggregators = dags;
            }

            // renderers
            var drs = jQuery.extend(
                jQuery.pivotUtilities.renderers,
                jQuery.pivotUtilities.plotly_renderers);
            var rs = this.getRenderers();
            var renderers = {};
            if (rs.length > 0) {
                rs.forEach(function(e) {
                    var key = e.getKey();
                    var r = drs[key];
                    if (r) {
                        renderers[key] = r;
                    }
                });
            } else {
                renderers = drs;
            }

            // renderer options
            var tableToExcel = this.tableToExcel();
            var rendererOptions = this.getRendererOptions() || {};
            rendererOptions = Object.assign({}, rendererOptions);
            // renderer option: table
            rendererOptions["table"] = {
                clickCallback: function(e, value, filters, pivotData) {
                    // wrong
                    var table = e.srcElement;
                    while (table.nodeName != 'TABLE') {
                        table = table.parentElement;
                    }
                    if (!table) {
                        return;
                    }

                    var innerHTML = table.innerHTML;
                    if (pivotData["aggregatorName"] == "Multiple Factors") {
                        // rowspan bug
                        var c = pivotData.colAttrs.length;
                        innerHTML = innerHTML.replace("rowspan=\"" + (c + 3) + "\"", "rowspan=\"" + (c + 1) + "\"")
                    }
                    tableToExcel("data", innerHTML);
                }
            };
            // renderer option: multi factor
            if (mfs.length > 0) {
                aggregators = jQuery.extend(aggregators, jQuery.pivotUtilities.customAggs);
                renderers = jQuery.extend(renderers, jQuery.pivotUtilities.gtRenderers);
                rendererOptions["aggregations"] = {
                    defaultAggregations: mfAggMap,
                    derivedAggregations: mfDerivedAggregations
                }
            }

            var div = jQuery("#" + this.getId());
            this.__pivot = div.pivotUI(data, {
                rows: this.getRows(),
                cols: this.getCols(),
                vals: this.getValues(),
                hiddenAttributes: this.getHiddenAttributes(),
                hiddenFromAggregators: this.getHiddenFromAggregators(),
                hiddenFromDragDrop: this.getHiddenFromDragDrop(),
                aggregators: aggregators,
                renderers: renderers,
                aggregatorName: this.getAggregatorName(),
                rendererName: this.getRendererName(),
                rendererOptions: rendererOptions
            });
        },

        tableToExcel: function() {
            var uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                base64 = function(s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s)))
                },
                format = function(s, c) {
                    return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })
                }

            return function(sheetName, innerHTML) {
                var ctx = {
                    worksheet: sheetName,
                    table: innerHTML
                };

                var link = document.createElement("a");
                link.href = uri + base64(format(template, ctx));
                link.download = "report.xls";
                link.click();
            }
        }
    });

    return PivotTable;

}, /* bExport= */ true);
