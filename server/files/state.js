function CheckStates(){
    var images = document.getElementsByTagName("image");
    //alert(images[0].id);
    Array.prototype.forEach.call(images, element => {
        //alert(element.href.baseVal);
        if(drain.includes(element.id)) element.href.baseVal = element.href.baseVal.replace(".jpg", "") + "Alert.jpg";
    });
    // d3.selectAll("image")
    //     .data(Global.current.elems)
    //     .attr("xlink:href", function(d){if (drain.includes(d.id)){ alert("Drain!"); return d.image.replace(".jpg", "")+"Alert.jpg";} return d.image})
}

function Rotate()
{
    var MinX = Global.w, MaxX = 0;
    Global.SelectedBuffer.forEach(element => {
        if(element.x < MinX)
            MinX = element.x;
        if(element.x > MaxX)
            MaxX = element.x;
    });
    //alert(MinX)
    Global.SelectedBuffer.forEach(element => {
        element.x = MinX + MaxX - element.x;
        //alert(element.x)
    });
    Draw(Global.current, Global.currentlvl); 
}

function AddMultiLink()
{
  SaveMODEL();

  d3.selectAll("image")
    .on("click", function(d){
        Global.SelectedBuffer.forEach(element => {
            Global.current.lines.push({source: Global.current.elems.indexOf(d), target:Global.current.elems.indexOf(element)});
        })
        Draw(Global.current, Global.currentlvl);
    });
  document.getElementById('Undo').disabled=false;
}

function PhysicalView(){
    //Global.hsize=30;
    //Global.wsize=200;
    
    Draw(Global.current, Global.currentlvl);

    d3.selectAll("[href*='blade2.jpg']")
        .attr("href", "blade2Phys.jpg");

    d3.selectAll("[href*='IBcomut.jfif']")
        .attr("href", "IBcomutPhys.jfif");

    d3.selectAll("[href*='comut.png']")
        .attr("href", "comutPhys.png");

    d3.selectAll("image")
        .attr("width", 200)
        .attr("height", 30);
}



function OldAddContainer()
{
    var paramsDiv = d3.select("div.canvas")
        .append("div")
        .attr("class", "carousel");

    paramsDiv.append("div")
        .insert("p")
        .html("Number of Stands")
        .insert("input")
        .attr("value", 1)
        .attr("id", "StandsNumber");

    paramsDiv.append("div")
        .insert("p")
        .html("Number of Pools")
        .insert("input")
        .attr("value", 1)
        .attr("id", "PoolsNumber");
    
    paramsDiv.append("div")
        .insert("p")
        .html("Number of Rows")
        .insert("input")
        .attr("value", 1)
        .attr("id", "RowsNumber");

    paramsDiv.append("div")
        .insert("p")
        .html("Number of Sections")
        .insert("input")
        .attr("value", 1)
        .attr("id", "SectionsNumber");

    paramsDiv.append("div")
        .insert("p")
        .html("Number of Nodes")
        .insert("input")
        .attr("value", 1)
        .attr("id", "ContainersNumber");

    paramsDiv.append("div")
        .insert("p")
        .html("Starting X")
        .append("input")
        .attr("value", 1)
        .attr("id", "ContainersX");

    paramsDiv.append("div")
        .insert("p")
        .html("Starting Y")
        .append("input")
        .attr("value", 1)
        .attr("id", "ContainersY");

    paramsDiv.append("div")
        .append("button")
        .html("Submit")
        .attr("onclick", "SubmitAddContainer()");
}


function OldSubmitAddContainer()
{
    var N = document.getElementById("ContainersNumber").value,
    StandsNumber = document.getElementById("StandsNumber").value,
    PoolsNumber = document.getElementById("PoolsNumber").value,
    RowsNumber = document.getElementById("RowsNumber").value,
    SectionsNumber = document.getElementById("SectionsNumber").value
    ContainersX = parseFloat(document.getElementById("ContainersX").value),
    ContainersY = parseFloat(document.getElementById("ContainersY").value), 
    a=StandsNumber, b=0, c=0;

    //while(a-->0)
    while(b<PoolsNumber)
    {
        var d = 0;
        var PoolStart = {x:ContainersX+Math.trunc(b/(PoolsNumber/StandsNumber))*(200*RowsNumber+60), y:ContainersY+b%(PoolsNumber/StandsNumber)*((SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30)}
        d3.select("svg")
            .append("svg")
            .attr("width", 30)
            .attr("height", (SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30)
            .attr("x", ContainersX+200*RowsNumber+Math.trunc(b/(PoolsNumber/StandsNumber))*30)
            .attr("y", ContainersY+b%(PoolsNumber/StandsNumber)*((SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30))
            .insert("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "yellow")
            .attr("stroke", "black")
            .insert("text")
            .html("Pool"+ b++)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("transform", "rotate(90, 50, 50)")
        // while(c<RowsNumber)
        while(d<SectionsNumber)
        {
            var i=0;
            var SectionStart = {x: PoolStart.x, y: PoolStart.y + d++*(N/RowsNumber*30+60)}
            while(i<N)
            {
                var innerSVG = d3.select("svg")
                    .append("svg")
                    .attr("width", 200)
                    .attr("height", 30)
                    .attr("x", SectionStart.x + 200*Math.trunc(i/(N/RowsNumber)))
                    .attr("y", SectionStart.y + i%(N/RowsNumber)*30);
                    //.attr("viewBox", "0 0 300 100")
                innerSVG.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#FFEBCD")
                    .attr("stroke", "black");

                innerSVG.append("text")
                    .html("Node")
                    .attr("x", "50%")
                    .attr("y", "50%")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle");
                    i++;
            }
        }
    }

    d3.selectAll("div.carousel")
        .remove();
}





function AddContainer()
{
    alert("addcontainer!");
    d3.select("div.selectImg")
        .remove();
      var i = 0;
      var N = document.getElementById("number").value;
      var xValue = parseFloat(document.getElementById("xValue").value);
      while (i<N)
      {
        Global.current.elems.push({y:300+(i/2-i%2/2)*50, x: xValue+i%2*200, container: true, width: document.getElementById("ContainerWidth").value, info:{type:document.getElementById("TypeInput").value}});
        if (document.getElementById("CheckPool").checked)
          Global.current.elems[Global.current.elems.length-1].info.Pool = parseInt(document.getElementById("StartIndex").value);
        if (document.getElementById("CheckIndex").checked)
          Global.current.elems[Global.current.elems.length-1].info.index = parseInt(document.getElementById("StartIndex").value)+i;
        if (document.getElementById("CheckID").checked)
        {
          calculateID(Global.current.elems[Global.current.elems.length-1], Global.currentlvl, Global.current)
        }
        i++;
      }
      Draw(Global.current, Global.currentlvl);
}

function AddSections()
{
    var N = document.getElementById("SectionsNumber").value,
    i=0;
    while(i<N)
    {
        var innerSVG = d3.select("svg.PoolCon")
            .append("svg")
            .attr("width", 400)
            .attr("height", 30)
            .attr("x", 20)
            .attr("y", 20+i*30);
            //.attr("viewBox", "0 0 300 100")
        innerSVG.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#FFEBCD")
            .attr("stroke", "black");

        innerSVG.append("text")
            .html("Node")
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle");
            i++;
    }
}

function SubmitAddContainer()
{
    var N = document.getElementById("ContainersNumber").value,
    StandsNumber = document.getElementById("StandsNumber").value,
    PoolsNumber = document.getElementById("PoolsNumber").value,
    RowsNumber = document.getElementById("RowsNumber").value,
    SectionsNumber = document.getElementById("SectionsNumber").value
    ContainersX = parseFloat(document.getElementById("ContainersX").value),
    ContainersY = parseFloat(document.getElementById("ContainersY").value), 
    a=StandsNumber, b=0, c=0;

    //while(a-->0)
    while(b<PoolsNumber)
    {
        var d = 0;
        var PoolStart = {x:ContainersX+Math.trunc(b/(PoolsNumber/StandsNumber))*(200*RowsNumber+60), y:ContainersY+b%(PoolsNumber/StandsNumber)*((SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30)}
        d3.select("svg")
            .append("svg")
            .attr("width", 30)
            .attr("height", (SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30)
            .attr("x", ContainersX+200*RowsNumber+Math.trunc(b/(PoolsNumber/StandsNumber))*30)
            .attr("y", ContainersY+b%(PoolsNumber/StandsNumber)*((SectionsNumber-1)*60+SectionsNumber*N/RowsNumber*30))
            .insert("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "yellow")
            .attr("stroke", "black")
            .insert("text")
            .html("Pool"+ b++)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("transform", "rotate(90, 50, 50)")
        // while(c<RowsNumber)
        while(d<SectionsNumber)
        {
            var i=0;
            var SectionStart = {x: PoolStart.x, y: PoolStart.y + d++*(N/RowsNumber*30+60)}
            while(i<N)
            {
                var innerSVG = d3.select("svg")
                    .append("svg")
                    .attr("width", 200)
                    .attr("height", 30)
                    .attr("x", SectionStart.x + 200*Math.trunc(i/(N/RowsNumber)))
                    .attr("y", SectionStart.y + i%(N/RowsNumber)*30);
                    //.attr("viewBox", "0 0 300 100")
                innerSVG.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#FFEBCD")
                    .attr("stroke", "black");

                innerSVG.append("text")
                    .html("Node")
                    .attr("x", "50%")
                    .attr("y", "50%")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle");
                    i++;
            }
        }
    }

    d3.selectAll("div.carousel")
        .remove();
}