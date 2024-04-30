console.log('text-to-chart');

Chart.register(ChartDataLabels);



var inputField = document.getElementById("keyword_data");

var sendButton = document.getElementById("send_data");
var input_text_value;

var chartType = 'line';
var unit = '';
var myChart;
var chartColor = '#912B2B';
var displayXaxes = true;
var ctx;

var chartlabels;
var chartdata;

var XfontSizeValue = 24;
var YfontSizeValue = 24;


sendButton.addEventListener("click", function () {
    console.log(inputField.value);
    input_text_value = inputField.value;

    if (myChart) {
        console.log('已存在')
        myChart.destroy();
    }

    get_data(input_text_value);
});

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var labels = [];
var data = [];

function apiLoading() {
    document.getElementById('chartDataLoading').style.display = 'block';
}


function apiHideLoading() {
    document.getElementById('chartDataLoading').style.display = 'none';

}


const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;

var labels = [];
var data = [];

function generateChart(dataArray) {
    // 创建一个空数组来存储 labels 和 data


    console.log(dataArray)
    // 遍历数据数组
    for (var i = 0; i < dataArray.length; i++) {
        var item = dataArray[i];
        // 遍历当前项的属性
        for (var key in item) {
            // 如果属性名不在 labels 数组中，并且属性值不是对象，则将属性名添加到 labels 数组中
            // console.log('key', key)
            // console.log('item', item)

            if (typeof item[key] === 'string') {
                labels.push(item[key]);
            }
            // 如果属性值是数值类型，则将其添加到 data 数组中
            if (typeof item[key] === 'number') {
                data.push(item[key]);
            }
        }
    }

    console.log(data);

    if (myChart) {
        console.log('已存在')
        myChart.destroy();
    }

    createChart(chartType, data, labels)

    // });

    // console.log(data);
    console.log(labels);

}
// 版型一
// // 创建 Chart.js 图表
function createChart(chartType, data, labels) {
    ctx = document.getElementById("textToChart");
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                strokeColor: "rgba(220,220,220,1)",
                StrokeWidth: 5,
                data: data,
                borderWidth: borderWidthValue,
                pointRadius: 5,
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                pointHoverRadius: 10,
                fill: false,
                backgroundColor: chartColor,
                borderColor: chartColor
            }]
        },
        options: {

            plugins: {

                datalabels: {
                    formatter: function (value, context) {
                        // 添加单位
                        return value + ' ' + unit;
                    },
                    textStrokeColor: '#fff',
                    textStrokeWidth: 5,
                    color: '#584B3D',
                    font: {
                        size: YfontSizeValue,

                    },
                    anchor: 'end',
                    align: 'end',

                },
                customLabels: null,
                legend: {
                    display: false,
                },

                // subtitle: {
                //     display: true,
                //     align: 'left',
                //     position: 'top',
                //     text: 'Custom Chart Subtitle'
                // },


            },

            scales: {
                x: {
                    display: displayXaxes, // 显示 x 轴
                    grid: {
                        display: false,
                        lineWidth: 5,
                        color: '#584B3D'

                    },
                    ticks: {
                        textStrokeColor: '#fff',
                        textStrokeWidth: 5,
                        font: {
                            display: false,
                            family: 'Arial', // 设置字体
                            size: XfontSizeValue, // 设置字体大小
                            weight: 'bold', // 设置字体粗细
                            fontColor: 'rgba(255,255,255,0.8)', // X-axis font color
                            shadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow color
                            shadowBlur: 10, // Shadow blur level
                            shadowOffsetX: 5, // Horizontal shadow offset
                            shadowOffsetY: 5

                        },

                    },

                },
                y: {
                    display: false,
                    beginAtZero: false,
                    grid: {
                        display: false,
                        lineWidth: 5
                    }
                }
            },
            layout: {
                padding: {
                    left: 30, // 调整图表左边距
                    right: 30, // 调整图表右边距
                    top: 40,
                    bottom: 10,

                }
            },





        },

    });
    // 注册 afterDraw 事件
    Chart.register({
        id: 'afterDraw',
        afterDraw: function (chart) {
            // console.log('處發', chart)
            // 在这里添加你的绘制代码
            var ctx = chart.ctx;
            var xAxis = chart.scales.x;
            var yAxis = chart.scales.y;
            var dataj = data;

            ctx.save();
            ctx.strokeStyle = '#000'; // 虚线颜色
            ctx.lineWidth = 1; // 虚线宽度
            ctx.setLineDash([5, 5]); // 设置虚线样式，[虚线段长度, 间隔长度]

            dataj.forEach(function (value, index) {
                var xPos = xAxis.getPixelForValue(labels[index]); // 获取 x 轴位置
                var yPos = yAxis.getPixelForValue(value); // 获取 y 轴位置

                // console.log(xPos)

                // 绘制虚线
                // ctx.beginPath();
                // ctx.moveTo(xPos, yPos);
                // ctx.lineTo(xPos, xAxis.bottom);
                // ctx.stroke();



                var xLineEnd = Math.min(yPos, yAxis.bottom);
                // console.log('第' + index + '條線', xPos, yPos, 'xLineEnd', xLineEnd, 'yAxis.getPixelForValue(value)', yAxis.getPixelForValue(value));




                // console.log('yAxis.getPixelForValue(value)', yAxis.getPixelForValue(value))
                // 绘制虚线
                ctx.beginPath();
                ctx.moveTo(xPos, yAxis.getPixelForValue(value));
                ctx.lineTo(xPos, xAxis.top);
                ctx.stroke();

                // 添加日期标签
                ctx.fillStyle = '#000'; // 文字颜色
                ctx.textAlign = 'center';
                // ctx.fillText(labels[index], xPos, yAxis.bottom + 20); // 将日期标签绘制在虚线下方

            });


            ctx.restore();
        }
    });

}



// createChart(chartType);

// createChart(chartType)

const ChartOptions = document.querySelectorAll('input[name="ChartOptions"]');

ChartOptions.forEach(button => {
    button.addEventListener('click', function () {
        // console.log(this.value);
        chartType = this.value;
        console.log(chartType);
        if (myChart !== null) {
            myChart.destroy();
        }
        if (chartType === 'pie') {
            console.log('圖內判斷');
            // ctx.parentNode.style.height = '400px';
            // ctx.parentNode.style.width = '400px';
            chartColor = [
                '#B43C39',
                '#3A73B7',
                '#987DB9',
                '#8FB347'
            ];
            displayXaxes = false;

        } else {
            chartColor = '#912B2B'
            // ctx.parentNode.style.height = '400px';
            // ctx.parentNode.style.width = '400px';
            displayXaxes = true;


        }


        console.log('input', data, labels)
        createChart(chartType, data, labels);
    });
});


// Sample data


// 單位標題
// =========================
var unitInput = document.getElementById('unit_data');

unitInput.addEventListener('input', function () {
    unit = unitInput.value;

    // 重新渲染图表
    myChart.update();
});

// ==========================

// y軸字體大小
// ==========================


var YfontSize = document.getElementById('YfontSize');
YfontSize.addEventListener('input', function () {

    YfontSizeValue = YfontSize.value;
    if (myChart) {
        myChart.destroy();
    }
    createChart(chartType, data, labels);
});



// ==========================


// x軸字體大小
// ==========================
var XfontSize = document.getElementById('XfontSize');

XfontSize.addEventListener('input', function () {

    XfontSizeValue = XfontSize.value;
    console.log(XfontSizeValue)
    if (myChart) {
        myChart.destroy();
    }
    createChart(chartType, data, labels);
});
// ==========================

// 線條粗細
// =========================
var rangeInput = document.getElementById('borderWidthRange');

var rangeInputSpan = document.getElementById('borderWidthRangeValue');

var borderWidthValue;

rangeInputSpan.textContent = rangeInput.value;


// 添加事件监听器，当滑动条的值发生改变时更新显示的值
rangeInput.addEventListener('input', function () {
    // 获取滑动条的当前值
    borderWidthValue = rangeInput.value;

    console.log(borderWidthValue);
    rangeInputSpan.textContent = borderWidthValue;

    if (myChart) {
        myChart.destroy();
    }

    createChart(chartType, data, labels);
    // myChart.data.datasets[0].borderWidth = borderWidthValue;
    // myChart.update();

});

// =========================

// 線條顏色
// =========================


const colorInput = document.getElementById('borderColorInput');


// 添加事件监听器，当颜色选择发生变化时触发
colorInput.addEventListener('input', function () {
    // 获取当前选择的颜色值
    chartColor = colorInput.value;

    if (myChart) {
        myChart.destroy();
    }

    console.log(chartColor);
    createChart(chartType, data, labels);
});

// =========================


// 模板樣式
// =========================
// JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // 獲取所有帶有 templateImg class 的圖像元素
    var templateImgs = document.querySelectorAll('.templateImg');

    // 為每個圖像元素添加點擊事件監聽器
    templateImgs.forEach(function (img) {
        img.addEventListener('click', function () {
            // 在點擊時印出圖像元素的 value 屬性值
            console.log(this.getAttribute('value'));
        });
    });
});
// =========================

const radioButtons = document.querySelectorAll('input[name="inlineRadioOptions"]');
var chartTitle = document.querySelector('.chart_title');

radioButtons.forEach(button => {
    button.addEventListener('click', function () {
        if (this.value === '0') {
            chartTitle.style.textAlign = 'left';
        } else if (this.value === '1') {
            chartTitle.style.textAlign = 'center';
        } else if (this.value === '2') {
            chartTitle.style.textAlign = 'right';
        }
    });
});

var keywordInput = document.getElementById('title_data');


// 初始时将输入框的值设置为标题的文本内容
keywordInput.value = chartTitle.textContent;

// 监听输入框的输入事件，实现内容同步更新
keywordInput.addEventListener('input', function () {
    chartTitle.textContent = this.value;
});




function get_data(input_text_value) {
    apiLoading();
    axios.get('http://cmm.ai:8080/answer?question=' + input_text_value)
        .then(response => {
            apiHideLoading();

            // 在這裡處理成功獲取 JSON 的情況
            console.log(response);

            var chart_info = response.data.chart_info.Title;

            chartType = response.data.chart_info.Chart_type;

            switch (chartType) {
                case "line":
                    document.getElementById("inlineRadio4").checked = true; // 折线图
                    break;
                case "bar":
                    document.getElementById("inlineRadio5").checked = true; // 柱状图
                    break;
                case "pie":
                    document.getElementById("inlineRadio6").checked = true; // 圆饼图
                    break;
                case "table":
                    document.getElementById("inlineRadio7").checked = true; // 表格
                    break;
                default:
                // 默认情况
            }

            keywordInput.value = chart_info;

            chartTitle.textContent = chart_info;

            let dataArray = response.data.data;

            generateChart(dataArray);






        })
        .catch(error => {
            apiHideLoading();

            // 在這裡處理請求失敗的情況
            console.error('發生錯誤:', error);
        });
}






$(document).ready(function () {
    $('#dataTable').DataTable();
});



