var lineDefs = [
//    {
//        pattern: /ENH .*/i,
//        lines: [
//            { start: 0, end: 3, description: "Identifiserer start enhet  record" },
//            { start: 4, end: 12, description: "Organisasjonsnummer" },
//            { start: 13, end: 16, description: "Enhetstype" },
//            { start: 17, end: 17, description: "Hovedsakstype" },
//            { start: 18, end: 21, description: "Undersakstype" },
//            { start: 22, end: 29, description: "Dato hvor enheten ble innført som ny i ER" },
//            { start: 30, end: 37, description: "Dato for siste endring på enheten" },
//            { start: 38, end: 38, description: "Første overføring" },
//            { start: 39, end: 47, description: "Korrekt orgnr" },
//            { start: 48, end: 48, description: "Type overføring" }
//        ]
//    },
//    {
//        pattern: /TRAI.*/i,
//        lines: [
//            { start: 0, end: 3, description: "Felttype: Trailer record" },
//            { start: 4, end: 6, description: "Avsender: ER er avsender" },
//            { start: 7, end: 13, description: "Antall enheter overført" },
//            { start: 14, end: 22, description: "Antall records overført" }
//        ]
//    },
    {
        pattern: /HEAD.*/i,
        lines: [
//            { start: 0, end: 3, description: "Felttype: Header record" },
            { start: 4, end: 6, description: "Avsender: ER er avsender" },
            { start: 7, end: 14, description: "ÅÅÅÅMMDD		Dato for generering av filen." },
//            { start: 15, end: 19, description: "Kjørenr.\nLedende 0. Hver overføring nummereres fortløpende.\nDet skal ikke være hull i nummerserien." },
            { start: 20, end: 22, description: "Tilsvarende avsender i batch in." },
            { start: 23, end: 23, description: "A = Ordinær ajourholdsdata utveksling.\nS =  Data bestilt via \"SKD knappen\"\nK = Knytningsfil med begrensede enhetsdata" }
        ]
    }
//    {
//        pattern: /USYS.*/i,
//        lines: [
//            { start: 0, end: 3, description: "Status: Ubemannet virksomhet" },
//            { start: 4, end: 4, description: "Opplysningen er: Ny eller endret / Utgått / Kopi av tidligere sendt oppl." },
//            { start: 5, end: 7, description: "Kode for avsender som sist endret oppl." }
//        ]
//    },
//    {
//        pattern: /LEDE.*/i,
//        lines: [
//            { start: 0, end: 3, description: "Felttype" },
//            { start: 4, end: 4, description: "N/U/K	Opplysningen er: Ny eller endret / Utgått / Kopi av tidligere sendt oppl." },
//            { start: 5, end: 7, description: "Endret av" },
//            { start: 8, end: 8, description: "Indikerer rolle" },
//            { start: 9, end: 9, description: "Indikerer at dette er data for rollen (I motsetning til fritekst)" },
//            { start: 10, end: 39, description: "Ansvarsandel" },
//            { start: 40, end: 40, description: "F/N/K/R \nF = Egenfratreden\nN = Ikke fratrådt\nK = Fratrådt pga konkurskarantene\nR = Fratrådt pga rettighetstap" },
//            { start: 41, end: 44, description: "Valgtav" },
//            { start: 45, end: 47, description: "Presentasjonsrekkefølge av styremedlemmer osv." },
//            { start: 48, end: 58, description: "Fødselsnr eller Dnr." },
//            { start: 59, end: 108, description: "Fornavn" },
//            { start: 109, end: 158, description: "mellomnavn" },
//            { start: 159, end: 208, description: "slektsnavn" },
//            { start: 209, end: 217, description: "Postnr" },
//            { start: 218, end: 252, description: "Adresse1" },
//            { start: 253, end: 287, description: "Adresse2" },
//            { start: 288, end: 322, description: "Adresse3" },
//            { start: 323, end: 325, description: "Adresselandkode" },
//            { start: 326, end: 326, description: "Personstatus" }
//        ]
//    }
];



function parseDocument(raw) {
    var lines = raw.split("\n");
    var parsed = $("<div class='parsedDocument'></div>");

    $(lines).each(function(lineNum, line){
        parsed.append(renderLine(line,linedata(line)));
    });
    return parsed;
}

function renderLine(raw, lineData) {
    var htmlLine = $("<span class='line'></span>");

    if(!$.isEmptyObject(lineData)){
        $.each(lineData, function(description, value){
            var token = $("<span class='token'>" + value.text + "</span>");
            if(value.description == undefined) {
                token.addClass("unknownFormat");
            }
            htmlLine.append(token);
        });
        htmlLine.on("mouseover",function(){displayLineInfo(lineData)});
        htmlLine.on("mouseout",function(){hideLineInfo()});
    }else{
        htmlLine.append($("<span class='token unknownFormat'>"+raw+"</span>"));
    }
    return htmlLine;
}

function addUndefinedRanges(lineDefinition,rawLine) {
    var allRanges = [];

    var lastIndex = rawLine.length -1;
    if(lineDefinition){
        var startIndexes = lineDefinition.map(function(elm){return elm.start});
        var endIndexes = lineDefinition.map(function(elm){return elm.end});
        var curIdx = 0;
        var intervalIdx = 0;

        while(curIdx < lastIndex) {
            if(startIndexes[intervalIdx] > curIdx) {
                allRanges = allRanges.concat({start: curIdx, end: startIndexes[intervalIdx]-1})
            }
            allRanges = allRanges.concat(lineDefinition[intervalIdx]);
            curIdx = endIndexes[intervalIdx] + 1;
            intervalIdx++;
        }
    }
    return allRanges;
}
function linedata(rawLine) {
    var lineDefinition = getLineDefinitionFor(rawLine, lineDefs);
    lineDefinition = addUndefinedRanges(lineDefinition, rawLine);
    if(lineDefinition){
        var data = [];
        $(lineDefinition).each(function(lineNo, lineDef){
            var tokenText = rawLine.substr(lineDef.start, lineDef.end - lineDef.start + 1);
            if(tokenText != undefined) {
                data = data.concat({description: lineDef.description, text: tokenText.trim()});
            }else{
                data = data.concat(undefined);
            }
        });
        return data;
    }

    return {};
}
//
//function parseLine(rawLine) {
//    var parsedLine = $("<span class='line'></span>");
//    var lineDefinition = getLineDefinitionFor(rawLine, lineDefs);
//    if(lineDefinition){
//        var tokenized = tokenize(rawLine, lineDefinition);
//        $(tokenized).each(function(idx, token){
//            parsedLine.append(token);
//        });
//    }else{
//        parsedLine.html(rawLine);
//        parsedLine.addClass("unparsed");
//    }
//    return  parsedLine
//}

function hideLineInfo() {
    $("#lineinfo").hide();
}

function displayLineInfo(data) {
    var infoElement = $("#lineinfo");
    infoElement.html("");
    var valuelist = $("<dl></dl>");
    $.each(data,function(key,value){
        var valuePair = $("<div class='valuePair'></div>");
        if(value) {
            valuePair.append($("<dt>"+key+"</dt>"));
            valuePair.append($("<dd>"+value+"</dd>"));
            infoElement.append(valuePair);
        }
    });
    infoElement.append(valuelist);
    infoElement.show();
}

function getLineDefinitionFor(line, lineDefs) {
    var lineDef=null;
    $(lineDefs).each( function(idx, def){
        if(def.pattern.test(line)) {
            lineDef = def.lines;
        }
    });
    return lineDef;
}

function tokenize(line, lineDefs) {
    var tokens = [];

    $(lineDefs).each(function(lineNo, lineDef){
        var tokenText = line.substr(lineDef.start, lineDef.end - lineDef.start + 1);
        tokens = tokens.concat($("<span class='token' title='"+lineDef.description+"'>"+tokenText+"</span>"));
    });

    return tokens;
}

function loadData(file) {
    var dataHolder = $("#data");
    dataHolder.addClass("spinner");

    var file = file[0], reader = new FileReader();
    reader.onload = function(event) {
        var parsedDocument = parseDocument(event.target.result);
        dataHolder.removeClass("spinner");
        dataHolder.html(parsedDocument);
        dataHolder.removeClass("unloaded");
    };
    reader.readAsText(file);

    return false;
}
function makeFileDropTarget(elm, onDropFunction) {
    elm.on('dragover', function(e) {
        elm.addClass("dragAllowed");
        e.preventDefault();
        e.stopPropagation();
    });
    elm.on('dragenter', function(e) {
        elm.addClass("dragAllowed");
        e.preventDefault();
        e.stopPropagation();
    });

    elm.on('dragleave', function(e) {
        elm.removeClass("dragAllowed");
        console.log("aaahw left!");
        e.preventDefault();
        e.stopPropagation();
    });

    elm.on('drop', function(e){
        elm.removeClass("dragAllowed");
        onDropFunction(e);
    });
}


function makeInfoTooltip(){
    var tooltip = $("<div id='lineinfo'></div>");
    var body = $("html");
    body.append(tooltip);

    body.on("mousemove",function(e){
        var x = e.pageX;
        var y = e.pageY;
        tooltip.css("left",x+15);
        tooltip.css("top",y-tooltip.outerHeight()-15);
    });


}

function preventFileDropOutsideTargets() {
    var page = $("html");
    page.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    page.on('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    page.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
}
$(function(){
    preventFileDropOutsideTargets();
    makeInfoTooltip();

    var dataReceiver = $("#data");
    makeFileDropTarget(dataReceiver,function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                loadData(e.originalEvent.dataTransfer.files);
            }
        }
    });
});