document.body.oncontextmenu = function(e){ return false; };

// var Global.w=1272,
//   Global.h=550,
//   Global.wsize=100,
//   Global.hsize=60,
//   infow=100,
//   Global.current=undefined,
//   Global.currentlvl=undefined,
//   Global.linkFlag=false,
   Global.linkFilter=[];
//   Global.images=["block.png", "door.png", "comut.png", "energy.png", "server.png", "blade2.jpg", "disk.jpg", "comut1.png", "rect.png", "NetCol8000.jfif"],
//   Global.types=["Ethernet", "InfiniBand",],
   Global.StartingPoint = {},
   Global.MousePoint = {},
   Global.SelectedBuffer = [],
//   Global.SelectedLvl=undefined,
//   Global.SelectedLayer = undefined;


Global.PreMODEL={}, Global.PreMODELlvl, Global.PreMODELnode;

 Global.PreMODEL.elems=[];
 Global.PreMODEL.lines=[];


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


Global.MODEL={};


$.get(
  "/config.json",
  {},
  onAjaxSuccess
);
    
function FilterChanged(value)
{
  if (Global.linkFilter.indexOf(value)!=-1) Global.linkFilter.splice(Global.linkFilter.indexOf(value),1);
  else Global.linkFilter.push(value);
  Draw(Global.current, Global.currentlvl);  
}

function onAjaxSuccess(data)
{
  // Здесь мы получаем данные, отправленные сервером и выводим их на экран.
  //alert(JSON.stringify(data));
  //alert(JSON.parse(JSON.stringify(data)));
  Global.MODEL=JSON.parse(JSON.stringify(data));
  //alert(L0.elems[0].name);
  //L0.lines=[{source: L0.elems[2], target: L0.elems[0]}, {source: L0.elems[2], target: L0.elems[1]}];
  //L1=[{father: L0, elems:[{type:"PC", name:"PC1", image:"block.png", id:11, x:250, y:100}, {type:"PC", name:"PC2", image:"block.png", id:12, x:100, y:100}, {type:"PC", name:"PC3", image:"block.png", id:13, x:400, y:100}]},
    //    {father: L0, elems:[{type:"PC", name:"PC1", image:"block.png", id:21, x:400, y:100}, {type:"PC", name:"PC2", image:"block.png", id:22, x:150, y:100}]}];

  //Global.MODEL[0][0].elems[0].child=0;
  //Global.MODEL[0][0].elems[1].child=1;
  // L1[0].lines=[],
  // L1[1].lines=[];
  Draw(Global.MODEL[0][0], 0);
}

function SaveMODEL()
{
  Global.PreMODEL.father=Global.current.father;
  Global.PreMODEL.elems=[];
  Global.PreMODEL.lines=[];
  for (var key in Global.current.elems)
  {
    Global.PreMODEL.elems[key]={};
    for (var item in Global.current.elems[key])
    {
      //alert(item);
      Global.PreMODEL.elems[key][item]=Global.current.elems[key][item];
    } 
  } 
  for (var key in Global.current.lines)
  {
    Global.PreMODEL.lines[key]={};
    for (var item in Global.current.lines[key])
    {
      Global.PreMODEL.lines[key][item]=Global.current.lines[key][item];
    }
  }
  Global.PreMODELlvl=Global.currentlvl;
  Global.PreMODELnode=Global.MODEL[Global.currentlvl].indexOf(Global.current);
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
    .attr("class", "Global.images");

  ul.selectAll("li")
    .data(Global.images)
    .enter()
    .append("li")
    .append("img")
    .attr("src", function(d){return d;})
    .on("click", function(d){
      d3.select("div.selectImg")
        .remove();
      var i = 0;
      var N = document.getElementById("number").value;
      var xValue = parseFloat(document.getElementById("xValue").value);
      while (i<N)
      {
        Global.current.elems.push({image:d, y:300+(i/2-i%2/2)*50, x: xValue+i%2*200, info:{}});
        if (document.getElementById("CheckPool").checked)
          Global.current.elems[Global.current.elems.length-1].info.Pool = parseInt(document.getElementById("StartIndex").value);
        if (document.getElementById("CheckIndex").checked)
          Global.current.elems[Global.current.elems.length-1].info.index = parseInt(document.getElementById("StartIndex").value)+i;
        i++;
      }
      Draw(Global.current, Global.currentlvl);  
    });

  carousel.append("button")
        .attr("class", "arrow next")
        .html("⇨");

  var div = carousel.append("div");
    
  div.append("input")
    .attr("type", "search")
    .attr("placeholder", "Number")
    .attr("id", "number")
    .attr("value", 1);

  div.append("input")
    .attr("type", "search")
    .attr("placeholder", "Number")
    .attr("id", "xValue")
    .attr("value", 250);

  var p =div.append("p");

  p.append("input")
    .attr("type", "search")
    .attr("id", "StartIndex")
    .attr("disabled", "true");

  p.append("input")
    .attr("type", "checkbox")
    .attr("id", "CheckIndex")
    .attr("onchange", "document.getElementById('StartIndex').disabled = !this.checked");

  p.append("label")
    .html("Index");

  var p =div.append("p");

  p.append("input")
    .attr("type", "search")
    .attr("id", "PoolInit")
    .attr("disabled", "true");

  p.append("input")
    .attr("type", "checkbox")
    .attr("id", "CheckPool")
    .attr("onchange", "document.getElementById('PoolInit').disabled = !this.checked");

  p.append("label")
    .html("Pool");

  let car = new Carousel( {
    width: 130,
    count: 3,
    elem: document.getElementById('carousel')
  } );

  //Global.current.elems.push({image:"block.png", x:300, y:250});
  //Draw(Global.current, Global.currentlvl);
}

function AddLink()
{
  SaveMODEL();

  d3.selectAll("image")
    .on("click", function(d){
      Global.linkFlag =! Global.linkFlag;
      //alert(d.name);
      if (Global.linkFlag)
      {
        var tp;
        var LT=document.getElementsByName("LinkType"); 
        for(var i=0; i<LT.length; i++) 
          if (LT[i].checked) 
           tp=Global.types[i];
        Global.current.lines.push({source: Global.current.elems.indexOf(d), target: Global.current.elems.indexOf(d), type: tp})
        d3.select(this)
          .attr("width", Global.wsize+6)
          .attr("height", Global.hsize+6)
          .attr("x", function(d){return d.x-3})
          .attr("y", function(d){return d.y-3});
      }
      else
      {
        Global.current.lines[Global.current.lines.length-1].target=Global.current.elems.indexOf(d);
        Draw(Global.current, Global.currentlvl);
      }
    })
  document.getElementById('Undo').disabled=false;
}

function SearchID(value)
{
  Global.MODEL.forEach(function(item, i, arr){
      item.forEach(function(item0, i0, arr0){
          item0.elems.forEach(function(item1, i1, arr1){
              if(item1.id==value)
              {
                  Draw(Global.MODEL[i][i0], i, i1);
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
  request.send(JSON.stringify(Global.MODEL, "", 4));
}

function Undo()
{
  //alert(Global.PreMODELlvl);
  //alert(Global.PreMODELnode);
  Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].elems=[];
  Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].lines=[];
  for (var key in Global.PreMODEL.elems)
    Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].elems[key]=Global.PreMODEL.elems[key];  
  for (var key in Global.PreMODEL.lines)
    Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].lines[key]=Global.PreMODEL.lines[key];
  Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].lines = Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].lines.filter(function(x) {
    return x !== undefined && x !== null; 
  });
  Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].elems = Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode].elems.filter(function(x) {
    return x !== undefined && x !== null; 
  });
  document.getElementById('Undo').disabled=true;
  Draw(Global.MODEL[Global.PreMODELlvl][Global.PreMODELnode], Global.PreMODELlvl);
}

function CopyLevels(L, LvlIndex, father, IterSelectedLayer)
{
  L.father=father;
  L.elems.forEach(element => {
    if (element.child!=undefined)
    {
      var TmpLvl=JSON.parse(JSON.stringify(Global.MODEL[IterSelectedLayer+1][element.child]));
      if (Global.MODEL[LvlIndex+1] == undefined) Global.MODEL.push([]);
      Global.MODEL[LvlIndex+1].push(TmpLvl);
      element.child=Global.MODEL[LvlIndex+1].length-1;
      CopyLevels(TmpLvl, LvlIndex+1, Global.MODEL[LvlIndex].indexOf(L), IterSelectedLayer+1);
    }
  });
}

function ChangeView()
{
  ShawHierarchy();
}

function ShawHierarchy()
{
  d3.select("div.canvas")
    .remove();
  
  var l=0;
  var max=0;

  Global.MODEL.forEach(element =>{
    if (max<element.length) max=element.length;
  })

  var HiWidth=max*120;

  var svg=d3.selectAll("body")
    .append("div")
    .attr("class", "canvas")
    .append("svg")
    .attr("width", HiWidth)
    .attr("height", Global.h);

  Global.MODEL.forEach(element =>{
    var i=0;
    var CurStep = HiWidth/(element.length+1);
    element.forEach(elem =>{
      svg.append("rect")
        .attr("x", CurStep*++i)//100+i++*110)
        .attr("y", 100+l*100)
        .attr("width", 100)
        .attr("height", 50);
    })
    l++;
  }) 
}

function Draw(L, Lindex, i=-1)
{
    Global.current=L;
    Global.currentlvl=Lindex;

    d3.selectAll("input.back")
            .remove();


    d3.selectAll("div.canvas")
        .remove();
    
    var svg=d3.selectAll("body")
          .append("div")
          .attr("class", "canvas")
          .append("svg")
          .attr("width", Global.w)
          .attr("height", Global.h);

    svg.on("mousemove", function(){
      Global.Mouse.x=event.pageX;
      Global.Mouse.y=event.pageY; 
    })

    svg.call(d3.drag().on("drag", function(){
      svg.select(".selection")
        .remove();
      if (Global.StartingPoint.x == undefined)
      {
        Global.StartingPoint.x = d3.mouse(this)[0];
        Global.StartingPoint.y = d3.mouse(this)[1];
      }
      svg.append("polygon")
        .attr("class", "selection")
        .attr("points", function(){return d3.mouse(this)[0]+","+d3.mouse(this)[1]+" "+d3.mouse(this)[0]+","+Global.StartingPoint.y+" "+Global.StartingPoint.x+","+Global.StartingPoint.y+" "+Global.StartingPoint.x+","+d3.mouse(this)[1]})
        .attr("fill", "rgb(0,0,200)")
        .attr("stroke", "blue")
        .attr("fill-opacity", 0.15);

      Global.MousePoint.x = d3.mouse(this)[0];
      Global.MousePoint.y = d3.mouse(this)[1];
    })
    .on("end", function(){
      //alert("Drag Ended")
      L.elems.forEach(element => {
        element.selected = false;
      });
      Global.SelectedBuffer = [];
      Global.SelectedLvl = Global.current;
      Global.SelectedLayer = Global.currentlvl;
      //var i=0;
      L.elems.forEach(element => {
        if(element.x<Math.max(Global.MousePoint.x, Global.StartingPoint.x)&&element.x>Math.min(Global.MousePoint.x, Global.StartingPoint.x)&&element.y<Math.max(Global.MousePoint.y, Global.StartingPoint.y)&&element.y>Math.min(Global.MousePoint.y, Global.StartingPoint.y))
        {
          element.selected = true;
          Global.SelectedBuffer.push(element);
        }
      });
      svg.select(".selection")
        .remove();
      Global.StartingPoint = {};
    }));

    d3.select("body").on("keydown", function(){
      //alert(d3.event.keyCode);
      if(d3.event.keyCode == 67 || d3.event.keyCode>=48 && d3.event.keyCode<=57)
      {
        var TmpBuffer=[];
        var minX = Global.w, minY = Global.h;
        Global.SelectedBuffer.forEach(element => {
          if(element.x<minX)
            minX = element.x;
          if(element.y<minY)
            minY = element.y;
        });
      //alert("Keydown")
      if (Global.SelectedBuffer.length)
      {
        Global.SelectedBuffer.forEach(element => {
          var tmp={};
          var TmpLvl={};
          Object.assign(tmp, element);
          if (element.child != undefined) 
          {
            TmpLvl=JSON.parse(JSON.stringify(Global.MODEL[Global.SelectedLayer+1][element.child]));
            if (Global.MODEL[Lindex+1] == undefined) Global.MODEL.push([]);
            tmp.child=Global.MODEL[Lindex+1].length;
            Global.MODEL[Lindex+1].push(TmpLvl);
            CopyLevels(Global.MODEL[Lindex+1][tmp.child], Lindex+1, Global.MODEL[Lindex].indexOf(L), Global.SelectedLayer+1);
          }
          tmp.copy=true;
          TmpBuffer.push(tmp);
        });
        Global.SelectedLvl.lines.forEach(element => {
          if (Global.SelectedBuffer.includes(Global.SelectedLvl.elems[element.target])&&Global.SelectedBuffer.includes(Global.SelectedLvl.elems[element.source]))
            Global.current.lines.push({source: Global.current.elems.length+Global.SelectedBuffer.indexOf(Global.SelectedLvl.elems[element.source]), target: Global.current.elems.length+Global.SelectedBuffer.indexOf(Global.SelectedLvl.elems[element.target])})
        });
        TmpBuffer.forEach(element => {
          Global.current.elems.push(element);
          if(d3.event.keyCode>=48 && d3.event.keyCode<=57) Global.current.elems[Global.current.elems.length-1].info.Pool = d3.event.keyCode - 48;
          element.x = Global.Mouse.x + element.x - minX;
          element.y = Global.Mouse.y + element.y - minY;
        });
        Draw(L, Lindex);
      }
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
            .attr("width", Global.wsize+10)
            .attr("height", Global.hsize+10);
    }

      svg.selectAll("line.connect")
      .data(L.lines)
      .enter()
      .append("line")
      .attr("class", function(d){ if (d.hide==true) return "hide"; return "connect";})
      .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+Global.wsize/2})
      .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+Global.hsize/2})
      .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+Global.wsize/2})
      .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+Global.hsize/2})
      .attr("stroke", function(d){if (Global.linkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#000000"})
      .attr("type", function(d){return d.type});

      svg.selectAll("line.opacity")
      .data(L.lines)
      .enter()
      .append("line")
      .attr("class", function(d){ if (d.hide==true) return "hide"; return "opacity";})
      .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+Global.wsize/2})
      .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+Global.hsize/2})
      .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+Global.wsize/2})
      .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+Global.hsize/2})
      .attr("stroke", function(d){if (Global.linkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
      .attr("stroke-width", function(d){return 8})
      .attr("stroke-opacity", function(d){return 0})
      .attr("type", function(d){return d.type})
      .on("mouseover", function(d){
        svg.append("text")
        .attr("class", "definition")
        .attr("x", function(){ return (event.target.x2.baseVal.value+event.target.x1.baseVal.value)/2;})
        .attr("y", function(){ return (event.target.y2.baseVal.value+event.target.y1.baseVal.value)/2;})
        .attr("id", "LinkDescription")
        .html(d.type);
      })
      .on("mouseout", function(){
        svg.selectAll("text.definition")
          .remove();
      });
    
    var object=svg.selectAll("image")
        .data(L.elems)
        .enter()
        .append("image")
        .attr("id", function(d){ if(d.id) return d.id; })
        .attr("class", function(d){ if (d.hide==true) return "hide"; return d.type;})
        .attr("href", function(d){return d.image;})
        .attr("x", function(d){ return d.x;})
        .attr("y", function(d){ return d.y;})
        .attr("width", function(d){ if (d.image=="comut1.png" || d.image=="rect.png") return 10; return Global.wsize;})
        .attr("height", function(d){ if (d.image=="comut1.png" || d.image=="rect.png") return 6; return Global.hsize;})
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
            if (Global.MODEL[Lindex+1]==undefined) Global.MODEL[Lindex+1]=[];
            Global.MODEL[Lindex+1].push({father:Global.MODEL[Lindex].indexOf(L), elems:[], lines:[]});
            d.child=Global.MODEL[Lindex+1].length-1;
            Draw(Global.MODEL[Lindex+1][Global.MODEL[Lindex+1].length-1], Lindex+1);
          }
          else if (d3.event.shiftKey)
          {
            var tmp={};
            var TmpLvl={};
            Object.assign(tmp, d);
            if (d.child != undefined) TmpLvl=JSON.parse(JSON.stringify(Global.MODEL[Lindex+1][d.child]));
            tmp.copy=true;
            if (d.child!=undefined) tmp.child=Global.MODEL[Lindex+1].length;
            Global.current.elems.push(tmp);
            Global.MODEL[Lindex+1].push(TmpLvl);
            if (d.child!=undefined) CopyLevels(Global.MODEL[Lindex+1][tmp.child], Lindex+1, Global.MODEL[Lindex].indexOf(L), Lindex+1);
            Draw(L, Lindex);
          }
          else{
            if(d.child!=undefined)
                Draw(Global.MODEL[Lindex+1][d.child], Lindex+1);}})
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
              var StartX = d.x,
              StartY = d.y;
          

              


              if(!d.selected)
               d3.select(this)
                .raise()
                .attr("x", d.x = Math.round(d3.event.x/20)*20)
                .attr("y", d.y = Math.round(d3.event.y/20)*20);
              else
                svg.selectAll("image")
                .attr("x", function(d){if(d.selected==true){return d.x = d3.event.x + (d.x-StartX)} return d.x})
                .attr("y", function(d){if(d.selected==true){return d.y = d3.event.y + (d.y - StartY)} return d.y})
                .lower();




                
                svg.selectAll("line")
                  .remove();

                svg.selectAll(".searched")
                  .remove();

                svg.selectAll("line.opacity")
                  .data(L.lines)
                  .enter()
                  .append("line")
                  .attr("class", function(d){ if (d.hide==true) return "hide"; return "opacity";})
                  .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+Global.wsize/2})
                  .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+Global.hsize/2})
                  .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+Global.wsize/2})
                  .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+Global.hsize/2})
                  .attr("stroke", function(d){if (Global.linkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#ccc"})
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
                .attr("x1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].x+5; return L.elems[d.source].x+Global.wsize/2})
                .attr("y1", function(d){if (L.elems[d.source].image=="rect.png" || L.elems[d.source].image=="comut1.png") return L.elems[d.source].y+3; return L.elems[d.source].y+Global.hsize/2})
                .attr("x2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].x+5; return L.elems[d.target].x+Global.wsize/2})
                .attr("y2", function(d){if (L.elems[d.target].image=="rect.png" || L.elems[d.target].image=="comut1.png") return L.elems[d.target].y+3; return L.elems[d.target].y+Global.hsize/2})
                .attr("stroke", function(d){if (Global.linkFilter.indexOf(d.type)!=-1) return "#5b92e5"; return "#000000"})
                .attr("type", function(d){return d.type})
                .lower();
              
                svg.selectAll(".hide")
                  .remove();
              }));

    if(L.father!=null){
        F=Global.MODEL[Lindex-1][L.father];
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

    CheckStates();
}