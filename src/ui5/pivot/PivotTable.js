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

                rows: { type: "string[]", group: "data", defaultValue: [] },

                cols: { type: "string[]", group: "data", defaultValue: [] },

                values: { type: "string[]", group: "data", defaultValue: [] },

                hiddenAttributes: { type: "string[]", group: "data", defaultValue: [] },

                hiddenFromAggregators: { type: "string[]", group: "data", defaultValue: [] },
                
                hiddenFromDragDrop: { type: "string[]", group: "data", defaultValue: [] },

                aggregatorName: { type: "string", group: "data", defaultValue: "Count" },

                rendererName: { type: "string", group: "data", defaultValue: "Table" },

                rendererOptions: { type: "any", group: "data", defaultValue: "Table" }
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
            },

            events: {
                
            }
        },

        constructor: function(sId, mSettings) {
            Element.apply(this, arguments);
        },

        onBeforeRendering: function() {},

        onAfterRendering: function() {
        },

        pivot: function() {
            return this.__pivot;
        },

        load: function(data) {
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

            // var drs = jQuery.pivotUtilities.renderers;
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

            var div = jQuery("#" + this.getId());
            var toExcel = this.toExcel;
            var rendererOptions = this.getRendererOptions() || {};
            rendererOptions = Object.assign({}, rendererOptions);
            rendererOptions["table"] = {
                clickCallback: function(e, value, filters, pivotData) {
                    toExcel(pivotData);
                }
            };
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

        toExcel: function(pivotData, opts) {
            var result = [];

            var rowAttrs = pivotData.rowAttrs;
            var colAttrs = pivotData.colAttrs;
            var rowKeys = pivotData.getRowKeys();
            var colKeys = pivotData.getColKeys();

            for (var x = 0; x < colAttrs.length; x++) {
                var head = [].concat(rowAttrs);
                head.push(colAttrs[x]);
                for (var y = 0; y < colKeys.length; y++) {
                    head.push(colKeys[y][x]);
                } 
                result.push(head);
            }

            for (var r = 0; r < rowKeys.length; r++) {
                var rowKey = rowKeys[r]; 

                var row =[].concat(rowKey);
                row.push('');
                for (var c = 0; c < colKeys.length; c++) {
                    var colKey = colKeys[c];
                    var agg = pivotData.getAggregator(rowKey, colKey);
                    var v = agg.value(); 
                    if (v != null) {
                        var fv = agg.format(v)
                        row.push(fv);
                    } else {
                        row.push("");
                    }
                }
                result.push(row);
            }

            // sheet
            var workbook = new ExcelJS.Workbook();
            var sheet = workbook.addWorksheet("result");
            for(var x = 0; x<result.length; x++) {
                sheet.addRow(result[x]); 
                sheet.getRow(x + 1).alignment = { 
                    vertical: 'middle', 
                    horizontal: 'left' 
                };
                sheet.getRow(x + 1).border = {
                    top: { style: 'thin' },
                    left: { style:'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin'}
                };            
            }
            sheet.mergeCells('A1:A' + colAttrs.length);
            for(var x = 0; x < colAttrs.length; x++) {
                sheet.getRow(x + 1).font = { bold: true };
                sheet.getRow(x + 1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'eeeeee' },
                  };
            }
            for(var x = 0; x < rowAttrs.length; x++) {
                sheet.getColumn(x + 1).font = { bold: true };
                sheet.getColumn(x + 1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'eeeeee' },
                  };
            }
            var build = async () => {
                var buf = await workbook.xlsx.writeBuffer();
                var blob = new Blob([buf], { type: "application/octet-stream" });
                return URL.createObjectURL(blob);
            };
            build().then(hrefObj => {
                var link = document.createElement("a");
                link.href = hrefObj;
                link.download = "report.xlsx";
                link.click();
            });

            return result;
        }
    });

    return PivotTable;

}, /* bExport= */ true);
