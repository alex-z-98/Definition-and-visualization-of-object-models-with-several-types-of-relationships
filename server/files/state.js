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