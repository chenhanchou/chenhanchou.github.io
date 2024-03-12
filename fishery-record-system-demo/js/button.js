// click function
function insertelement(){
    $("#map_svg").clone().appendTo($("#preview_svg_frame"));
    if($("#ShowFishKind").prop("checked")){
        $("#fish_card").clone().appendTo($("#preview_card_frame"));
    }
    else if($("#ShowPerson").prop("checked")){
        $("#person_card").clone().appendTo($("#preview_card_frame"));
    };
    $('#save_preview_frame').on('hidden.bs.modal', event => {
        $("#preview_svg_frame").empty();
        $("#preview_card_frame").empty();
    });
}

function Refresh_Map_Table() {
    sessionStorage.removeItem("pond_Num");
    // refresh datatable
    if ($("#map_outer").hasClass("hide")) {
        toTable_full();
    } else {
        toTable_small();
    }
}

function ToggleMap() {
    $("#map_outer").toggle().toggleClass("hide");
    const isMapHidden = $("#map_outer").hasClass("hide");
    clearTable();
    isMapHidden ? $('#table_outer').removeClass('col-8').addClass('col-12') 
                : $('#table_outer').removeClass('col-12').addClass('col-8')
    isMapHidden ? toTable_full() : toTable_small();
}

function downloadJPG() {
    html2canvas($('#download_frame')[0]).then(function(canvas) {
        $('body').append(canvas);
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'image.jpg';
        a.click();
        $(canvas).remove();
    });
}