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

        onAfterRendering: function() {},

        pivot: function() {
            return this.__pivot;
        },

        setData: function(data) {
            this.load(data);
            this.setProperty("data", data, true);
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

        toExcel: function(pivotData) {
            var result = [];

            var rowAttrs = pivotData.rowAttrs;
            var colAttrs = pivotData.colAttrs;
            var rowTotals = pivotData.rowTotals;
            var colTotals = pivotData.colTotals;
            var rowKeys = pivotData.getRowKeys();
            var colKeys = pivotData.getColKeys();

            if (colAttrs.length == 0) {
                var head = [].concat(rowAttrs);
                head.push('');
                head.push("Totals");
                result.push(head);
            } else {
                for (var x = 0; x < colAttrs.length; x++) {
                    var head = [].concat(rowAttrs);
                    head.push(colAttrs[x]);
                    for (var y = 0; y < colKeys.length; y++) {
                        head.push(colKeys[y][x]);
                    }
                    head.push("Totals");
                    result.push(head);
                }
            }

            for (var r = 0; r < rowKeys.length; r++) {
                var rowKey = rowKeys[r]; // array
                var row = [].concat(rowKey);
                row.push('');
                for (var c = 0; c < colKeys.length; c++) {
                    var colKey = colKeys[c]; // array
                    var agg = pivotData.getAggregator(rowKey, colKey);
                    var v = agg.value();
                    if (v != null) {
                        var fv = agg.format(v)
                        row.push(parseFloat(fv));
                    } else {
                        row.push("");
                    }
                }

                // row total
                var key = rowKey[0];
                for (var k = 1; k < rowKey.length; k++) {
                    key += "\u0000" + rowKey[k];
                }
                var rt = rowTotals[key];
                var rtv = rt.format(rt.value());
                row.push(isNaN(rtv) ? rtv : parseFloat(rtv));
                result.push(row);
            }

            // col total
            var foot = ["Totals"];
            for (var r = 0; r < rowAttrs.length; r++) {
                foot.push('');
            }
            for (var c = 0; c < colKeys.length; c++) {
                var colKey = colKeys[c]; // array
                var key = colKey[0];
                for (var k = 1; k < colKey.length; k++) {
                    key += "\u0000" + colKey[k];
                }
                var ct = colTotals[key];
                var ctv = ct.format(ct.value());
                foot.push(isNaN(ctv) ? ctv : parseFloat(ctv));
            }
            var at = pivotData.allTotal;
            var atv = at.format(at.value());
            foot.push(isNaN(atv) ? atv : parseFloat(atv));
            result.push(foot);

            // sheet
            var workbook = new ExcelJS.Workbook();
            var sheet = workbook.addWorksheet("result");

            // data
            for (var x = 0; x < result.length; x++) {
                sheet.addRow(result[x]);
                sheet.getRow(x + 1).alignment = {
                    vertical: 'middle',
                    horizontal: 'right'
                };
            }

            // width
            for (var c = 0; c < result[0].length; c++) {
                sheet.columns[c].width = Math.max(6, ("" + result[0][c]).length + 2)
            }

            // style
            for (var r = 0; r < rowAttrs.length; r++) {
                sheet.mergeCells(1, r + 1, colAttrs.length, r + 1);
            }
            sheet.mergeCells(1, result[0].length, colAttrs.length, result[0].length);
            sheet.mergeCells(result.length, 1, result.length, rowAttrs.length);

            for (var c = 0; c < result[0].length; c++) {
                for (var r = 0; r < result.length; r++) {
                    var cell = sheet.getCell(r + 1, c + 1);
                    cell.font = { name: 'Arial' };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'bbbbbb' } },
                        left: { style: 'thin', color: { argb: 'bbbbbb' } },
                        bottom: { style: 'thin', color: { argb: 'bbbbbb' } },
                        right: { style: 'thin', color: { argb: 'bbbbbb' } }
                    };

                    var data = c > rowAttrs.length && r >= Math.max(1, colAttrs.length);
                    if (!data) {
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'center'
                        };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'eeeeee' },
                        };
                    } else {
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'right'
                        };
                    }
                }
            }

            if (colAttrs.length == 0) {
                sheet.spliceColumns(rowAttrs.length + 1, 1);
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
