var definitionLoaded = false;
var dataLoaded = false;
var lineDefs;

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
        $.each(lineData, function(idx, value){
            var token = $("<span class='token'>" + value.text + "</span>");
            if(value.unknown) {
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
                allRanges = allRanges.concat({start: curIdx, end: startIndexes[intervalIdx]-1, unknown:true})
            }
            allRanges = allRanges.concat(lineDefinition[intervalIdx]);
            curIdx = endIndexes[intervalIdx] + 1;
            intervalIdx++;
        }
    }
    return allRanges;
}
function linedata(rawLine) {
    var fieldDescriptions = getLineDefinitionFor(rawLine, lineDefs);
    fieldDescriptions = addUndefinedRanges(fieldDescriptions, rawLine);
    if(fieldDescriptions){
        var data = [];
        $(fieldDescriptions).each(function(fieldNo, fieldDescription){
            if(fieldDescription){
                var fieldValue = rawLine.substr(fieldDescription.start, fieldDescription.end - fieldDescription.start + 1);
                if(fieldDescription.unknown) {
                    data = data.concat({text: fieldValue, unknown:true});
                }else{
                    data = data.concat({description: fieldDescription.description, text: fieldValue, name:fieldDescription.name});
                }
            }
        });
        return data;

    }

    return {};
}

function hideLineInfo() {
    $("#lineinfo").hide();
}

function displayLineInfo(data) {
    var infoElement = $("#lineinfo");
    infoElement.html(tooltipTemplate({elements: data}));
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
    if(definitionLoaded) {
        var dataHolder = $("#data");
        dataHolder.addClass("spinner");
        var file = file[0], reader = new FileReader();
        reader.onload = function(event) {
            var parsedDocument = parseDocument(event.target.result);
            $("#dataSource").text(file.name);

            dataHolder.removeClass("spinner");
            dataHolder.html(parsedDocument);
            dataHolder.removeClass("unloaded");

        };
        reader.readAsText(file);
        dataLoaded = true;
    }
    return false;
}
function loadDefinition(file) {
    var definitionHolder = $("#definition");
    var file = file[0], reader = new FileReader();
    reader.onload = function(event) {
        var loadedDefs = eval(event.target.result);
        $("#definitionSource").text(file.name);
        var definition = $("#definition");
        definition.text(event.target.result);
        definition.removeClass("unloaded");
        definition.animate({"height":200},1000);
        lineDefs = loadedDefs;
        definitionLoaded=true;
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
        e.preventDefault();
        e.stopPropagation();
    });

    elm.on('drop', function(e){
        elm.removeClass("dragAllowed");
        if(e.originalEvent.dataTransfer){
                    if(e.originalEvent.dataTransfer.files.length) {
                        e.preventDefault();
                        e.stopPropagation();
                        onDropFunction(e.originalEvent.dataTransfer.files);
                    }
                }
    });
}

function makeInfoTooltip(){
    var tooltip = $("<div id='lineinfo'></div>");
    var body = $("html");
    body.append(tooltip);

    tooltipTemplate = Handlebars.compile($("#tooltip-template").html());

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
    makeFileDropTarget($("#data"),loadData);
    makeFileDropTarget($("#definition"),loadDefinition);
});