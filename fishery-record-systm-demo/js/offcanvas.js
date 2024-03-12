// switch function in offcanvas
$(document).ready(function(){
    $('#ShowPondNum').click(function() {
        if($(this).prop("checked")){
            $('#map_svg').find('text').removeClass("NoShow");
        }else{
            $('#map_svg').find('text').addClass("NoShow");
        }
    });
    
    $('#ShowPerson').click(function() {
        if($(this).prop("checked")){
            let namestring = '養殖戶'
            pond_css(namestring);
            if ($('#person-card').children().length == 0){
                htmlString = cardHTMLString(namestring)
                console.log(htmlString);
                $('#person-card').append(htmlString);
            }
            $('#person_card').removeClass("visually-hidden");
            // close ShowFishKind
            $("#ShowFishKind").prop("checked", false);
            $('#fish_card').addClass("visually-hidden");
        }else{
            pond_cssclear_fill();
            $('#person_card').addClass("visually-hidden");
        }    
    });

    $("#ShowFishKind").click(function(){
        if($(this).prop("checked")){
            let namestring = '養殖物種'
            pond_css(namestring);
            if ($('#fish-card').children().length == 0){
                htmlString = cardHTMLString(namestring)
                console.log(htmlString);
                $('#fish-card').append(htmlString);
            }
            $('#fish_card').removeClass("visually-hidden");
            // close ShowPerson
            $("#ShowPerson").prop("checked", false);
            $('#person_card').addClass("visually-hidden");
        }else{
            pond_cssclear_fill();
            $('#fish_card').addClass("visually-hidden");
        }
    });
});


function cardHTMLString(namestring) {
    let ColorsMap = produceKindMap(namestring);
    let kind_arr_key = Object.keys(ColorsMap);
    let htmlString = '';
    kind_arr_key.forEach((key, index) => {
        if(index%2 == 0){
            htmlString += '<div class="row justify-content-start">'
        }
        htmlString +=   '<div class="legend_frame col">' +
                            '<span>' +
                            '<svg class="p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="'+
                                ColorsMap[key] +
                                '" fill-opacity="0.4">' +
                                '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" ' +
                                'stroke="#000" stroke-width="1"/>' +
                            '</svg>' +
                            key +
                            '</span>' +
                        '</div>'
        if(index%2 != 0){
            htmlString += '</div>'
        }
    });

    return htmlString;
}



