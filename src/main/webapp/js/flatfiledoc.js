var lineDefs = [
    {
        start: 0,
        end: 6,
        description: "doodad"
    },
    {
        start: 7,
        end: 11,
        description: "foobad"
    }];



function parseDocument(raw) {
    var lines = raw.split("\n");
    var parsed = $("<div class='parsedDocument'></div>");

    $(lines).each(function(lineNum, line){
        parsed.append(parseLine(line));
    });
    return parsed;
}

function parseLine(rawLine) {
    console.log(rawLine);
    var parsedLine = $("<span class='line'></span>");


    var lineDefinition = getLineDefinitionFor(rawLine, lineDefs);
    var tokenized = tokenize(rawLine, lineDefinition);

    $(tokenized).each(function(idx, token){
        parsedLine.append(token);
    });
    return  parsedLine
}

function getLineDefinitionFor(line, lineDefs) {
    return lineDefs;
}

function tokenize(line, lineDefs) {
    var tokens = [];

    $(lineDefs).each(function(lineNo, lineDef){
        var tokenText = line.substr(lineDef.start, lineDef.end - lineDef.start);
        tokens = tokens.concat($("<span class='token' title='"+lineDef.description+"'>"+tokenText+"</span>"));
    });

    return tokens;
}

$(function(){
    var rawData = "HEADER 2013111203921SKAA\nENH 856919382AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 867712682AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 869093602ENK EEBTC1995031220131112N          \nFMVANMVABFLA\nENH 869426822ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 869762202BA  EEN  1995022020131112N          \nFMVANSSYOFVA\nFMVANSSYULBA\nENH 871931542BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 873212632BEDREEN  1995022220131111N          \nUSYSNSSY\nENH 876059282ENK EEBTC1996021920131112N          \nFMVANMVABFLA\nENH 880399772AS  EEBTC1999012120131112N          \nFMVANMVAULBA\nENH 880404172AS  EEBTC1998123020131112N          \nFMVANMVAULBA\nENH 881195402BEDREEBTC1999110120131112N          \nUSYSNBOF\nENH 882607232BEDREEBTC2000111320131112N          \nUSYSNBOF\nENH 882895602BEDREEBTC2001011720131112N          \nUSYSNBOF\nENH 884958172BEDREEBTC2002101220131112N          \nUSYSNBOF";
    $("#data").html(parseDocument(rawData));
});