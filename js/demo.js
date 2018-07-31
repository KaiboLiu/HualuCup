var day = "weekends";
var weather = "regular";
var timeInput = 2;//8:00;
var timeFormat = "";
var SVGdisplayed = false;
var line_name = ['161','608','656','660','686','688','845','849','870','962'];
var y_title = 50;
//var dataFile = "./data/"+day+"_"+weather; //"day1_weather1";
//var dataFile = "https://raw.githubusercontent.com/KaiboLiu/HualuCup/master/data/day1_weather1.dat";
var dataPath = "https://raw.githubusercontent.com/KaiboLiu/HualuCup/master/data/";
var dataFile = "";


function getNode(n, v) {
    //console.log(v);
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    //console.log(n);
  return n;
}


function DC_nextInput(){
    day      = $("#dayid").find('option:selected').val();
    $("#weatherid").removeAttr("disabled"); // enables select   
    //confirmSeq();
    var videoDiv = document.getElementById('demoVideo');
    if (videoDiv != null) videoDiv.remove(); 
    if (SVGdisplayed) {
        document.getElementById("inputShown").innerHTML = $("#dayid").find('option:selected').text() + "_" + $("#weatherid").find('option:selected').text();//.slice(7);
        DC_init_map();
    }
}

function DC_confirmInput(){
    weather = $("#weatherid").find('option:selected').val();
    document.getElementById("inputShown").innerHTML = $("#dayid").find('option:selected').text() + "_" + $("#weatherid").find('option:selected').text();//.slice(7);
    document.getElementById("activeDispDiv").style.display = "block";
    SVGdisplayed = true;
    DC_init_map();
    
}

function DC_tempTime(){
    timeInput = document.getElementById("numslidebar").value;    // this is a string, instead of number...
    timeInput = Number(timeInput);
    timeFormat = (timeInput+6) + ':00';
    if (timeInput < 4) {timeFormat = '0'+timeFormat;}
    //hour   = parseInt(timeInput/60)
    //minute = (timeInput % 60)
    //if (minute < 10) {minute = '0'+minute;}
    
    document.getElementById("timeInput").innerHTML = timeFormat;
    document.getElementById("slidebarHint").innerHTML = '   （释放鼠标以确认）';
}


//change time slidebar to tune tune and highlight certain line
function DC_change(hint) {
    document.getElementById("timeInput").innerHTML = timeFormat;
    document.getElementById("slidebarHint").innerHTML = hint;
    console.log('time of day: ' + timeFormat);
    DC_init_map();
    //fillPage_go(d=40,R=250,circleScale=50,halfOpen=20);
}


function DC_val2Color(index){   //convert to  0-100
    // box into 0-10, then expand to 0-100
    if (index < 0){
        return 'grey';
    } else if (index > 5){
        index = 5;
    }
    index *= 20;
    //var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内
    var one = (255+255) / 100;  
    var r=0;
    var g=0;
    var b=0;
 
    if ( index < 50 ) { 
        // 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
        r = one * index;
        g=255;
    }
    if ( index >= 50 ) {
        // 比例大于50的时候绿色是越来越少的,直到0 变为纯红
        g =  255 - ( (index - 50 ) * one) ;
        r = 255;
    }
    r = parseInt(r);// 取整
    g = parseInt(g);// 取整
    b = parseInt(b);// 取整
 
    //console.log("#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2));
    //return "#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2);
    //console.log("rgb("+r+","+g+","+b+")" );
    return "rgb("+r+","+g+","+b+")";
        
}


function DC_init_map(){
    dataFile = dataPath + day +'_'+ weather+'.dat';
    DC_removeTable();
    $.getJSON(dataFile, function(data, status) {
        console.log(status);
        $("#mySVG").empty();
        
        data = data.map[0];
        console.log(''+data.n_line);  
        console.log(data);  
        DC_render_map(data.n_line, data.n_stops, data.names, data.coordinates,
                      data.index_up[timeInput],data.index_down[timeInput]);
        // for certain time, should be data.index_up[timeInput]
    });
}



function DC_render_map(n_line, n_stops, names, coordinates, index_up, index_down ){
    var svg = document.getElementById('mySVG');
    var color_dot_stroke = '#33CAFF';//'#4842FF';// dark blue'white';
    var color_dot_fill = 'white';//'#33CAFF';// light blue 'blue';
    var dot_stoke_wid = 3;
    var dot_radius = 8;
    var offset = 5;//7;
    var sideWidth = 4;//5;
    var centerWidth = offset*2 - sideWidth;
    var dashLength = 25;
    //check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
    if (svg)
    {   
        console.log('inside svg rendering');    

        var p1 = new Object;
        var p2 = new Object;
        var legend;
        var legendSize = 15;// font size in pixel
        var legendWid = 5;  // number of char per line


        for (var lineNo=0; lineNo<n_line; lineNo++){
        //for (var lineNo=8; lineNo<9; lineNo++){

            p1.x = coordinates[lineNo][0];
            p1.y = coordinates[lineNo][1];

            // add title(line name) for each line in map
            legend = getNode('text', {x: p1.x-5, y:y_title/2, fontFamily:"Courier", fontSize:25, fill:'#33FFA5'});
            legend.innerHTML = line_name[lineNo]+'路';
            svg.appendChild(legend);            

            // draw n-1 segments
            for (var stopNo=1; stopNo<n_stops[lineNo]; stopNo++){
                p2.x = coordinates[lineNo][stopNo*2];
                p2.y = coordinates[lineNo][stopNo*2+1];

                var alpha = Math.atan((p2.y-p1.y)/(p2.x-p1.x));
                var dx = offset * Math.sin(alpha), dy = offset * Math.cos(alpha);
                if ((alpha * (p2.y-p1.y) < 0) || ((p2.y==p1.y)&&(p2.x<p1.x))){dx = 0-dx; dy = 0-dy}
                //console.log(dx+','+dy+'');
                var traffic_color_up    = DC_val2Color(index_up[lineNo][stopNo-1]);
                var traffic_color_down  = DC_val2Color(index_down[lineNo][stopNo-1]);
                console.log(lineNo+'_'+stopNo+':'+traffic_color_up+'/'+traffic_color_down);
                var newline_up   = getNode('line', {x1: p1.x-dx, y1:p1.y+dy+y_title, x2:p2.x-dx, y2:p2.y+dy+y_title, 
                                                    stroke:traffic_color_up,   strokeWidth:sideWidth, strokeDashoffset:dashLength*2,
                                                    class:"tooltips-seg line_up"+lineNo, 
                                                    id:line_name[lineNo]+'路上行'+stopNo+'段：['+names[lineNo][stopNo-1]+'-->'+names[lineNo][stopNo]+']'});
                var newline_down = getNode('line', {x1: p1.x+dx, y1:p1.y-dy+y_title, x2:p2.x+dx, y2:p2.y-dy+y_title, 
                                                    stroke:traffic_color_down, strokeWidth:sideWidth, strokeDashoffset:dashLength*2,
                                                    class:"tooltips-seg line_down"+lineNo, 
                                                    id:line_name[lineNo]+'路下行'+stopNo+'段：['+names[lineNo][stopNo]+'-->'+names[lineNo][stopNo-1]+']'});
                var newline      = getNode('line', {x1: p1.x,    y1:p1.y+y_title,    x2:p2.x,    y2:p2.y+y_title, 
                                                    stroke:'grey', strokeWidth:centerWidth, class:"tooltips-seg inner-seg line_inner"+lineNo, 
                                                    //id:"line"+(lineNo)+'_'+stopNo+':['+names[lineNo][stopNo-1]+','+names[lineNo][stopNo]+']'});
                                                    id:line_name[lineNo]+'路_'+stopNo+'段'});

                //if (index_up[lineNo][stopNo-1]   > 0){ newline_up.classList.add("flow_up"); }
                //if (index_down[lineNo][stopNo-1] > 0){ newline_down.classList.add("flow_down"); }

                svg.appendChild(newline_up);
                svg.appendChild(newline_down);
                svg.appendChild(newline);
                
                p1.x = p2.x;
                p1.y = p2.y;
            }

            // draw n dots of stops with double color
            for (var stopNo=0; stopNo<n_stops[lineNo]; stopNo++){
                p1.x = coordinates[lineNo][stopNo*2];
                p1.y = coordinates[lineNo][stopNo*2+1];
                var newdot = getNode('circle', {cx:p1.x, cy:p1.y+y_title, r:dot_radius, 
                                    stroke:color_dot_stroke, fill:color_dot_fill, strokeWidth:dot_stoke_wid,
                                    class:"tooltips-stop line"+lineNo, 
                                    id:line_name[lineNo]+"路_"+(stopNo+1)+': '+names[lineNo][stopNo],//});
                                    //id:"line"+(lineNo+1)+"_stop"+(stopNo+1)+':'+names[lineNo][stopNo]+' ('+p1.x+','+p1.y+')',//});
                                    onclick: "DC_addTable("+lineNo+", "+stopNo+")"}); // later: add id and class
                svg.appendChild(newdot);
                

                legend = getNode('text', {x: p1.x+10, y:p1.y+y_title, fontFamily:"Courier", fontSize:legendSize, fill:'#33CAFF'});
    
                // line break for long names
                if (names[lineNo][stopNo].length > legendWid){
                    legend.innerHTML = names[lineNo][stopNo].slice(0,legendWid)
                                        +'<tspan x='+(p1.x+10)+' dy='+(legendSize*1.5)+'>'
                                        +names[lineNo][stopNo].slice(legendWid)+'</tspan>';
                    console.log('----'+legend.innerHTML);
                } else{
                    legend.innerHTML = names[lineNo][stopNo];
                }
    
                //legend.innerHTML = names[lineNo][stopNo];
                svg.appendChild(legend);
                console.log('dot added: line '+ lineNo +':'+ (stopNo+1)+ ' at '+p1.x+','+p1.y);
                
            }
        }
    }   

}


// init the table area
function DC_removeTable(){
    var tableDiv = document.getElementById('table_div');
    while (tableDiv.firstChild){
        tableDiv.removeChild(tableDiv.firstChild);
    }
}


function DC_addTable(lineNo, stopNo) {

    // refresh the table area
    DC_removeTable();
    // refresh the inner segments
    var innerSegs=document.getElementsByClassName("inner-seg");//获取元素的class
    for (var i=0; i<innerSegs.length; i++){
        innerSegs[i].style.stroke = 'grey';
    }    

    $.getJSON(dataFile, function(data, status) {
        console.log('read file for table');
        //timeInput = 0
        data = data.map[0];
        DC_fillTable(data.n_line, data.n_stops, data.names,data.time_up[timeInput],data.time_down[timeInput], lineNo, stopNo);

        // check overlap stop in different bus line
        for (var newLine = 0; newLine < data.n_line; newLine += 1){
            if (newLine != lineNo){
                for (var stop=0; stop<data.n_stops[newLine]; stop++){
                    if ((data.coordinates[newLine][stop*2]   == data.coordinates[lineNo][stopNo*2]) && 
                        (data.coordinates[newLine][stop*2+1] == data.coordinates[lineNo][stopNo*2+1])){
                        DC_fillTable(data.n_line, data.n_stops, data.names,
                                     data.time_up[timeInput],data.time_down[timeInput], newLine, stop);
                        break;
                    }
                }
            }
        }
       // for certain time, should be data.index_up[timeInput]
   });


}


function DC_fillTable(n_line, n_stops, names, time_up, time_down, lineNo, stopNo){
    // highlight the chosen bus line
    var highlightSegs = document.getElementsByClassName("line_inner"+lineNo);//获取元素的class
    for (var i=0; i<highlightSegs.length; i++){
        highlightSegs[i].style.stroke = 'white';//'yellow';
    }

    var tableDiv = document.getElementById('table_div');
    var title = document.createElement('h1');
    title.innerHTML = '<br>公交'+(line_name[lineNo])+'路：由<span style="color:blue;font-size:110%;">'+names[lineNo][stopNo]+'</span>站出发时间';
    tableDiv.appendChild(title);
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');

    table.border = '1';
    table.appendChild(tableBody);

    var heading = new Array();
    heading[0] = "序号";
    heading[1] = "站名";
    heading[2] = "到站时间";
    heading[3] = "上下行";

    var target, time=0;
    var timeTable = new Array();

    //for (var i=0; i< 40; i++){
    // assign the row of start stop
    timeTable[stopNo] = new Array(stopNo+1, names[lineNo][stopNo], "起点", "-");

    // assign rows of forwarding stops
    for (target = stopNo+1; target < n_stops[lineNo]; target += 1){    // i --> i+1,..., i --> n
        if (time_up[lineNo][target-1] < 0){
            time += 60
        } else {
            time += time_up[lineNo][target-1];
        }
        timeTable[target] = new Array(target+1, names[lineNo][target], parseInt(time/60)+' 分 '+(time % 60)+' 秒', "上行"); 
    }

    // assign rows of backwarding stops
    time = 0;
    for (target = stopNo-1; target >= 0; target -= 1){    // i --> i+1,..., i --> n
        if (time_down[lineNo][target] < 0){
            time += 60
        } else {
            time += time_down[lineNo][target];
        }
        timeTable[target] = new Array(target+1, names[lineNo][target], parseInt(time/60)+' 分 '+(time % 60)+' 秒', "下行");
    }
    //}



    //TABLE Head
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (i = 0; i < heading.length; i++) {
        var th = document.createElement('TH')
        th.width = '40';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }

    //TABLE ROWS
    for (i = 0; i < timeTable.length; i++) {
        var tr = document.createElement('TR');
        for (j = 0; j < timeTable[i].length; j++) {
            var td = document.createElement('TD')
            if (i == stopNo){ td.style.color = 'red'; }
            td.appendChild(document.createTextNode(timeTable[i][j]));

            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }  
    tableDiv.appendChild(table);

}



var btn = $('#return-to-top');

$(window).scroll(function() {
  if ($(window).scrollTop() > 200) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '200');
});