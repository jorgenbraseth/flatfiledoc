var lineDefs = [
    {
        pattern: /ENH .*/i,
        lines: [
            { start: 0, end: 3, description: "Identifiserer start enhet  record" },
            { start: 4, end: 12, description: "Organisasjonsnummer" },
            { start: 13, end: 16, description: "Enhetstype" },
            { start: 17, end: 17, description: "Hovedsakstype" },
            { start: 18, end: 21, description: "Undersakstype" },
            { start: 22, end: 29, description: "Dato hvor enheten ble innført som ny i ER" },
            { start: 30, end: 37, description: "Dato for siste endring på enheten" },
            { start: 38, end: 38, description: "Første overføring" },
            { start: 39, end: 47, description: "Korrekt orgnr" },
            { start: 48, end: 48, description: "Type overføring" }
        ]
    },
    {
        pattern: /TRAI.*/i,
        lines: [
            { start: 0, end: 3, description: "Felttype: Trailer record" },
            { start: 4, end: 6, description: "Avsender: ER er avsender" },
            { start: 7, end: 13, description: "Antall enheter overført" },
            { start: 14, end: 22, description: "Antall records overført" }
        ]
    },
    {
        pattern: /HEAD.*/i,
        lines: [
            { start: 0, end: 3, description: "Felttype: Header record" },
            { start: 4, end: 6, description: "Avsender: ER er avsender" },
            { start: 7, end: 14, description: "ÅÅÅÅMMDD		Dato for generering av filen." },
            { start: 15, end: 19, description: "Kjørenr.\nLedende 0. Hver overføring nummereres fortløpende.\nDet skal ikke være hull i nummerserien." },
            { start: 20, end: 22, description: "Tilsvarende avsender i batch in." },
            { start: 23, end: 23, description: "A = Ordinær ajourholdsdata utveksling.\nS =  Data bestilt via \"SKD knappen\"\nK = Knytningsfil med begrensede enhetsdata" }
        ]
    },


    /*
     Type	24-24	1	A	A
     S
     K	= Ordinær ajourholdsdata utveksling.
     =  Data bestilt via "SKD knappen"
     = Knytningsfil med begrensede enhetsdata

     */

    {
        pattern: /USYS.*/i,
        lines: [
            { start: 0, end: 3, description: "Status: Ubemannet virksomhet" },
            { start: 4, end: 4, description: "Opplysningen er: Ny eller endret / Utgått / Kopi av tidligere sendt oppl." },
            { start: 5, end: 7, description: "Kode for avsender som sist endret oppl." }
        ]
    },
    {
        pattern: /LEDE.*/i,
        lines: [
            { start: 0, end: 3, description: "Felttype" },
            { start: 4, end: 4, description: "N/U/K	Opplysningen er: Ny eller endret / Utgått / Kopi av tidligere sendt oppl." },
            { start: 5, end: 7, description: "Endret av" },
            { start: 8, end: 8, description: "Indikerer rolle" },
            { start: 9, end: 9, description: "Indikerer at dette er data for rollen (I motsetning til fritekst)" },
            { start: 10, end: 39, description: "Ansvarsandel" },
            { start: 40, end: 40, description: "F/N/K/R \nF = Egenfratreden\nN = Ikke fratrådt\nK = Fratrådt pga konkurskarantene\nR = Fratrådt pga rettighetstap" },
            { start: 41, end: 44, description: "Valgtav" },
            { start: 45, end: 47, description: "Presentasjonsrekkefølge av styremedlemmer osv." },
            { start: 48, end: 58, description: "Fødselsnr eller Dnr." },
            { start: 59, end: 108, description: "Fornavn" },
            { start: 109, end: 158, description: "mellomnavn" },
            { start: 159, end: 208, description: "slektsnavn" },
            { start: 209, end: 217, description: "Postnr" },
            { start: 218, end: 252, description: "Adresse1" },
            { start: 253, end: 287, description: "Adresse2" },
            { start: 288, end: 322, description: "Adresse3" },
            { start: 323, end: 325, description: "Adresselandkode" },
            { start: 326, end: 326, description: "Personstatus" }
        ]
    }
];



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
    if(lineDefinition){
        var tokenized = tokenize(rawLine, lineDefinition);
        $(tokenized).each(function(idx, token){
            parsedLine.append(token);
        });
    }else{
        parsedLine.html(rawLine);
        parsedLine.addClass("unparsed");
    }

    return  parsedLine
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

function load(file) {

    var file = file[0],
        reader = new FileReader();
    reader.onload = function(event) {
        console.log(event.target);
        $("#data").html(parseDocument(event.target.result));
    };
    console.log(file);
    reader.readAsText(file);

    return false;
}

$(function(){
    var rawData = "HEADER 2013111203921SKAA\nENH 856919382AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 867712682AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 869093602ENK EEBTC1995031220131112N          \nFMVANMVABFLA\nENH 869426822ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 869762202BA  EEN  1995022020131112N          \nFMVANSSYOFVA\nFMVANSSYULBA\nENH 871931542BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 873212632BEDREEN  1995022220131111N          \nUSYSNSSY\nENH 876059282ENK EEBTC1996021920131112N          \nFMVANMVABFLA\nENH 880399772AS  EEBTC1999012120131112N          \nFMVANMVAULBA\nENH 880404172AS  EEBTC1998123020131112N          \nFMVANMVAULBA\nENH 881195402BEDREEBTC1999110120131112N          \nUSYSNBOF\nENH 882607232BEDREEBTC2000111320131112N          \nUSYSNBOF\nENH 882895602BEDREEBTC2001011720131112N          \nUSYSNBOF\nENH 884958172BEDREEBTC2002101220131112N          \nUSYSNBOF\nENH 886581432ASA EEN  2004021820131112N          \nKDATNSSYKD                              N881653192    001000000000\nKDATNSSYKD                              N965896422    005000000000\nKDATNSSYKD                              N979747241    004000000000\nKDATNSSYKD                              N986733884    003000000000\nKDATU   KD                               987058730\nKDATNSSYKD                              N991368965    006000000000\nKDATNSSYKD                              N991844562    007000000000\nKDATNSSYKD                              N994225170    009000000000\nKDATNSSYKD                              N994514431    008000000000\nENH 888212612KS  EEN  2005052420131112N          \nKGRLU   KD                               988192740\nENH 888849122BEDREEBTC2005110120131112N          \nUSYSNBOF\nENH 889106522BEDREEBTC2005121420131112N          \nUSYSNBOF\nENH 889479302BEDREEBTC2006021420131112N          \nUSYSNBOF\nENH 889669322BEDREEBTC2006033020131112N          \nUSYSNBOF\nENH 890309852BEDREEBTC2006092520131112N          \nUSYSNBOF\nENH 890460372BEDREEBTC2006103120131112N          \nUSYSNBOF\nENH 891347952BEDREEBTC2007060920131112N          \nUSYSNBOF\nENH 891507992BEDREEBTC2007071820131112N          \nUSYSNBOF\nENH 891923252BEDREEBTC2007110820131112N          \nUSYSNBOF\nENH 892004862BEDREEBTC2007112820131112N          \nUSYSNBOF\nENH 892498172BEDREEBTC2008040220131112N          \nUSYSNBOF\nENH 893674152BEDREEBTC2009021220131112N          \nUSYSNBOF\nENH 894743972UTLAEEN  2009110720131111N          \nKGRLU   KD                               983793754\nENH 897455102BEDREEBTC2011101120131112N          \nUSYSNBOF\nENH 898970442BEDREEBTC2012101220131112N          \nUSYSNBOF\nENH 915985106AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 922624690AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 929984005AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 933134946AS  EEBTC1995031220131112N          \nFMVANMVAULBA\nENH 933556115AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 942266049AS  EEBTC1995021920131112N          \nFMVANMVAULBA\nENH 951562599AS  EEBTC1995031220131112N          \nFMVANMVAULBA\nENH 951689637AS  EEBTC1995031220131112N          \nFMVANMVAULBA\nENH 959923442ANS EEBTC1995022020131112N          \nFMVANMVAULBA\nENH 962111149AS  EEBTC1995022020131112N          \nFMVANMVAULBA\nENH 968041452AS  EEBTC1995022020131112N          \nFMVANMVAULBA\nENH 969091526ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969092174ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969206471SA  EEBTC1995022020131112N          \nFMVANMVABVSK\nENH 969206544ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969207915ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969240351ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969346982ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969533626ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969726912ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 969732971ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 970153888ENK EEBTC1995031220131112N          \nFMVANMVABFLA\nENH 970237011ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 970272003ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 970287221ENK EEBTC1995022020131112N          \nFMVANMVAULBA\nENH 970305734ENK EEBTC1995022020131112N          \nFMVANMVAULBA\nENH 970429670ENK EEBTC1995031220131112N          \nFMVANMVAULBA\nENH 970554769ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 971214295ENK EEBTC1995022020131112N          \nFMVANMVABFLA\nENH 971279249ESEKEEN  1995022020131111N          \nNACENSSY12.000        N\nENH 971451602ENK EEN  1995022020131111N          \nNACENSSY12.000        N\nENH 971674636BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 971926279BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 971987383BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 972009091BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 972045489BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 972109053BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 972881228BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 973165631BEDREEN  1995022320131112N          \nUSYSNSSY\nENH 973214551BEDREEN  1995022220131112N          \nUSYSU   \nENH 973216384BEDREKORR1995031220131112N          \nUSYSU   \nENH 973244833BEDREEN  1995031220131112N          \nUSYSU   \nENH 973245058BEDREEN  1995031220131112N          \nUSYSU   \nENH 974161915BEDREEBTC1995022320131112N          \nUSYSNBOF\nENH 974286459BEDREEBTC1995031220131112N          \nUSYSNBOF\nENH 974295253BEDREEBTC1995031220131112N          \nUSYSNBOF\nENH 974630761AS  EEBTC1995071020131112N          \nFMVANMVAULBA\nENH 974787288AS  EEBTC1995080720131112N          \nFMVANMVAULBA\nENH 974826054BEDREEBTC1995081120131112N          \nUSYSNBOF\nENH 975070484BEDREEBTC1996022420131112N          \nUSYSNBOF\nENH 975224767BEDREEBTC1998112420131112N          \nUSYSNBOF\nENH 976006771AS  EEBTC1996011720131112N          \nFMVANMVAULBA\nENH 976028678BEDREEBTC1996012420131112N          \nUSYSNBOF\nENH 976516575AS  EEBTC1996061320131112N          \nFMVANMVAULBA\nENH 978999638BEDREEBTC1997091520131112N          \nUSYSNBOF\nENH 979134924BEDREEBTC1997081420131112N          \nUSYSNBOF\nENH 979309503AS  EEBTC1997101020131112N          \nFMVANMVAULBA\nENH 979364857AS  EEN  1997110420131111N          \nFMVANSSYULBA\nFMVANSSYBFLA\nFMVANSSYBVSK\nFMVANSSYOFVA\nFMVANSSYSBAD\nENH 979384483AS  EEBTC1997111220131112N          \nFMVANMVAULBA\nENH 979722338BEDREEBTC1998032520131112N          \nUSYSNBOF\nENH 979814666AS  EEBTC1998051320131112N          \nFMVANMVAULBA\nENH 979924216BEDREEBTC1998061820131112N          \nUSYSNBOF\nENH 979933126AS  EEBTC1998071120131112N          \nFMVANMVAULBA\nENH 979938128AS  EEBTC1998081120131112N          \nFMVANMVAULBA\nENH 979960697BEDREEBTC1998070120131112N          \nUSYSNBOF\nENH 979966520AS  EEBTC1998071520131112N          \nFMVANMVAULBA\nENH 980089444BEDREEBTC1998090320131112N          \nUSYSNBOF\nENH 980175863AS  EEBTC1998100820131112N          \nFMVANMVAULBA\nENH 980188159AS  EEBTC1998101320131112N          \nFMVANMVAULBA\nENH 980667057AS  EEBTC1999041420131112N          \nFMVANMVAULBA\nENH 980821226AS  EEBTC1999062920131112N          \nFMVANMVAULBA\nENH 980860434BEDREEBTC1999061820131112N          \nUSYSNBOF\nENH 980922308ENK EEN  1999072020131112N          \nFADRNSSY2010     NO 0231                                        Lerdalsgata 35\nFMVANSSYBFLA\nR-MVNSSYJ\nENH 981245539BEDREEBTC1999111220131112N          \nUSYSNBOF\nENH 981293088BEDREEBTC1999112220131112N          \nUSYSNBOF\nENH 981628217BEDREEBTC2000022920131112N          \nUSYSNBOF\nENH 981937708DA  EEN  2000042520131112N          \nFMVANSSYOFVA\nENH 981945042BEDREEBTC2000042620131112N          \nUSYSNBOF\nENH 982114691BEDREEBTC2000061620131112N          \nUSYSNBOF\nENH 982278325BEDREEBTC2000081720131112N          \nUSYSNBOF\nENH 982463718ASA EEN  2000100620131111N          \nKDATNSSYKD                              N971050365    006000000000\nKDATNSSYKD                              N980003744    007000000000\nKDATNSSYKD                              N982750148    008000000000\nKDATNSSYKD                              N983254241    009000000000\nKDATNSSYKD                              N983337406    011000000000\nKDATU   KD                               983793754\nKDATNSSYKD                              N983845053    010000000000\nKDATNSSYKD                              N983935125    003000000000\nKDATNSSYKD                              N983939724    013000000000\nKDATNSSYKD                              N983940145    012000000000\nKDATNSSYKD                              N984400993    004000000000\nKDATNSSYKD                              N985173710    002000000000\nKDATNSSYKD                              N989656465    014000000000\nKDATNSSYKD                              N992859776    015000000000\nENH 982591708AS  EOPPL2000110820131111N          \nDAGLU   RD                                      03106634717\nSAMUDAGL   \nOPPLNSSY\nENH 982634113BEDREEBTC2000112120131112N          \nUSYSNBOF\nENH 982647258BEDREEBTC2000112120131112N          \nUSYSNBOF\nENH 982897866BEDREEBTC2001011820131112N          \nUSYSNBOF\nENH 983199607BEDREEBTC2001040220131112N          \nUSYSNBOF\nENH 983511678BEDREEBTC2001070420131112N          \nUSYSNBOF\nENH 983707084BEDREEBTC2001091320131112N          \nUSYSNBOF\nENH 984236743BEDREEBTC2002022020131112N          \nUSYSNBOF\nENH 984339747NUF ENYFR2002031920131111N          \nFADRNSSY0278     NO 0301                                        Sj�lyst plass 1\nFORMNSSYVirksomhet i Norge(m�bler).\nNAVNNSSYFRITZ HANSEN                                                                                                                                                                   HANSEN FRITZ\nR-FRNSSYJ\nENH 984386540BEDREEBTC2002040820131112N          \nUSYSNBOF\nENH 985002142BEDREEBTC2002102420131112N          \nUSYSNBOF\nENH 985058644BEDREEBTC2002111120131112N          \nUSYSNBOF\nENH 985930325BEDREEBTC2003081220131112N          \nUSYSNBOF\nENH 986083421BEDREEBTC2003092520131112N          \nUSYSNBOF\nENH 986926577BEDREEBTC2004060120131112N          \nUSYSNBOF\nENH 986937080BEDREEBTC2004060320131112N          \nUSYSNBOF\nENH 986991042AS  EEN  2004062820131112N          \nDAGLU   RD                                      18076721757\nDAGLNSSYRD                              N    00154125500075V�RIN                                                                                               STAVA                                             5131     Salhusvegen 14                                                                                           NO L\nENH 987097884BEDREEBTC2004072820131112N          \nUSYSNBOF\nENH 987224592BEDREEBTC2004090720131112N          \nUSYSNBOF\nENH 987395036BEDREEBTC2004102120131112N          \nUSYSNBOF\nENH 987550481BEDREEBTC2004112920131112N          \nUSYSNBOF\nENH 988127329BEDREEBTC2005041920131112N          \nUSYSNBOF\nENH 988169552BEDREEBTC2005042820131112N          \nUSYSNBOF\nENH 988388254BEDREEBTC2005062720131112N          \nUSYSNBOF\nENH 988681636BEDREEBTC2005092120131112N          \nUSYSNBOF\nENH 988729558BEDREEBTC2005100320131112N          \nUSYSNBOF\nENH 988801658BEDREEBTC2005102020131112N          \nUSYSNBOF\nENH 988831204BEDREEBTC2005102620131112N          \nUSYSNBOF\nENH 988854352BEDREEBTC2005110120131112N          \nUSYSNBOF\nENH 988873500BEDREEBTC2005110520131112N          \nUSYSNBOF\nENH 988958956AS  EEN  2006012320131112N          \nR-MVNSSYJ\nENH 989419099ENK EEBTC2006020220131112N          \nFMVANMVAULBA\nR-MVNMVAJ\nENH 989817337BEDREEBTC2006051120131112N          \nUSYSNBOF\nENH 990232539BEDREEBTC2006090520131112N          \nUSYSNBOF\nENH 990266093BEDREEBTC2006091320131112N          \nUSYSNBOF\nENH 990356769BEDREEBTC2006100520131112N          \nUSYSNBOF\nENH 990469652BEDREEBTC2006110220131112N          \nUSYSNBOF\nENH 990622264BEDREEBTC2006120920131112N          \nUSYSNBOF\nENH 990686858BEDREEBTC2006122320131112N          \nUSYSNBOF\nENH 990727309AS  EEN  2007011720131112N          \nDAGLU   RD                                      08096536330\nDAGLNSSYRD                              N    00154125500075V�RIN                                                                                               STAVA                                             5131     Salhusvegen 14                                                                                           NO L\nENH 990761795BEDREEBTC2007011520131112N          \nUSYSNBOF\nENH 991000771BEDREEBTC2007030820131112N          \nUSYSNBOF\nENH 991063625BEDREEBTC2007032420131112N          \nUSYSNBOF\nENH 991114246BEDREEBTC2007041020131112N          \nUSYSNBOF\nENH 991214755BEDREEBTC2007050320131112N          \nUSYSNBOF\nENH 991437460BEDREEBTC2007063020131112N          \nUSYSNBOF\nENH 991727523BEDREEBTC2007091920131112N          \nUSYSNBOF\nENH 991844562ASA EEN  2007102220131112N          \nKDATNSSYKD                              N888212612    002000000000\nKDATU   KD                               988192740\nKDATNSSYKD                              N989628615    004000000000\nKDATNSSYKD                              N993404489    003000000000\nKDATNSSYKD                              N998159547    007000000000\nKDATNSSYKD                              N998787300    005000000000\nKDATNSSYKD                              N998796741    006000000000\nENH 991886621BEDREEBTC2007103020131112N          \nUSYSNBOF\nENH 991936033BEDREEBTC2007111220131112N          \nUSYSNBOF\nENH 991970088BEDREEBTC2007112020131112N          \nUSYSNBOF\nENH 992093161AS  EEN  2008010920131112N          \nFMVANSSYOFVA\nFMVANSSYULBA\nFMVANSSYSBAD\nFMVANSSYBFLA\nENH 992100958BEDREEBTC2007122220131112N          \nUSYSNBOF\nENH 992124032BEDREEBTC2008010320131112N          \nUSYSNBOF\nENH 992384670BEDREEBTC2008030120131112N          \nUSYSNBOF\nENH 992551852BEDREEBTC2008041520131112N          \nUSYSNBOF\nENH 992638974BEDREEBTC2008050720131112N          \nUSYSNBOF\nENH 992728809BEDREEBTC2008052920131112N          \nUSYSNBOF\nENH 992808918BEDREEBTC2008062120131112N          \nUSYSNBOF\nENH 992841192BEDREEBTC2008063020131112N          \nUSYSNBOF\nENH 993284947BEDREEBTC2008110520131112N          \nUSYSNBOF\nENH 993416290BEDREEBTC2008121020131112N          \nUSYSNBOF\nENH 993558206BEDREEBTC2009012120131112N          \nUSYSNBOF\nENH 993578053BEDREEBTC2009012720131112N          \nUSYSNBOF\nENH 993642398BEDREEBTC2009021020131112N          \nUSYSNBOF\nENH 993656461BEDREEBTC2009021220131112N          \nUSYSNBOF\nENH 993891525BEDREEBTC2009032320131112N          \nUSYSNBOF\nENH 994087908FLI EEN  2009060620131111N          \nLEDEU   RD                                      04073739832\nLEDENSSYRD                              N    00130126719341Sonny Sven-Arne                                                                                     Andersson                                         1397     Broveien 4                                                                                               NO U\nMEDLU   RD                                      03052833530\nMEDLU   RD                                      09033336141\nMEDLU   RD                                      18023836420\nMEDLU   RD                                      29123740821\nNESTU   RD                                      25033138469\nENH 994283103BEDREEBTC2009070220131112N          \nUSYSNBOF\nENH 994335405BEDREEBTC2009072220131112N          \nUSYSNBOF\nENH 994443062BEDREEBTC2009082220131112N          \nUSYSNBOF\nENH 994497650BEDREEBTC2009090720131112N          \nUSYSNBOF\nENH 994770411BEDREEBTC2009111420131112N          \nUSYSNBOF\nENH 994780638BEDREEBTC2009111720131112N          \nUSYSNBOF\nENH 994985272BEDREEBTC2010011220131112N          \nUSYSNBOF\nENH 995459140BEDREEBTC2010042920131112N          \nUSYSNBOF\nENH 995480336BEDREEBTC2010050420131112N          \nUSYSNBOF\nENH 995571129BEDREEBTC2010053120131112N          \nUSYSNBOF\nENH 995619628BEDREEBTC2010061220131112N          \nUSYSNBOF\nENH 995656639BEDREEBTC2010062220131112N          \nUSYSNBOF\nENH 995738910BEDREEBTC2010071420131112N          \nUSYSNBOF\nENH 995907941BEDREEBTC2010090720131112N          \nUSYSNBOF\nENH 995939274BEDREEBTC2010091520131112N          \nUSYSNBOF\nENH 996081893NUF EEN  2010103020131111N          \nFMVANSSYULBA\nFMVANSSYOFVA\nENH 996235866AS  EOPPL2010112920131111N          \nDAGLU   RD                                      07086729509\nSAMUDAGL   \nOPPLNSSY\nENH 996308405BEDREEBTC2011010420131112N          \nUSYSNBOF\nENH 996409104BEDREEBTC2011011320131112N          \nUSYSNBOF\nENH 996409279BEDREEBTC2011011320131112N          \nUSYSNBOF\nENH 996444171BEDREEBTC2011011920131112N          \nUSYSNBOF\nENH 996486907BEDREEBTC2011012920131112N          \nUSYSNBOF\nENH 996670287BEDREEBTC2011030820131112N          \nUSYSNBOF\nENH 996804364BEDREEBTC2011040920131112N          \nUSYSNBOF\nENH 996946312ENK EEN  2011052320131112N          \nFMVANSSYBFLA\nENH 997077725BEDREEBTC2011062720131112N          \nUSYSNBOF\nENH 997307038BEDREEBTC2011090620131112N          \nUSYSNBOF\nENH 997313135BEDREEBTC2011090720131112N          \nUSYSNBOF\nENH 997372506BEDREEBTC2011092120131112N          \nUSYSNBOF\nENH 997372816BEDREEBTC2011092120131112N          \nUSYSNBOF\nENH 997415485BEDREEBTC2011100120131112N          \nUSYSNBOF\nENH 997468503BEDREEBTC2011101320131112N          \nUSYSNBOF\nENH 997744640BEDREEBTC2011122020131112N          \nUSYSNBOF\nENH 997934296BEDREEBTC2012020620131112N          \nUSYSNBOF\nENH 998109167BEDREEBTC2012031620131112N          \nUSYSNBOF\nENH 998114535BEDREEBTC2012031620131112N          \nUSYSNBOF\nENH 998214149BEDREEBTC2012041020131112N          \nUSYSNBOF\nENH 998559863AAFYEEN  2012062820131111N          \nFADRNSSY0278     NO 0301                                        Sj�lyst plass 1\nNAVNNSSYFRITZ HANSEN                                                                                                                                                                   HANSEN FRITZ\nENH 998972418BEDREEBTC2012101220131112N          \nUSYSNBOF\nENH 999159079SAM EEN  2012112020131112N          \nFMVANSSYSBAD\nENH 999204058BEDREEBTC2012112920131112N          \nUSYSNBOF\nENH 999208851FLI EEN  2013011020131112N          \nKONTU   RD                                      05030101113\nKONTU   RD                                      16065139913\nR-MVNSSYJ\nENH 999340075BEDREEBTC2013010820131112N          \nUSYSNBOF\nENH 999354033BEDREEBTC2013011020131112N          \nUSYSNBOF\nENH 999362141BEDREEBTC2013011020131112N          \nUSYSNBOF\nENH 999430066BEDREEBTC2013011120131112N          \nUSYSNBOF\nENH 999466001BEDREEBTC2013011420131112N          \nUSYSNBOF\nENH 999487696BEDREEBTC2013011420131112N          \nUSYSNBOF\nENH 987058730AS  SSL  2004071420131111N          \nENH 988192740AS  SSL  2005050920131111N          \nENH 998274605ENK SSL  2012042420131111N          \nENH 890708412BEDRSBEDR2007010320131111N          \nNDATNSSY20130101\nENH 898299732BEDRSBEDR2012042520131111N          \nNDATNSSY20130101\nTRAIER 0000233000000522\n";

    var dataReceiver = $("#droptarget");
    dataReceiver.on(
        'dragover',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    );
    dataReceiver.on(
        'dragenter',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    );

    dataReceiver.on('drop',
        function(e){
            if(e.originalEvent.dataTransfer){
                if(e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    /*UPLOAD FILES HERE*/
                    load(e.originalEvent.dataTransfer.files);
                }
            }
        }
    );

});