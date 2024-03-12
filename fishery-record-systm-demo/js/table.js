// table function
function toTable_small(){
    var data = getdata_sessionStorage('data')

    html = "<table id='mytable' class='hover row-border' style='width:100%'>";
    html += "<thead>";
    html += "<tr>";
    for (let i = 0; i < 4; i++){
        html += "<th>" + data[0][i] + "</th>";
    }
    html += "</tr></thead>";
    html += "<tbody>";
    for (let i =1; i< data.length; i++){
        html += "<tr>";
        for (let j =0; j < 4; j++){
            html += "<td>" + data[i][j] + "</td>";
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    
    $("#table_div").html(html);

    // DataTables initialisation
    var table = $('#mytable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/zh-HANT.json',
        },
        info: false,
        dom: 'frtip',
        columnDefs: [
            { type: 'natural', targets: 1 }
        ],
    });

    $('#mytable').on( 'column-visibility.dt', function ( e, settings, column, state ) {
        settings.aoColumns[column].bSearchable = state;
        table.rows().invalidate().draw();
    });

    // check if select pond
    var pondNum = sessionStorage.getItem("pond_Num");
    if (pondNum !== null) {
        table
            .columns( 1 )
            .search( '^' + pondNum + '$', true)
            .draw();
    }
    

};

function toTable_full(){
    var data = getdata_sessionStorage('data')

    var html = "<table id='mytable' class='hover row-border' style='width:100%'>";
    html += "<thead>";
    html += "<tr>";
    for (let i = 0; i < data[0].length; i++){
        html += "<th>" + data[0][i] + "</th>";
    };
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    for (let i =1; i< data.length; i++){
        html += "<tr>";
        for (let j =0; j < data[0].length; j++){
            html += "<td>" + data[i][j] + "</td>";
        };
        html += "</tr>";
    }
    html += "</tbody><tfoot><tr>";
    for (let i = 0; i < data[0].length; i++){
        html += "<th></th>";
    };
    html += "</tr></tfoot></table>";

    // add datatable to html
    $("#table_div").html(html);
    let pondNum_idx = colName2Idx('池號');
    let releasedNum_idx = colName2Idx('放養數量');
    let releasedUnit_idx = colName2Idx('放養數量單位');
    let harvest_idx = colName2Idx('收成量');
    let harvestunit_idx = colName2Idx('收成量單位');
    let harvestsize_idx = colName2Idx('收成規格');
    let harvesttime_idx = colName2Idx('收成時間');
    let area_idx = colName2Idx('養殖面積(分)')

    // DataTables initialisation
    var table = new $('#mytable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/zh-HANT.json',
        },
        paging: false,
        dom: 'Bfrt',
        scrollY: "60vh",
        scrollCollapse: true,
        orderCellsTop: true,
        columnDefs: [
            { type: 'natural', targets: pondNum_idx },
            { visible: false, targets: [harvest_idx, harvesttime_idx, harvestunit_idx, harvestsize_idx]},
        ],
        buttons: [
            {
                extend: 'colvis',
                text: "欄位選擇"
            },
            {
                extend: 'excelHtml5',
                filename: 'fishery_record' + getDateString(),
                title: null,
                exportOptions: {
                    columns: ':visible',
                },
                footer: true
            }
        ],
        footerCallback: function () {
            var api  = this.api();
            $(api.column(pondNum_idx).footer()).html("加總");
            // append 放養單位 select
            if($(api.column(releasedUnit_idx).footer()).children().length == 0){
                appendSelect2footer(api, releasedUnit_idx, releasedNum_idx);
            }
            // init數量加總
            var releaseunit_target = $(api.column(releasedUnit_idx).footer()).children('select').val();
            var releaseunit_filter = makefilter(api, releasedUnit_idx, releaseunit_target);
            makefooter(api, releasedNum_idx, releaseunit_filter);
            // append 收成量單位 select
            if($(api.column(harvestunit_idx).footer()).children().length == 0){
                appendSelect2footer(api, harvestunit_idx, harvest_idx);
            }
            // init 收成量加總
            var harvestunit_target = $(api.column(harvestunit_idx).footer()).children('select').val();
            var harvestunit_filter = makefilter(api, harvestunit_idx, harvestunit_target);
            makefooter(api, harvest_idx, harvestunit_filter);
            // 面積加總
            makefooter(api, area_idx);
        },
    });

    // visibility control
    $('#mytable').on( 'column-visibility.dt', function ( e, settings, column, state ) {
        settings.aoColumns[column].bSearchable = state;
        table.rows().invalidate().draw();
    });

    // check if select pond
    var pondNum = sessionStorage.getItem("pond_Num");
    if (pondNum !== null) {
        table
            .columns( 1 )
            .search( '^' + pondNum + '$', true)
            .draw();
    }

};


function clearTable(){
    $("#mytable").children("thead").remove();
    $("#mytable").children("tbody").remove();
}

function getselectedNUM(){
    let table = $("#mytable").DataTable();
    let data = table.row('.selected').data();

    return data[data.length - 1];
}

function getselecteddata(){
    let table = $("#mytable").DataTable();
    let data = table.row('.selected').data();

    return data;
}

// read data and fill in table
function fetchData(){
    $.getJSON("../json/data.json", function (data){
        if ( !getdata_sessionStorage('data')) {
            sessionStorage.setItem('data', JSON.stringify(data));
        }
        toTable_small();
        $("#updatetime").append("<span>"+ UpdateTime());
    })
}

function makefooter(api, colIdx, filter = null){
    $(api.column(colIdx).footer()).html(
        api.column(colIdx, { page: 'current' })
            .data()
            .filter(function(value, index){
                if (filter == null){
                    return true;
                }else{
                    return filter.includes(index) ? true : false;
                }
            })
            .reduce(function (a, b) {
                let total = intVal(a) + intVal(b);
                return numformat_t_f2(total);
            }, 0)
    );
}

function makefilter(api, colIdx, target){
    var filter = []
    api.column(colIdx, { page: 'current' })
        .data()
        .filter(function(value, index){
            if (value === target){
                filter.push(index);
            };
            return value === target ? true : false;
    })
    return filter
}


function appendSelect2footer(api, colIdx_Unit, colIdx_Num){
    if($(api.column(colIdx_Unit).footer()).children().length == 0){
        var header = $(api.column(colIdx_Unit).header()).text();
        $('<select title="' + header + '" />').appendTo(api.column(colIdx_Unit).footer())
            .on('change', function(){
                var search_idx = makefilter(api, colIdx_Unit, $(this).val());
                makefooter(api, colIdx_Num, search_idx);
            });
            api.column(colIdx_Unit, { page: 'current' })
                .data()
                .sort()
                .unique()
                .each(function(data){
                    $(api.column(colIdx_Unit).footer())
                        .children('select')
                        .append($('<option value="'+data+'">'+data+'</option>') )
                });
    }
}