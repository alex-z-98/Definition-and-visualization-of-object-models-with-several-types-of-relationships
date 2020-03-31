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