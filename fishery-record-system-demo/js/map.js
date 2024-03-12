 $(document).ready(function(){
    $("svg").children("path, text").click(function(){
        var table = $('#mytable').DataTable();
        if($(this).prop("tagName") == "text"){
            sessionStorage.setItem("pond_Num", $(this).attr("id").slice(0,2));
        }else{
            sessionStorage.setItem("pond_Num", $(this).attr("id"));
        }
        var pondNum = sessionStorage.getItem("pond_Num");
        table
            .columns( 0 )
            .search( '^' + pondNum + '$', true)
            .draw();
    });

});

function produceKindMap(namestring){
    const color_arr = ['#29B6F6', '#B0120A', '#AA00FF', '#E65100', '#F57F17', '#827717', '#1A237E', 
                        '#FFFF00', '#01579B', '#33691E', '#4A148C', '#4E342E', '#37474F', '#ffffff',
                        '#E040FB', '#004D40', '#42BD41', '#880E4F']

    let fishKind_idx = colName2Idx(namestring);
    let fish_kind_arr = PickLastestData(false, [fishKind_idx]);
    const ColorsMap = {};
    fish_kind_arr.forEach((kind, index) => {
        if (!ColorsMap[kind]) {
            ColorsMap[kind] = color_arr[Object.keys(ColorsMap).length % color_arr.length];
        }
    });

    return ColorsMap;
}

var pondNum_arr = ["#A1","#A2","#A3","#A4","#A5","#A6"]

// change pond css
function pond_css(namestring){
    let ColorsMap = produceKindMap(namestring);
    let idx = colName2Idx(namestring);
    fish_kind_arr = PickLastestData(false, [idx]);
    var cssfill = fish_kind_arr.map(function (fish_kind) {
        return ColorsMap[fish_kind[0]];
    });
    for (let i = 0; i < pondNum_arr.length; i++) {
        $(pondNum_arr[i]).css({'fill': cssfill[i], 'fill-opacity': 0.4});
    }
}

function pond_cssclear_fill(){
    for (let i = 0; i < pondNum_arr.length; i++) {
        $(pondNum_arr[i]).css({'fill':'none', 'fill-opacity': 'none'});
    }
}