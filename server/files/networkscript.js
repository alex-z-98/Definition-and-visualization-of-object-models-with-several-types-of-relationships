document.body.oncontextmenu = function(e){ return false; };

var w=1272,
  h=550,
  wsize=100,
  hsize=60,
  infow=100,
  current=undefined,
  currentlvl=undefined,
  linkFlag=false,
  LinkFilter=[];
  images=["block.png", "door.png", "comut.png", "energy.png", "server.png", "blade2.jpg", "disk.jpg", "comut1.png", "rect.png"],
  types=["Ethernet", "InfinityBand",],
  StartingPoint = {},
  MousePoint = {},
  SelectedBuffer = [],
  SelectedLvl=undefined,
  SelectedLayer = undefined;


var preMODEL={}, preMODELlvl, preMODELnode;

preMODEL.elems=[];
preMODEL.lines=[];


  class Carousel {
    constructor( { width, count, elem } ) {
      this.width = width;
      this.count = count;
      this.elem = elem;
      
      this.list = elem.querySelector('ul');
      this.listElems = elem.querySelectorAll('li');
      
      this.position = 0;
      
      this.prevButton = elem.querySelector('.prev');
      this.nextButton = elem.querySelector('.next');
      
      this.prevButton.onclick = () => this.prevClick();
      this.nextButton.onclick = () => this.nextClick();
    }
    
    
    prevClick() {
        // сдвиг влево
        // последнее передвижение влево может быть не на 3, а на 2 или 1 элемент
        this.position = Math.min(this.position + this.width * this.count, 0)
        this.list.style.marginLeft = this.position + 'px';
    }
    
    nextClick() {
        // сдвиг вправо
        // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
        this.position = Math.max(this.position - this.width * this.count, -this.width * (this.listElems.length - this.count));
        this.list.style.marginLeft = this.position + 'px';
    }
    
  }

//var L0={father: null, elems:[{type:"block", name:"First room", image:"block.png", info:{name:"First room", type:"room", PCquantity:"3"}, x:200, y:200},{type:"block", name:"Second room", image:"block.png", info:{name:"Second room", type:"room", PCquantity:"2"}, x:200, y:100}, {type:"comut", name:"First comut", image:"comut1.png", x:100, y:150}]};
//L0.lines=[{source: L0.elems[2], target: L0.elems[0]}, {source: L0.elems[2], target: L0.elems[1]}];
var MODEL={};

$.get(
  "/config.json",
  {},
  onAjaxSuccess
);
    
function FilterChanged(value)
{
  if (LinkFilter.indexOf(value)!=-1) LinkFilter.splice(LinkFilter.indexOf(value),1);
  else LinkFilter.push(value);
  Draw(current, currentlvl);  
}

function onAjaxSuccess(data)
{
  // Здесь мы получаем данные, отправленные сервером и выводим их на экран.
  //alert(JSON.stringify(data));
  //alert(JSON.parse(JSON.stringify(data)));
  MODEL=JSON.parse(JSON.stringify(data));
  //alert(L0.elems[0].name);
  //L0.lines=[{source: L0.elems[2], target: L0.elems[0]}, {source: L0.elems[2], target: L0.elems[1]}];
  //L1=[{father: L0, elems:[{type:"PC", name:"PC1", image:"block.png", id:11, x:250, y:100}, {type:"PC", name:"PC2", image:"block.png", id:12, x:100, y:100}, {type:"PC", name:"PC3", image:"block.png", id:13, x:400, y:100}]},
    //    {father: L0, elems:[{type:"PC", name:"PC1", image:"block.png", id:21, x:400, y:100}, {type:"PC", name:"PC2", image:"block.png", id:22, x:150, y:100}]}];

  //MODEL[0][0].elems[0].child=0;
  //MODEL[0][0].elems[1].child=1;
  // L1[0].lines=[],
  // L1[1].lines=[];
  Draw(MODEL[0][0], 0);
}

function SaveMODEL()
{
  preMODEL.father=current.father;
  preMODEL.elems=[];
  preMODEL.lines=[];
  for (var key in current.elems)
  {
    preMODEL.elems[key]={};
    for (var item in current.elems[key])
    {
      //alert(item);
      preMODEL.elems[key][item]=current.elems[key][item];
    } 
  } 
  for (var key in current.lines)
  {
    preMODEL.lines[key]={};
    for (var item in current.lines[key])
    {
      preMODEL.lines[key][item]=current.lines[key][item];
    }
  }
  preMODELlvl=currentlvl;
  preMODELnode=MODEL[currentlvl].indexOf(current);
}

function AddObject()
{
  d3.select("div.carousel")
    .remove();

  d3.selectAll("fieldset")
    .remove();

  document.getElementById('Undo').disabled=false;
  SaveMODEL();

  var carousel=d3.select("div.canvas")
                .append("div")
                .attr("id", "carousel")
                .attr("class", "carousel");

  carousel.append("button")
          .attr("class", "arrow prev")
          .html("⇦");

  var ul=carousel.append("div")
    .attr("class", "gallery")
    .append("ul")
    .attr("class", "images");

  ul.selectAll("li")
    .data(images)
    .enter()
    .append("li")
    .append("img")
    .attr("src", function(d){return d;})
    .on("click", function(d){
      d3.select("div.selectImg")
        .remove();
      current.elems.push({image:d, x:300, y:250});
      Draw(current, currentlvl);  
    });

  carousel.append("button")
        .attr("class", "arrow next")
        .html("⇨");

  let car = new Carousel( {
    width: 130,
    count: 3,
    elem: document.getElementById('carousel')
  } );

  //current.elems.push({image:"block.png", x:300, y:250});
  //Draw(current, currentlvl);
}

function AddLink()
{
  SaveMODEL();

  d3.selectAll("image")
    .on("click", function(d){
      linkFlag =! linkFlag;
      //alert(d.name);
      if (linkFlag)
      {
        var tp;
        var LT=document.getElementsByName("LinkType"); 
        for(var i=0; i<LT.length; i++) 
          if (LT[i].checked) 
           tp=types[i];
        current.lines.push({source: current.elems.indexOf(d), target: current.elems.indexOf(d), type: tp})
        d3.select(this)
          .attr("width", wsize+6)
          .attr("height", hsize+6)
          .attr("x", function(d){return d.x-3})
          .attr("y", function(d){return d.y-3});
      }
      else
      {
        current.lines[current.lines.length-1].target=current.elems.indexOf(d);
        Draw(current, currentlvl);
      }
    })
  document.getElementById('Undo').disabled=false;
}

function SearchID(value)
{
  MODEL.forEach(function(item, i, arr){
      item.forEach(function(item0, i0, arr0){
          item0.elems.forEach(function(item1, i1, arr1){
              if(item1.id==value)
              {
                  Draw(MODEL[i][i0], i, i1);
                  return 0;
              }
          })
      })})
}

function ApplyChanges(d)
{
  var i=0;
  d.info={};
  var propertyRaws = document.getElementsByTagName("p");
  while (propertyRaws.item(i)!=null)
  {
    //alert(propertyRaws[i].getElementsByClassName("name")[0].value);
    newkey = propertyRaws[i].getElementsByClassName("name")[0].value;
    valuekey = propertyRaws[i].getElementsByClassName("value")[0].value;
    if (newkey != "") d.info[newkey]=valuekey;
    i++;
  }
  d3.selectAll("div.tabl")
    .remove();

  var tab = d3.selectAll("div.canvas")
    .append("div")
    .attr("class", "tabl")
    .append("table")
    .attr("class", "table")
    .attr("border", "1")
    .attr("width", 200);

  d3.select("div.tabl")
    .append("button")
    .attr("class", "close")
    .html("x")
    .attr("onclick", "d3.selectAll('div.tabl').remove();");

  var row=tab.append("tr");

    row.append("th")
      .html("Name");
    
    row.append("th")
      .html("Value");

  for (var key in d.info)
  {
    row=tab.append("tr");

    row.append("td")
      .html(key);

    row.append("td")
      .html(d.info[key]);
  };

  d3.select("div.tabl")
    .append("button")
    .html("Change")
    .on("click", function(c){Change(d)});
}

function AddProperty()
{
  var row = d3.select("fieldset.infoRed")
    .append("p")
    .attr("class", "c");

  row.append("input")
    .attr("placeholder", "name")
    .attr("class", "name");

  row.append("input")
    .attr("placeholder", "value")
    .attr("class", "value");

  row.append("span")
    .attr("class", "close-popup")
    .html("&times")
    .attr("onclick", "CloseRow(this)");

  d3.selectAll("button.apply")
    .raise();
}

function CloseRow(e)
{
  e.parentNode.parentNode.removeChild(e.parentNode);
}

function Change(d)
{
  d3.select("div.carousel")
    .remove();

  d3.selectAll("fieldset")
    .remove();

  K=d;

  var infoRed=d3.select("div.canvas")
    .append("fieldset")
    .attr("class", "infoRed");
    
  infoRed.append("legend")
    .html("Enter information:");

  for (var key in d.info)
  {
    var row=infoRed.append("p").attr("class", "c");

    row.append("input")
      .attr("value", key)
      .attr("class", "name");

    row.append("input")
      .attr("value", d.info[key])
      .attr("class", "value");

    row.append("span")
      .attr("class", "close-popup")
      .html("&times")
      .attr("onclick", "CloseRow(this)");

    //infoRed.append("br");
  }

  infoRed.append("button")
          .attr("class", "close")
          .html("x")
          .attr("onclick", "d3.selectAll('fieldset').remove();");

  infoRed.append("button")
          .html("Apply")
          .attr("class", "apply")
          .attr("onclick", "ApplyChanges(K)");

  infoRed.append("button")
          .html("Add Property")
          .attr("class", "apply")
          .attr("onclick", "AddProperty()");
          
}

function Save()
{
  //alert(JSON.stringify(L0));
  var request = new XMLHttpRequest();
  request.open("POST", "config.json", true);
  request.send(JSON.stringify(MODEL, "", 4));
}

function Undo()
{
  //alert(preMODELlvl);
  //alert(preMODELnode);
  MODEL[preMODELlvl][preMODELnode].elems=[];
  MODEL[preMODELlvl][preMODELnode].lines=[];
  for (var key in preMODEL.elems)
    MODEL[preMODELlvl][preMODELnode].elems[key]=preMODEL.elems[key];  
  for (var key in preMODEL.lines)
    MODEL[preMODELlvl][preMODELnode].lines[key]=preMODEL.lines[key];
  MODEL[preMODELlvl][preMODELnode].lines = MODEL[preMODELlvl][preMODELnode].lines.filter(function(x) {
    return x !== undefined && x !== null; 
  });
  MODEL[preMODELlvl][preMODELnode].elems = MODEL[preMODELlvl][preMODELnode].elems.filter(function(x) {
    return x !== undefined && x !== null; 
  });
  document.getElementById('Undo').disabled=true;
  Draw(MODEL[preMODELlvl][preMODELnode], preMODELlvl);
}

function CopyLevels(L, LvlIndex, father, IterSelectedLayer)
{
  L.father=father;
  L.elems.forEach(element => {
    if (element.child!=undefined)
    {
      var TmpLvl=JSON.parse(JSON.stringify(MODEL[IterSelectedLayer+1][element.child]));
      if (MODEL[LvlIndex+1] == undefined) MODEL.push([]);
      MODEL[LvlIndex+1].push(TmpLvl);
      element.child=MODEL[LvlIndex+1].length-1;
      CopyLevels(TmpLvl, LvlIndex+1, MODEL[LvlIndex].indexOf(L), IterSelectedLayer+1);
    }
  });
}

function Draw(L, Lindex, i=-1)
{
    current=L;
    currentlvl=Lindex;

    d3.selectAll("input.back")
            .remove();


    d3.selectAll("div.canvas")
        .remove();
    
    var svg=d3.selectAll("body")
          .append("div")
          .attr("class", "canvas")
          .append("svg")
          .attr("width", w)
          .attr("height", h);



    svg.call(d3.drag().on("drag", function(){
      svg.select(".selection")
        .remove();
      if (StartingPoint.x == undefined)
      {
        StartingPoint.x = d3.mouse(this)[0];
        StartingPoint.y = d3.mouse(this)[1];
      }
      svg.append("polygon")
        .attr("class", "selection")
        .attr("points", function(){return d3.mouse(this)[0]+","+d3.mouse(this)[1]+" "+d3.mouse(this)[0]+","+StartingPoint.y+" "+StartingPoint.x+","+StartingPoint.y+" "+StartingPoint.x+","+d3.mouse(this)[1]})
        .attr("fill", "rgb(0,0,200)")
        .attr("stroke", "blue")
        .attr("fill-opacity", 0.15);

      MousePoint.x = d3.mouse(this)[0];
      MousePoint.y = d3.mouse(this)[1];
    })
    .on("end", function(){
      SelectedBuffer = [];
      SelectedLvl = current;
      SelectedLayer = currentlvl;
      //var i=0;
      L.elems.forEach(element => {
        if(element.x<Math.max(MousePoint.x, StartingPoint.x)&&element.x>Math.min(MousePoint.x, StartingPoint.x)&&element.y<Math.max(MousePoint.y, StartingPoint.y)&&element.y>Math.min(MousePoint.y, StartingPoint.y))
        {
          SelectedBuffer.push(element);
        }
      });
      svg.select(".selection")
        .remove();
      StartingPoint = {};
    }));

    d3.select("body").on("keydown", function(){
      var TmpBuffer=[];
      if (SelectedBuffer.length)
      {
        SelectedBuffer.forEach(element => {
          var tmp={};
          var TmpLvl={};
          Object.assign(tmp, element);
          if (element.child != undefined) 
          {
            TmpLvl=JSON.parse(JSON.stringify(MODEL[SelectedLayer+1][element.child]));
            if (MODEL[Lindex+1] == undefined) MODEL.push([]);
            tmp.child=MODEL[Lindex+1].length;
            MODEL[Lindex+1].push(TmpLvl);
            CopyLevels(MODEL[Lindex+1][tmp.child], Lindex+1, MODEL[Lindex].indexOf(L), SelectedLayer+1);
          }
          tmp.copy=true;
          TmpBuffer.push(tmp);
        });
        SelectedLvl.lines.forEach(element => {
          if (SelectedBuffer.includes(SelectedLvl.elems[element.target])&&SelectedBuffer.includes(SelectedLvl.elems[element.source]))
            current.lines.push({source: current.elems.length+SelectedBuffer.indexOf(SelectedLvl.elems[element.source]), target: current.elems.length+SelectedBuffer.indexOf(SelectedLvl.elems[element.target])})
        });
        TmpBuffer.forEach(element => {
          current.elems.push(element);
        });
        Draw(L, Lindex);
      }
    })


    if (i!=-1 && L.elems[i].hide!=true)
    {
        svg.append("rect")
            .attr("class", "searched")
            .attr("x", L.elems[i].x-5)
            .attr("y", L.elems[i].y-5)
            .attr("stroke", "blue")
            .attr("fill", "rgb(0,0,200)")
            .attr("fill-opacity", 0.15)
            .attr("stroke-opacity", 0.5)
            .attr("width", wsize+10)
            .attr("height", hsize+10);
    }

      svg.selectAll("line.connect")
      .data(L.lines)
      .enter()
      .append("line")
      .attr("class", function(d){ if (d.hide==true) return "hide"; return "connect";})
      .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+wsize/2})
      .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+hsize/2})
      .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+wsize/2})
      .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+hsize/2})
      .attr("stroke", function(d){if (LinkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
      .attr("type", function(d){return d.type});

      svg.selectAll("line.opacity")
      .data(L.lines)
      .enter()
      .append("line")
      .attr("class", function(d){ if (d.hide==true) return "hide"; return "opacity";})
      .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+wsize/2})
      .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+hsize/2})
      .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+wsize/2})
      .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+hsize/2})
      .attr("stroke", function(d){if (LinkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
      .attr("stroke-width", function(d){return 8})
      .attr("stroke-opacity", function(d){return 0})
      .attr("type", function(d){return d.type})
      .on("mouseover", function(d){
        svg.append("text")
        .attr("x", function(){ return (event.target.x2.baseVal.value+event.target.x1.baseVal.value)/2;})
        .attr("y", function(){ return (event.target.y2.baseVal.value+event.target.y1.baseVal.value)/2;})
        .attr("id", "LinkDescription")
        .html(d.type);
      })
      .on("mouseout", function(){
        svg.selectAll("text")
          .remove();
      });
    
    var object=svg.selectAll("image")
        .data(L.elems)
        .enter()
        .append("image")
        .attr("class", function(d){ if (d.hide==true) return "hide"; return d.type;})
        .attr("xlink:href", function(d){return d.image;})
        .attr("x", function(d){ return d.x;})
        .attr("y", function(d){ return d.y;})
        .attr("width", function(d){ if (d.image=="comut1.png" || d.image=="rect.png") return 10; return wsize;})
        .attr("height", function(d){ if (d.image=="comut1.png" || d.image=="rect.png") return 6; return hsize;})
        .on("click", function(d){
          if (d3.event.ctrlKey)
          {
            SaveMODEL();
            L.lines.forEach(function(item, i, arr){
              if (item.source==L.elems.indexOf(d) || item.target==L.elems.indexOf(d))
              {
                item.hide=true;
              }
            });
            svg.selectAll("line")
              .attr("class", function(d){if (d.hide==true) return "hide"})

            svg.selectAll(".hide")
              .remove();
            
            d.hide=true;
            
            d3.select(this)
              .attr("class", "hide")
              .remove();

            svg.selectAll(".searched")
                .remove();

            
            document.getElementById('Undo').disabled=false;
          }
          else if (d3.event.altKey)
          {
            if (MODEL[Lindex+1]==undefined) MODEL[Lindex+1]=[];
            MODEL[Lindex+1].push({father:MODEL[Lindex].indexOf(L), elems:[], lines:[]});
            d.child=MODEL[Lindex+1].length-1;
            Draw(MODEL[Lindex+1][MODEL[Lindex+1].length-1], Lindex+1);
          }
          else if (d3.event.shiftKey)
          {
            var tmp={};
            var TmpLvl={};
            Object.assign(tmp, d);
            if (d.child != undefined) TmpLvl=JSON.parse(JSON.stringify(MODEL[Lindex+1][d.child]));
            tmp.copy=true;
            if (d.child!=undefined) tmp.child=MODEL[Lindex+1].length;
            current.elems.push(tmp);
            MODEL[Lindex+1].push(TmpLvl);
            if (d.child!=undefined) CopyLevels(MODEL[Lindex+1][tmp.child], Lindex+1, MODEL[Lindex].indexOf(L), Lindex+1);
            Draw(L, Lindex);
          }
          else{
            if(d.child!=undefined)
                Draw(MODEL[Lindex+1][d.child], Lindex+1);}})
        .on("contextmenu", function(d){
          
          d3.selectAll("div.tabl")
            .remove();

          var tab = d3.selectAll("div.canvas")
            .append("div")
            .attr("class", "tabl")
            .append("table")
            .attr("class", "table")
            .attr("border", "1")
            .attr("width", 200);

          d3.select("div.tabl")
            .append("button")
            .attr("class", "close")
            .html("x")
            .attr("onclick", "d3.selectAll('div.tabl').remove();");

          var row=tab.append("tr");

            row.append("th")
              .html("Name");
            
            row.append("th")
              .html("Value");

          for (var key in d.info)
          {
            row=tab.append("tr");

            row.append("td")
              .html(key);

            row.append("td")
              .html(d.info[key]);
          };

          d3.select("div.tabl")
            .append("button")
            .html("Change")
            .on("click", function(c){Change(d)});
        })
        .call(d3.drag().on("drag", function(d){
              d3.select(this)
                .raise()
                .attr("x", d.x = d3.event.x)
                .attr("y", d.y = d3.event.y);
                
                svg.selectAll("line")
                  .remove();

                svg.selectAll(".searched")
                  .remove();

                svg.selectAll("line.opacity")
                  .data(L.lines)
                  .enter()
                  .append("line")
                  .attr("class", function(d){ if (d.hide==true) return "hide"; return "opacity";})
                  .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+wsize/2})
                  .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+hsize/2})
                  .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+wsize/2})
                  .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+hsize/2})
                  .attr("stroke", function(d){if (LinkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
                  .attr("stroke-width", function(d){return 8})
                  .attr("stroke-opacity", function(d){return 0})
                  .attr("type", function(d){return d.type})
                  .on("mouseover", function(d){
                    svg.append("text")
                    .attr("x", function(){ return (event.target.x2.baseVal.value+event.target.x1.baseVal.value)/2;})
                    .attr("y", function(){ return (event.target.y2.baseVal.value+event.target.y1.baseVal.value)/2;})
                    .attr("id", "LinkDescription")
                    .html(d.type);
                  })
                  .on("mouseout", function(){
                    svg.selectAll("text")
                      .remove();
                  })
                  .lower();


                svg.selectAll("line.connect")
                .data(L.lines)
                .enter()
                .append("line")
                .attr("class", function(d){ if (d.hide==true) return "hide"; return "connect";})
                .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+wsize/2})
                .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+hsize/2})
                .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+wsize/2})
                .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+hsize/2})
                .attr("stroke", function(d){if (LinkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
                .attr("type", function(d){return d.type})
                .lower();
              
                svg.selectAll(".hide")
                  .remove();
              }));

    if(L.father!=null){
        F=MODEL[Lindex-1][L.father];
        Lfather=Lindex-1;
        d3.selectAll("div.canvas")
              .append("input")
              .attr("class", "back")
              .attr("value", "<Back")
              .attr("onclick", "Draw(F, Lfather)")
              .attr("type", "button")
              .lower();}

    svg.selectAll(".hide")
      .remove();
}