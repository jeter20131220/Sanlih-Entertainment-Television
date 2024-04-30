console.log('text-to-chart');

Chart.register(ChartDataLabels);


// Chart.register({
//     id: 'customPlugin',
//     beforeDraw: function (chart) {
//         var tickElements = chart.ctx.canvas.parentNode.querySelectorAll('.custom-x-axis-label');
//         tickElements.forEach(function (tick) {
//             tick.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)'; // 添加阴影
//             tick.style.webkitTextStroke = '1px white'; // 添加白色边框
//             tick.style.textStroke = '1px white'; // 添加白色边框
//         });
//     }
// });

var inputField = document.getElementById("keyword_data");

var sendButton = document.getElementById("send_data");
var input_text_value;

sendButton.addEventListener("click", function () {
    console.log(inputField.value);
    input_text_value = inputField.value;
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


function generateChart(dataArray) {
    // 创建一个空数组来存储 labels 和 data
    var labels = [];
    var data = [];


    // 遍历数据数组
    for (var i = 0; i < dataArray.length; i++) {
        var item = dataArray[i];
        // 遍历当前项的属性
        for (var key in item) {
            // 如果属性名不在 labels 数组中，并且属性值不是对象，则将属性名添加到 labels 数组中
            console.log('key', key)
            console.log('item', item)

            if (typeof item[key] === 'string') {
                labels.push(item[key]);
            }
            // 如果属性值是数值类型，则将其添加到 data 数组中
            if (typeof item[key] === 'number') {
                data.push(item[key]);
            }
        }
    }

    // var ctx = document.getElementById("textToChart");
    // new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: labels,

    //         datasets: [{
    //             label: 'Line',
    //             data: data,
    //             borderWidth: 1,
    //             fill: false


    //         }]
    //     },
    //     options: {
    //         scales: {
    //             x: {
    //                 grid: {
    //                     display: true,
    //                     lineWidth: 2
    //                 }
    //             },
    //             y: {
    //                 beginAtZero: true
    //             }
    //         }
    //     }
    // });

    console.log(data);
    console.log(labels);



}


// 版型一
// // 创建 Chart.js 图表
var ctx = document.getElementById("textToChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['红色', '蓝色', '黄色', '绿色', '紫色', '橙色'],
        datasets: [{
            label: '投票数',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            fill: false,
            backgroundColor: '#912B2B',
            borderColor: '#912B2B'
        }]
    },
    options: {
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        },
        scales: {
            x: {
                display: true, // 显示 x 轴
                grid: {
                    display: false,
                    lineWidth: 5,
                    color: '#584B3D'

                },
                ticks: {
                    font: {
                        display: false,
                        family: 'Arial', // 设置字体
                        size: 24, // 设置字体大小
                        weight: 'bold', // 设置字体粗细
                        fontColor: 'rgba(255,255,255,0.8)', // X-axis font color
                        shadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow color
                        shadowBlur: 10, // Shadow blur level
                        shadowOffsetX: 5, // Horizontal shadow offset
                        shadowOffsetY: 5
                    }
                },
                callback: function (value, index, ticks) {
                    return '$' + value;
                }
            },
            y: {
                display: false,
                beginAtZero: true,
                grid: {
                    display: false,
                    lineWidth: 5
                }
            }
        },
        layout: {
            padding: {
                left: 10, // 调整图表左边距
                right: 10 // 调整图表右边距
            }
        }
    }
});





function get_data(input_text_value) {
    apiLoading();
    axios.get('http://cmm.ai:8080/answer123?question=' + input_text_value)
        .then(response => {
            apiHideLoading();

            // 在這裡處理成功獲取 JSON 的情況
            console.log(response);

            let dataArray = response.data;

            generateChart(dataArray);




            // console.log(jsonData);

            // // 將原始的 JSON 數據映射到 Chart.js 的 labels 和 data
            // var labels = jsonData.map(function (record) {
            //     if (record.Date) {
            //         return record.Date; // 使用日期作為標籤
            //     }
            // });

            // var data = jsonData.map(function (record) {
            //     return record.Close; // 使用關閉價格作為數據
            // });




            // console.log(labels);
            // console.log(data);

            // var ctx = document.getElementById("textToChart");


            // new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: labels,
            //         datasets: [{
            //             label: 'Line',
            //             data: data,
            //             borderWidth: 1
            //         }]
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

        })
        .catch(error => {
            apiHideLoading();

            // 在這裡處理請求失敗的情況
            console.error('發生錯誤:', error);
        });
}




// document.addEventListener('DOMContentLoaded', function () {
//     axios.get('js/data.json')
//         .then(response => {
//             // 在這裡處理成功獲取 JSON 的情況
//             console.log(response.data); // 這是你獲取到的 JSON 數據
//         })
//         .catch(error => {
//             // 在這裡處理請求失敗的情況
//             console.error('發生錯誤:', error);
//         });
// });



// Area Chart Example
// var ctx = document.getElementById("textToChart");
// var myLineChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//         datasets: [{
//             label: "Earnings",
//             lineTension: 0.3,
//             backgroundColor: "rgba(78, 115, 223, 0.05)",
//             borderColor: "rgba(78, 115, 223, 1)",
//             pointRadius: 3,
//             pointBackgroundColor: "rgba(78, 115, 223, 1)",
//             pointBorderColor: "rgba(78, 115, 223, 1)",
//             pointHoverRadius: 3,
//             pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
//             pointHoverBorderColor: "rgba(78, 115, 223, 1)",
//             pointHitRadius: 10,
//             pointBorderWidth: 2,
//             data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
//         }],
//     },
//     options: {
//         maintainAspectRatio: false,
//         layout: {
//             padding: {
//                 left: 10,
//                 right: 25,
//                 top: 25,
//                 bottom: 0
//             }
//         },
//         scales: {
//             xAxes: [{
//                 time: {
//                     unit: 'date'
//                 },
//                 gridLines: {
//                     display: false,
//                     drawBorder: false
//                 },
//                 ticks: {
//                     maxTicksLimit: 7
//                 }
//             }],
//             yAxes: [{
//                 ticks: {
//                     maxTicksLimit: 5,
//                     padding: 10,
//                     // Include a dollar sign in the ticks
//                     callback: function (value, index, values) {
//                         return '$' + number_format(value);
//                     }
//                 },
//                 gridLines: {
//                     color: "rgb(234, 236, 244)",
//                     zeroLineColor: "rgb(234, 236, 244)",
//                     drawBorder: false,
//                     borderDash: [2],
//                     zeroLineBorderDash: [2]
//                 }
//             }],
//         },
//         legend: {
//             display: false
//         },
//         tooltips: {
//             backgroundColor: "rgb(255,255,255)",
//             bodyFontColor: "#858796",
//             titleMarginBottom: 10,
//             titleFontColor: '#6e707e',
//             titleFontSize: 14,
//             borderColor: '#dddfeb',
//             borderWidth: 1,
//             xPadding: 15,
//             yPadding: 15,
//             displayColors: false,
//             intersect: false,
//             mode: 'index',
//             caretPadding: 10,
//             callbacks: {
//                 label: function (tooltipItem, chart) {
//                     var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
//                     return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
//                 }
//             }
//         }
//     }
// });

$(document).ready(function () {
    $('#dataTable').DataTable();
});



