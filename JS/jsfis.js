

var vecimg=[], vecmsg=[], veccursor=[], cutie, vecflori=[], vecom=[],vecmuz=[], comanda;
var tipsel=[], tip=1, niveldif=-1;
var nrfloritip=[], vecfloricomanda=[]; //vector nrfloritip care retine cate flori am din fiecare tip
var tasta, vit, scor=0,okgen;
var vieti=cst.nrvieti, okup,canta;
var genptr, vecptr=[], plici, overplici=0;

//clasa Obj (loader) care primeste ca param arborele xml
function Obj(xml){
    var x=xml; //variabila privata, pentru a retine in clasa arborele xml, altfel s-ar pierde
    this.getImg=function (id){
        var imm=x.find("#"+id); //caut in xml tag-ul cu id-ul dat ca parametru functiei
        //creez o imagine cu sursa preluata din xml (textul din imm)
        var imag=document.createElement("IMG");
        imag.src= imm.text();
        imag.id=id;//atribui imaginii din HTML id-ul imaginii din xml(functie generica)
        return imag;
    }
     this.getMsg=function (id){
        var t=x.find("#"+id); 
        var div=document.createElement("DIV"); //pentru mesajul din xml cu id-ul dat, creez un div in html cu acelasi id 
        div.id=id;
        div.className="msgclass"; //pentru a atribui tuturor mesajelor acelasi stil in css
        div.innerHTML=t.text();
        return div;
    }
    this.getCursor=function (id){
        var t=x.find("#"+id);  //pentru un cursor din xml, creez un div in html 
        var div=document.createElement("DIV");
         div.id=id;
        div.className="cursclass";
        div.innerHTML=t.text();
        return div;
    }
    this.getAudio=function(id){
        var aud=x.find("#"+id);
        var audio=document.createElement("AUDIO"); //creeaza un obiect audio in html, dupa sursa din xml
        audio.src=aud.text();
        audio.id=id;
        return audio;
    }
}

/*
	facem apelul AJAX
	functia $ajax() primeste ca parametru un obiect de tip "cerere". 
	Obiectul este creat prin scrierea object literal (vezi laboratorul cu obiectele custom)
	Acest obiect necesita urmatoarele proprietati:
	url - locul in care se gaseste fisierul pe care il cerem (in cazul de fata un XML)
	type - un string continand tipul cererii - poate fi GET sau POST
	dataType - tipul de date pe care le primim inapoi, in urma cererii - in cazul de fata tipul de date va fi xml
	succes - functia care se executa in caz ca s-a terminat cererea cu succes
	error - functia care se executa in caz ca s-a terminat cererea cu eroare
*/


window.onload=function(){
    $.ajax({
        url:"XML/xmlfis.xml",
        type:"GET",
        dataType:"xml",
        success:function(xml){
        $xml=$(xml);  //realizez parsarea (transformarea sirului xml in arbore DOM)
        var load=new Obj($xml); //creez un obiect din clasa Obj(loader) pt a putea apela metodele get 
        
        var nrresurse=0; //retin cate taguri-copii am in resurse in arborele $xml
        //nrresurse-> pt a sti cu ce procent creste latimea loading-bar-ului
        var copii=$xml.find("resurse").children();
         copii.each(function(i){
             nrresurse+=$(this).children().length;
         });
   
        copii.each(function(i){ //iau copiii directi din resurse: imagini, mesaje etc.
            if($(this).attr("id")=="imagini"){
                //pentru fiecare copil al tagului "imagini", creez o imagine in html
                $(this).children().each(function(j){
                      var imagnoua=load.getImg($(this).attr("id"));
                    //vecimg e vector cu toate imaginile HTML 
                      vecimg.push(imagnoua); //adaug imaginea creata in vectorul vecimg
                    
                    //la incarcarea unei resurse,intr-un pas, latimea divului load creste cu latimea loading-barului/nr resurse 
                      imagnoua.onload= function(){
                          var d=document.getElementById("load");
                          var dstil=window.getComputedStyle(d); //calculeaza toate proprietatile divului load
                          var loadbarstil=window.getComputedStyle(document.getElementById("loadingbar"));
                          d.style.width=parseFloat(dstil.width)+ parseInt(loadbarstil.width)/nrresurse+ "px";
                      }
                      });
                    }
            else if($(this).attr("id")=="mesaje"){
                $(this).children().each(function(j){
                    //vecmsg e vector cu toate divurile create cu mesaje din xml
                    //pentru mesaje nu exista proprietatea onload -> divurile cu mesaje sunt incarcate instant  
                    vecmsg.push(load.getMsg($(this).attr("id")));
                    var d=document.getElementById("load");
                    var dstil=window.getComputedStyle(d); //calculeaza toate proprietatile divului load
                    var loadbarstil=window.getComputedStyle(document.getElementById("loadingbar"));
                    d.style.width=parseFloat(dstil.width)+ parseInt(loadbarstil.width)/nrresurse+ "px";
                    });
                
            }
            else if($(this).attr("id")=="adresecursor"){
                     $(this).children().each(function(j){
                    //veccursor e vector cu toate divurile cu cursoare preluate din xml
                    //nu exista onload la div-> divurile cu mesaje sunt incarcate instant 
                      veccursor.push(load.getCursor($(this).attr("id")));
                     var d=document.getElementById("load");
                     var dstil=window.getComputedStyle(d); //calculeaza toate proprietatile divului load
                     var loadbarstil=window.getComputedStyle(document.getElementById("loadingbar"));
                     d.style.width=parseFloat(dstil.width)+ parseInt(loadbarstil.width)/nrresurse+ "px";
                    });
            }
                else if($(this).attr("id")=="audio"){
                     $(this).children().each(function(j){
                        vecmuz.push(load.getAudio($(this).attr("id")));
                        var d=document.getElementById("load");
                        var dstil=window.getComputedStyle(d); //calculeaza toate proprietatile divului load
                        var loadbarstil=window.getComputedStyle(document.getElementById("loadingbar"));
                        d.style.width=parseFloat(dstil.width)+ parseInt(loadbarstil.width)/nrresurse+ "px";
                         });
                         }        
                   });
            
            //la fiecare secunda setInterval verifica daca latimea divului load a ajuns egal cu latimea loading-barului, adica toate resursele s-au incarcat si loading-barul trebuie sa dispara
            //ne oprim din verificare cu clearInterval
            var repeta=setInterval(function(){
            var loadbar=window.getComputedStyle(document.getElementById("loadingbar"));
            var load=window.getComputedStyle(document.getElementById("load"));
        
            if(Math.abs(parseInt(loadbar.width)-parseInt(load.width))<=1) //marja de eroare
                {
                    clearInterval(repeta);
                    setTimeout(function(){creare_meniu();},1000); //se genereaza in pagina meniul cu inputurile
                }
            },10);
        },
        error:function(err){ //xml-ul nu a putut fi preluat cu succes
            alert(err);
        }
    });
}

function reset(){
    //reseteaza jocul inainte de fiecare apasare a butonului de start 
    //sterg tot continutul din container si din comanda
    document.getElementById("container").innerHTML=null;
    document.getElementById("comanda").innerHTML=null;
    
    //resetez toate variabilele globale 
    tipsel=[]; tip=1; niveldif=-1; comanda=null; vecfloricomanda=[]; nrfloritip=[];
    vecflori=[]; vit=null; tasta=null; cutie=null, vecom=[];
    vecptr=[]; clearInterval(genptr); scor=0; vieti=cst.nrvieti;
    plici=null; canta=0;
    clearInterval(okgen); clearInterval(okup);
    
}

function creare_meniu(){
    //afisez cele doua butoane cu Menu si Start
    document.getElementById("start").style.display="block";
    document.getElementById("showmenu").style.display="block";
    var menu=document.getElementById("meniu");
    menu.style.border="5px solid DarkRed";
    var ecran=document.getElementById("ecran");
    for(var i=0; i<vecimg.length; i++)
        {
        if(vecimg[i].id=="back_menu")
            {
                menu.style.background="url("+vecimg[i].src+")";
                menu.style.backgroundSize="cover";
            }
        if(vecimg[i].id=="back_ecran")
            {
                ecran.style.background="url("+vecimg[i].src+")";
                ecran.style.backgroundSize="cover";
            }
        }
    
    //sterg loading-divul cu loading-bar 
    var load=document.getElementById("loadingdiv");
    load.style.display="none";
    
    //creez un div pentru input-ul de tip number pentru a selecta cate tipuri de flori folosesc 
    var nrtip=document.createElement("DIV");
    nrtip.className="inputs";
    nrtip.id="pp";
    var p=document.createElement("P");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="tasta"){
                p.innerHTML=vecmsg[i].innerHTML;
                break;
        }
   
    nrtip.appendChild(p);
    var inp=document.createElement("INPUT");
    inp.id="tasta";
    inp.type="number"; 
    inp.value=1;
    //RegExp ->verificare validitate input cu pattern
    inp.pattern="[1-9]{1}"; inp.onblur=function(e){
        if(!e.target.checkValidity())
            alert("input invalid");
    }
    
    inp.min=cst.tastamin;
    inp.max=cst.tastamax;
    nrtip.appendChild(inp);
    menu.appendChild(nrtip);
    
    //input de tip radio pentru nivelul de dificultate(easy, medium si hard)
    var dif=document.createElement("DIV");
    dif.className="inputs";
    
    var p=document.createElement("P");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="dif"){
                p.innerHTML=vecmsg[i].innerHTML;
                break;
        }
    dif.appendChild(p);
    for(var i=1;i<=3;i++)
        {
            var inp=document.createElement("INPUT");
            inp.type="radio";
            inp.value=i-1; //pentru testarea rezultatului; ce nivel de dif folosesc: 0,1, 2
            inp.name="nivel"; //inputurile radio au toate acelasi nume pt a se putea selecta doar unul din ele
            var et=document.createElement("LABEL");
            
            if(i==1){
                et.innerHTML="EASY";
                inp.checked=true;
            }
            else if(i==2)
                    {
                        et.innerHTML="</br>MEDIUM";
                    }
                else et.innerHTML="</br>HARD";
        
            et.appendChild(inp);
            dif.appendChild(et);
        }
    
    menu.appendChild(dif);
   // document.getElementsByName("nivel")[0].checked=true;
    
    //input de tip range cu viteza de deplasare a cutiei
    //sub range afisez intr-un paragraf valoarea selectata
    var vit=document.createElement("DIV");
    vit.className="inputs";
    
    var p=document.createElement("P");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="vit"){
                p.innerHTML=vecmsg[i].innerHTML;
                break;
        }
    vit.appendChild(p);
    var inp=document.createElement("INPUT");
    inp.id="vit";
    inp.type="range";
    inp.min=cst.vitboxmin;
    inp.max=cst.vitboxmax;
    inp.value=cst.vitboxmax;
    inp.onchange=function(e){
        document.getElementById("pvit").innerHTML=e.target.value; 
    }
    var psel=document.createElement("P");
    psel.innerHTML=inp.value;
    psel.id="pvit";
    vit.appendChild(inp);
    
    vit.appendChild(psel);
    menu.appendChild(vit);
    
    //select multiplu cu tipurile florilor
    var d=document.createElement("DIV");
    d.className="inputs";
    
    var p=document.createElement("P");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="culfl"){
                p.innerHTML=vecmsg[i].innerHTML;
                break;
        }
    d.appendChild(p);
    var inp=document.createElement("SELECT");
    inp.multiple=true;
    inp.id="culfl";
    for(var i=1; i<=cst.nrtipflori; i++)
        {
            var opt=document.createElement("OPTION");
            opt.innerHTML="Tipul "+i;
            opt.selected=true;
            for(var j=0; j<vecimg.length; j++)
                if(vecimg[j].id=="fl"+i){
                    opt.value=j; //fiecare tip din select are ca valoare indicele imaginii cu tipul respectiv
                break;
                }
            inp.appendChild(opt);  
        }
    d.appendChild(inp);
    menu.appendChild(d);
  
    //select simplu cu forma cursorului
    var d=document.createElement("DIV");
    d.className="inputs";
    
    var p=document.createElement("P");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="cursor"){
                p.innerHTML=vecmsg[i].innerHTML;
                break;
        }
    d.appendChild(p);
    var inp=document.createElement("SELECT");
    inp.id="cursor";
    for(var i=0; i<veccursor.length; i++)
        {
            var opt=document.createElement("OPTION");
            opt.innerHTML="Tipul "+(i+1);
            opt.value=i;
            inp.appendChild(opt);  
        }
    d.appendChild(inp);
    menu.appendChild(d);
    
    //checkbox cu mute pentru muzica
    var d=document.createElement("DIV"); 
    d.className="inputs";
    
    var inp=document.createElement("INPUT");
    inp.type="checkbox";
    inp.id="muz";
    //cand inputul e checked, fisierul audio redat in fundal este oprit temporar cu pause, iar la debifare se reda de unde am ramas 
    inp.onchange=function(e){ //la orice schimbare a inputului
        if(e.target.checked) //daca inputul este checked
            { //canta-> variabila globala =1 sau 0; daca sunetul e setat pe play sau oprit 
            if(canta) //daca muzica era pe play 
               { vecmuz[0].pause(); canta=0;} //opresc sunetul temporar 
            else e.target.checked=false; //daca sunetul era oricum oprit, atunci checkboxul nu poate fi checked
            }
        else if(!canta){ vecmuz[0].play(); canta=1;} 
    }
    var et=document.createElement("LABEL");
   
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="mute"){
                et.innerHTML=vecmsg[i].innerHTML;
                break;
        }
    et.appendChild(inp);
    d.appendChild(et);
    menu.appendChild(d);
    
    //textarea cu instructiuni
     var d=document.createElement("DIV");
    d.className="inputs";
    d.id="instr";
    var inp=document.createElement("TEXTAREA");
    inp.id="textar";
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="instr"){
                inp.value=vecmsg[i].innerHTML;
                break;
        }
    d.appendChild(inp);
    menu.insertBefore(d,document.getElementById("pp"));
    
    //butonul showmenu afiseaza sau ascunde meniul, in functie de starea lui curenta
    var btmenu=document.getElementById("showmenu");
    btmenu.onclick=function(){
        var menu=document.getElementById("meniu");
        var stil=window.getComputedStyle(menu); //pentru a verifica starea curenta a meniului
        if(stil.display=="block")
            menu.style.display="none";
        else  menu.style.display="block";
    }
    //la click pe butonul start, ascund meniul si apelez functia care incepe jocul propriu-zis
    var btstart=document.getElementById("start");
    btstart.onclick=function(){
        var menu=document.getElementById("meniu");
        menu.style.display="none";
        start();
    }    
var menu=document.getElementById("meniu");
        menu.style.display="none";
    //start();
}

//functia care incepe jocul propriu-zis 
function start(){
     reset(); //functie de reset care sterge tot ce e in container inainte sa se dea click pe butonul de start (pt a nu se pastra obiectele din jocul anterior )

    //dau play la fisierul audio cu id-ul "muz" si variabila globala canta devine 1 
    var ind;
    for(var i=0; i<vecmuz.length; i++)  
        if(vecmuz[i].id=="muz")
            ind=i;
    vecmuz[ind].play();
    canta=1;
    
    //cand fisierul audio cu id-ul "muz" e redat complet, sa se reia 
    //functia adauga_eveniment apeleaza addEventListener, valabila pe toate browserele
    adauga_eveniment(vecmuz[ind],"ended",function(e){e.target.play();}); 
    
    //adaug in subsol data curenta
    //creez un div dataant care sa retina data curenta(in divul data) si data ultimei accesari a jocului(in divul div1)
    var data=document.createElement("DIV");
    var dataant=document.createElement("DIV");
    dataant.id="dataant";
    data.id="data";
    dataant.appendChild(data);
    document.getElementById("comanda").appendChild(dataant);
    document.getElementById("data").innerHTML=Date();
    var div1=document.createElement("DIV");
    div1.id="date";
    var i;
    //data ultimei accesari e preluata din localStorage
    //daca elementul last exista in localStorage, atunci adaug in div acea data
    //in ambele cazuri se actualizeaza data din localStorage cu data curenta (chiar daca exista inainte sau nu)
    try{
    if(i=localStorage.getItem("last"))
        {
            div1.innerHTML=i;
        }
    else {
        div1.innerHTML=data.innerHTML;
        throw 10;
         }//daca nu exista in localStorage data ultimei accesari, atunci aceasta va fi data accesarii curente
    }
    catch(i){
        alert("Nu exista valoarea in localStorage!");
    }
    localStorage.setItem("last",data.innerHTML); //actualizare
    dataant.appendChild(div1);
    //la click pe divul cu date din localStorage, se sterg toate datele din localStorage
    var dd=document.getElementById("data");
    dd.onclick=function(){
        localStorage.clear();
    }
    //afisez initial un scor 0 si nr de vieti initiale (urmeaza sa fie afisate live prin functia de Update)
    var pscor=document.createElement("P");
    pscor.id="scor";
    pscor.innerHTML="Scor curent: " + scor;
    pscor.innerHTML+="</br>"+ "Nr vieti: "+ vieti;
    document.getElementById("comanda").appendChild(pscor);
    
    //fac vizibil containerul de joc in care voi genera gradina si alte elemente ale jocului
    var container=document.getElementById("container");
    container.style.display="block";
    
    //preiau toate raspunsurile din input-uri si verific conditiile de validare
    tasta=parseInt(document.getElementById("tasta").value); //tasta cu care preiau o floare
    if(tasta<cst.tastamin || tasta>cst.tastamax){
        alert("tasta invalida");
        return;
    }
    var selm=document.getElementById("culfl");

    for(var i=0; i<selm.options.length; i++)
        {
            if(selm.options[i].selected)
                tipsel.push(i+1); //adaug in vector indicele tipului selectat
        }
    if(tipsel.length==0){
        alert("Selectati cel putin un tip de floare!");
        return;
    }
    
    var sels=document.getElementById("cursor");
    for(var i=0; i<sels.options.length; i++)
        if(sels.options[i].selected)
                tip=i; //retin indicele din vector al cursorului
    
    vit=document.getElementById("vit").value;
    var dif=document.getElementsByName("nivel");
    for(var i=0; i<dif.length; i++)
        if(dif[i].checked)
            niveldif=i;
    if(niveldif==-1)
        {
            alert("Selectati nivelul dorit!");
            return;
        }
    
    //creez gradina si o adaug in container
    var gradina=document.createElement("DIV");
    gradina.id="gradina";
    document.getElementById("container").appendChild(gradina);
    
    //fac divul "comanda" vizibil
    var coma=document.getElementById("comanda");
    coma.style.display="block";
    document.getElementById("ecran").style.height=cst.dim_ecran+"vh"; //dim in viewport
    var gradina=document.getElementById("gradina");
    cutie=new Box(cst.cutie.width, cst.cutie.height,cst.cutie.left, cst.cutie.top, cst.cutie.color); //creez obiectul cutie de colectare; transmit ca parametri: latime, inaltime, left-ul si top-ul la care vreau sa pozitionez cutia fata de gradina si culoarea ei 
    gradina.appendChild(cutie.cut); //adaug in gradina cutia propriu-zisa(divul) din obiectul cutie cu toate proprietatile 
    
    window.onkeydown=move; //eveniment-> apasarea unei taste (folosita de ex. la deplasarea cutiei in gradina prin sageti)
    
    //nrfloritip=vector ce retine cate flori am in gradina din fiecare tip
    //initializez vectorul nrfloritip cu atatia de 0 cate tipuri am
    for(var i=0; i<=cst.nrtipflori ;i++)
        nrfloritip.push(0);
    
    //repet de nrflori ori (nrflori e constanta fixata)
    for(var i=0; i<vdif[niveldif].nrflori; i++)
        {
            creeaza_floare(); 
        }
    for(var i=0; i<vecflori.length; i++)
    {
        gradina.appendChild(vecflori[i].fl); //adaug imaginea din obiect in HTML
        vecflori[i].creste(); //activez cresterea pentru fiecare floare 
    }
    
    var nr=vdif[niveldif].nromuleti;
    var src;
    for(var i=0; i<nr;i++)
        {
            for(var j=0; j<vecimg.length; j++)
                {
                    if(vecimg[j].id=="om")src=vecimg[j].src;
                }
            var latura=Math.ceil(Math.random() * 4); //1,2,3,4 in functie de sus, jos,dr,st (portiunea pe care se genereaza om)
            
            var top, left;
            var stilgradina=window.getComputedStyle(document.getElementById("gradina"));
            switch(latura){
                case 1:
                    do{
                    var ok=1;
                        
                    left=Math.ceil(Math.random() * (parseInt(stilgradina.width)-cst.omulet.width) + parseInt(stilgradina.left));
                    top=parseInt(stilgradina.top)-cst.omulet.height;
                    for(var p=0; p<vecom.length; p++)
                            if(test_coliziune(top,left, cst.omulet.height, cst.omulet.width, vecom[p].top, vecom[p].left, cst.omulet.height, cst.omulet.width)==true)
                            {ok=0;break;}
                    }while(!ok);
                    break;
                case 2:
                     do{
                    var ok=1;
                    left=Math.ceil(Math.random() * (parseInt(stilgradina.width)-cst.omulet.width) + parseInt(stilgradina.left));
                    top=parseInt(stilgradina.top)+parseInt(stilgradina.height);
                
                     for(var p=0; p<vecom.length; p++)
                            if(test_coliziune(top,left, cst.omulet.height, cst.omulet.width, vecom[p].top, vecom[p].left, cst.omulet.height, cst.omulet.width))
                            {ok=0;break;}
                    
                    }while(!ok);
                     break;
                case 3:
                  do{
                    var ok=1;
                    left=parseInt(stilgradina.left)+parseInt(stilgradina.width);
                    top=Math.ceil(Math.random() * (parseInt(stilgradina.height)-parseInt(cst.omulet.height)) + parseInt(stilgradina.top));
                     for(var p=0; p<vecom.length; p++)
                            if(test_coliziune(top,left, cst.omulet.height, cst.omulet.width, vecom[p].top, vecom[p].left, cst.omulet.height, cst.omulet.width))
                            {ok=0;break;}
                    
                    }while(!ok);
                     break;
                default:
                 do{
                    var ok=1;
                    left=parseInt(stilgradina.left)- cst.omulet.width;
                    top=Math.ceil(Math.random() * (parseInt(stilgradina.height)-parseInt(cst.omulet.height)) + parseInt(stilgradina.top));
                    for(var p=0; p<vecom.length; p++)
                            if(test_coliziune(top,left, cst.omulet.height, cst.omulet.width, vecom[p].top, vecom[p].left, cst.omulet.height, cst.omulet.width))
                            {ok=0;break;}
                    
                    }while(!ok);
                     
            }
            var om=new Omulet(src, top,left);
            
            vecom.push(om);
            
            document.body.style.cursor="url('"+veccursor[tip].innerHTML+"'),auto";
        }
    
    //generez la un interval de timp cate o piatra care porneste din centrul unui om
    //omul e ales aleator
    genptr=setInterval(function(){
                var indOm=Math.floor(Math.random() * vecom.length); //generez aleator indice pentru un omulet
                var src;
                for(var j=0; j<vecimg.length; j++)
                    if(vecimg[j].id=="piatra")
                        {
                            src=vecimg[j].src;
                            break;
                        }
                
                //pozitiile initiale -> centrul omului cu indicele indOm
                var ptr=new Piatra(src,vecom[indOm].top+parseInt(cst.omulet.height/2), vecom[indOm].left+parseInt(cst.omulet.width/2));
                vecptr.push(ptr); //adaug piatra in vector de pietre
                document.getElementById("container").appendChild(ptr.ptr);
                var gr=window.getComputedStyle(document.getElementById("gradina"));
                //aleg random o floare care sa fie tinta pietrei si preiau pozitia ei ca poz finala
                var indfl=Math.floor(Math.random() * vecflori.length);
                var leftf=vecflori[indfl].left + parseInt(gr.left);
                var topf=vecflori[indfl].top + parseInt(gr.top);
                vecflori[indfl].fl.style.border="10px solid red"; //floarea-tinta primeste border rosu
                ptr.ptr.style.border="10px solid red";
                ptr.moveptr(topf,leftf,indfl); //activez miscarea pietrei
                
            },cst.piatra.gen);
    
    
    
    var cont=document.getElementById("container");
    for(var i=0; i<vecom.length; i++)
        cont.appendChild(vecom[i].om); //adaug oamenii in container
    
    var com=document.getElementById("comanda");
    var obcom=new Comanda();
    comanda=obcom;
    
    com.appendChild(obcom.pcom);
    com.appendChild(obcom.divcom);
    obcom.generare_comanda();
    
    var gr=window.getComputedStyle(gradina);
    var topPl=Math.floor(Math.random() * (parseInt(gr.height)-cst.plici.dim));
    var leftPl=Math.floor(Math.random() * (parseInt(gr.width)-cst.plici.dim));
    var src;
    for(var i=0; i<vecimg.length; i++)
            if(vecimg[i].id=="plici")
               {    src=vecimg[i].src; 
                    break;
               }
    
    plici=new Plici(src, topPl, leftPl);
    gradina.appendChild(plici.pl);
    
    okup=setInterval(function(){Update();}, cst.intup);
    okgen=setInterval(function(){
                var floarenoua=creeaza_floare();
                var gradina=document.getElementById("gradina");
                floarenoua.creste();
                gradina.appendChild(floarenoua.fl);
    }, cst.genflori);
    
}

function creeaza_floare(){
               var src;
            var nrrand=Math.floor(Math.random()*tipsel.length); //generez un nr random intre 0 si lungimea vectorului tipsel cu tipurile de flori dorite
            
            nrfloritip[tipsel[nrrand]]++; //o sa generez o floare din tipul tipsel[nrrand]
            //caut in vectorul de imagini floarea cu id-ul luat din tip
            for(var j=0; j<vecimg.length; j++)
                if(vecimg[j].id=="fl"+tipsel[nrrand])
                    {
                        //var vec=vecimg[j].src.split("/");
                        //src=vec[vec.length-2]+"/"+vec[vec.length-1];
                        src=vecimg[j].src;
                    }
            
            var stilgradina=window.getComputedStyle(document.getElementById("gradina"));
            
            //generez aleator un top si un left la care sa se pozitioneze floarea, atata timp cat nu exista coliziune cu alte flori
            var tfl, lfl;
            do{
             tfl=Math.floor(Math.random() * (parseInt(stilgradina.height)-cst.floare.dimmax)); 
             lfl=Math.floor(Math.random() * (parseInt(stilgradina.width)-cst.floare.dimmax));
            }while(test_poz(tfl,lfl, cst.floare.dimmax)==0); //test_poz verifica daca pozitiile date sunt bune
            
            var fl=new Floare(src,tfl,lfl);
            vecflori.push(fl);
            return fl;
}

function test_poz(top,left, dim){
    var ok=1; //pp ca floarea cu pozitiile top si left nu intersecteaza alta floare
    for(var i=0; i<vecflori.length; i++)
        {
            if(test_coliziune(top,left,dim, dim, vecflori[i].top, vecflori[i].left, dim, dim)==true)
            {ok=0;
            break;}
        }

    return ok; //returneaza 1 daca se poate pozitiona la topul si leftul date
}
function test_coliziune(top1,left1,h1,w1,top2,left2,h2,w2){
	if(left1< left2+ w2 &&
	left1+ w1> left2 &&
	top1 < top2 + h2 &&
	top1 + h1 > top2) {
    return true;
	}
}

//miscarea pietrei de la o pozitie initiala la una finala
function init_miscare(ob, left_i, top_i, left_f, top_f, nr_pasi, indfl)
{

    var DLeft=left_f-left_i; //distanta totala ce trebuie parcursa pe orizontala
    var DTop=top_f-top_i; //.........................................verticala
    var dleft=DLeft/nr_pasi; //distanta parcursa intr-un pas
    var dtop=DTop/nr_pasi;
    var top_r=top_i; //pozitii curente 
    var left_r=left_i;
    misca(ob,top_r,left_r,1,nr_pasi,dleft,dtop,left_f,top_f, indfl);
}

function misca(ob,top_r,left_r,pas_c,nr_pasi,dleft,dtop,left_f,top_f,indfl)
{
    //ob e element din html
    if (pas_c<nr_pasi)
        {
            top_r+=dtop;
            left_r+=dleft;
            ob.style.top=(Math.round(top_r))+"px";
            ob.style.left=(Math.round(left_r))+"px";
            //dupa o miscare, actualizez leftul si topul din obiectul ce contine elementul din html ob
            for(var j=0; j<vecptr.length; j++)
                    if(vecptr[j].ptr==ob)
                        {
                            vecptr[j].top=Math.round(top_r);
                            vecptr[j].left=Math.round(left_r);
                        }
            pas_c++;
            setTimeout(function () {misca(ob,top_r,left_r,pas_c,nr_pasi,dleft,dtop,left_f,top_f,indfl);},50);
        }
    else //ultimul pas - seteaza direct la coord finale; elimina erori rotunjire
            {
                if(ob){
                ob.style.top=(top_f+"px");
                ob.style.left=(left_f+"px");
                //am ajuns cu piatra pe floare-> sterg floarea din html, din vector si sterg piatra
        
                ob.parentNode.removeChild(ob);
                vecflori[indfl].fl.parentNode.removeChild(vecflori[indfl].fl);
                nrfloritip[vecflori[indfl].tip]--;
                vecflori.splice(indfl,1);
                var indptr;
                for(var i=0; i<vecptr.length; i++)
                    if(vecptr[i].ptr==ob)
                        {
                            indptr=i;
                            break;
                        }
                vecptr.splice(indptr,1);
                //generez o floare noua cand o floare e lovita de piatra
                var floarenoua=creeaza_floare();
                var gradina=document.getElementById("gradina");
                floarenoua.creste();
                gradina.appendChild(floarenoua.fl);
                scor-=vdif[niveldif].penalizare_floare; //penalizare la scor daca o piatra loveste o floare
                }

            }
}

//adauga un eveniment la un obiect -> valabil pe toate browserele (sol cu prefixe)
function adauga_eveniment(elem,numeEveniment,fct){
	var prefixe=["","moz","MS","o","webkit"]; 
	for (var i=0;i<prefixe.length;i++)
		elem.addEventListener(prefixe[i]+numeEveniment,fct,false);
}

function move(e){
    var stilcutie=window.getComputedStyle(cutie.cut); //getComputedStyle pt a verifica pozitia curenta a cutiei
    var stilgradina=window.getComputedStyle(document.getElementById("gradina"));
    var intViteza=parseInt(vit);
    
    //e.preventDefault() nu permite scroll din apasarea sagetilor
    //daca s-a apasat in window ArrowLeft=> cutia se misca la stanga doar daca nu depaseste cadrul gradinii
    //la o singura apasare, cutia se deplaseaza cu vit px (viteza din input)
    if(e.key == "ArrowLeft")
        {
            e.preventDefault();
            if(parseInt(stilcutie.left) - intViteza >= 0)
            {
                cutie.cut.style.left= cutie.l- intViteza+"px";
                cutie.l-=intViteza;
            }
        }
        else if(e.key=="ArrowRight")
                {
                    e.preventDefault();
                    if(parseInt(stilcutie.left)+ parseInt(stilcutie.width) + intViteza <= parseInt(stilgradina.width))
                        {
                            cutie.cut.style.left=cutie.l +intViteza +"px";
                            cutie.l+=intViteza;
                        }
                }
                else if(e.keyCode==38) //ArrowUp
                {
                    e.preventDefault();
                    if(parseInt(stilcutie.top) - intViteza >= 0)
                        {
                            cutie.cut.style.top=cutie.t -intViteza +"px";
                            cutie.t-=intViteza;
                        }
                }
                else if(e.keyCode==40) //ArrowDown
                {
                    e.preventDefault();
                    if(parseInt(stilcutie.top)+ parseInt(stilcutie.height) + intViteza <= parseInt(stilgradina.height))
                        {
                            cutie.cut.style.top=cutie.t +intViteza +"px";
                            cutie.t+=intViteza;
                        }
                }
                else if(e.key == tasta+"") //preluare floare la apasarea tastei din input
                    {
                        var ind;
                        var nrcoliz=0; //numar cate coliziuni exista intre cutie si flori 
                       
                        for(var j=0; j<vecflori.length; j++)
                            {
                            var sfl=window.getComputedStyle(vecflori[j].fl);
                            if(parseInt(sfl.width)==cst.floare.dimmax) //floarea trebuie sa fi ajuns la dimmax pt a putea fi culeasa 
                                {
                                if(test_coliziune(cutie.t, cutie.l, cutie.h, cutie.w,vecflori[j].top, vecflori[j].left,cst.floare.dimmax, cst.floare.dimmax ))
                                    {
                                        nrcoliz++;
                                        ind=j; //ind va fi folosit doar daca exista coliziune cu o singura floare, altfel se va afisa un alert 
                                    }
                                }
                            }
                       
                       if(nrcoliz>1)
                       {
                           //la o coliziune cu mai multe flori, jucatorul trebuie sa se mute strict pe una 
                           for(var p=0; p<vecmsg.length; p++)
                               if(vecmsg[p].id=="muta"){
                                alert(vecmsg[p].innerHTML);
                                   break;
                               }
                       }
                        else if(nrcoliz==1)
                            {
                                //preiau din sursa tipul florii cu care am coliziune 
                                var s=vecflori[ind].src.split('/');
                                var tip=parseInt(s[s.length-1].charAt(2));
                                var ok=0; //verific daca se cere in comanda curenta, printre florile care urmeaza sa fie culese, cel putin o floare de tipul respectiv 
                                var indcom;
                                var florineculese=0; 
                           
                                //caut printre toate florile din comanda una cu tipul florii de la coliziune si care sa nu fi fost selectata pana la mom curent 
                                //o floare neselectata se depisteaza prin faptul ca nu are border
                                for(var p=0; p<vecfloricomanda.length; p++)
                                    {
                                         var t=vecfloricomanda[p].src.split('/');
                                         var tipcom=parseInt(t[t.length-1].charAt(2));
                                        
                                         if(tipcom == tip && vecfloricomanda[p].fl.style.border=="") {ok=1; indcom=p;}
                                        //adaug 1 la nr de flori neculese de tipul curent
                                        if(vecfloricomanda[p].fl.style.border=="") 
                                            florineculese++;
                                    }
                                if(ok)
                                    {
                                        
                                        vecfloricomanda[indcom].fl.style.border="5px solid green"; //floarea din comanda a fost culeasa
                                        florineculese--;
                                        nrfloritip[tip]--;
                                        
                                        vecflori[ind].fl.parentNode.removeChild(vecflori[ind].fl); //sterg floarea culeasa din html
                                        
                                        //generez o floare noua dupa ce sterg una culeasa
                                        var floarenoua=creeaza_floare();
                                        var gradina=document.getElementById("gradina");
                                        floarenoua.creste();
                                        gradina.appendChild(floarenoua.fl);
                                        
                                        //vecfloricomanda.splice(indcom,1);
                                        if(!florineculese) //comanda curenta a fost realizata
                                            {
                                                scor+=vdif[niveldif].punctaj_comanda;
                                              //  alert(comanda.pcom.innerHTML);
                                                vecfloricomanda=[];
                                                comanda.generare_comanda();
                                            }
                                    }
                                else{ //s-a selectat o floare gresita, care nu apare deloc in comanda
                                        nrfloritip[tip]--;
                                        
                                        vecflori[ind].fl.parentNode.removeChild(vecflori[ind].fl); //sterg floarea culeasa din html
                                        
                                        //generez o floare noua dupa ce sterg una culeasa
                                        var floarenoua=creeaza_floare();
                                        var gradina=document.getElementById("gradina");
                                        floarenoua.creste();
                                        gradina.appendChild(floarenoua.fl);
                                    
                                    
                                    scor-=vdif[niveldif].punctaj_comanda; //penalizare la scor
                                    if(vieti)vieti--; //se pierde o viata
                                    if(vieti==0) //daca nu mai am nicio viata, jocul se termina
                                    {lose();}
                                    else{ //daca nu s-a terminat jocul, continui cu generarea comenzilor 
                                    vecfloricomanda=[];
                                    comanda.generare_comanda();}
                                }
                                  
                                //floarea cu care am coliziune, corecta sau gresita, a fost stearsa oricum din html si e stearsa si din vectorul de flori din gradina
                                vecflori.splice(ind,1); //sterg imaginea cu indicele ind din vector
                            }
                    }
                else if(overplici==1)
                    if(e.keyCode == cst.plici.codtasta) //daca sunt mouseover pe plici si apas tasta data in constante
                        {
                            window.onmousemove=move_plici;
                        }
}

function move_plici(e){ //functie care imi muta pliciul in functie de coordonatele mouse=ului
    
    
    var stilcontainer=window.getComputedStyle(document.getElementById("container"));
    var stilgradina=window.getComputedStyle(document.getElementById("gradina"));
    var stilecran=window.getComputedStyle(document.getElementById("ecran"));
    var stilstart=window.getComputedStyle(document.getElementById("start"));
    var stilmenu=window.getComputedStyle(document.getElementById("meniu"));
    //alert(stilmenu.display);
    var topplici;
    //stilcontainer.top este pana la nivelul butoanelor cu start si meniu (pozitia sa e relativa si s-a dat manual 10% la top, altfel topul era 0)
    //daca meniul nu e afisat, atunci scad din e.pageY si inaltimea butonului
    if(stilmenu.display=="none"){
        topplici=e.pageY-(parseInt(stilcontainer.top)+ parseInt(stilgradina.top) + parseInt(stilstart.height))-plici.height/2; //scad si inalt pliciului /2 pentru a alinia centrul pliciului cu mouse-ul
    }
    //daca meniul e afisat, atunci scad din e.pageY si inaltimea sa 
    else {topplici=e.pageY-(parseInt(stilcontainer.top)+ parseInt(stilgradina.top) + parseInt(stilstart.height)+parseInt(stilmenu.height))-plici.height/2;}
    var leftplici=e.pageX-(parseInt((parseInt(stilecran.width)-parseInt(stilcontainer.width))/2)+ parseInt(stilgradina.left))-plici.width/2;
    //alert(e.pageX+" "+stilcontainer.left+" "+stilgradina.left);
    if(topplici>=0 && topplici+plici.height/2 <= (parseInt(stilgradina.height)-plici.height) && leftplici>=0 &&  leftplici+plici.width/2 <= (parseInt(stilgradina.width)-plici.width)) {
    plici.pl.style.top=topplici +"px";
    plici.pl.style.left=leftplici +"px"; 
    plici.top=topplici;
    plici.left=leftplici;}
    
    window.onkeyup=function(){
        window.onmousemove=null;
    };
}


function lose(){
    //jocul s-a incheiat, afisez un mesaj si resetez toate elementele jocului (sterg tot)
    for(var i=0; i<vecmsg.length; i++)
        if(vecmsg[i].id=="esec")
            {
                alert(vecmsg[i].innerHTML);
                break;
            }
    reset();
}

//clasa pentru cutia de colectare a florilor 
function Box(width, height, left, top, color){
    //proprietati declarate cu this(publice) -> vreau sa fie accesate si din exterior prin obiect, altfel parametrii se pierd
    this.w=width;
    this.h=height;
    this.l=left;
    this.t=top;
    this.c=color;
    
    //creez cutia si prin cut o accesez din exterior prin obiect 
    var box=document.createElement("DIV");
    box.style.width=this.w+"px";
    box.style.height=this.h+"px";
    box.style.position="absolute";
    box.style.left=this.l+"px";
    box.style.top=this.t+"px";
    box.style.background=this.c;
    this.cut=box; //cut e cutia/divul propriu zis, care trebuie atasat gradinii 
}

function Floare(src, tfl, lfl,com){ //parametri sunt sursa, left si top
    this.dimmin=cst.floare.dimmin;
    this.dimmax=cst.floare.dimmax;
    this.nretape=cst.floare.nretape;
    this.secEtape=cst.floare.secEtape;
    this.src=src;
    this.top=tfl;
    this.left=lfl;
    this.gettip=function(){
        var s=this.src.split('/');
        var tip=parseInt(s[s.length-1].charAt(2));
        return tip;
    }
    
    //com e un parametru pe care-l verific daca e activ sau nu
    //daca com  e activ, atunci florile primesc o alta dimensiune( vor fi puse in comanda )
    //creez o floare 
    var floare=document.createElement("IMG");
    floare.style.boxSizing="border-box";
    floare.src=src;
    if(!com){
    floare.style.height=floare.style.width=this.dimmin +"px";}
    else{ floare.style.height="100%";
        floare.style.width=100/cst.comanda.nrflorimax +"%";
        }
    floare.style.position="absolute";
    floare.style.left=this.left+"px";
    floare.style.top=this.top+"px";
    this.fl=floare;
    this.creste=function(){
            var int=setInterval(function(){            
            var stilfl=window.getComputedStyle(floare); //in timp real
            floare.style.width=parseFloat(stilfl.width)+ (cst.floare.dimmax-cst.floare.dimmin)/cst.floare.nretape+"px";
            floare.style.height=parseFloat(stilfl.height)+ (cst.floare.dimmax-cst.floare.dimmin)/cst.floare.nretape+"px";
            if(parseInt(stilfl.width)==cst.floare.dimmax)
            {  clearInterval(int); 
             //cand floarea ajunge la dimensiunea maxima, aceasta se opreste din crestere si primeste un border verde pentru ca jucatorul sa stie ca poate fi culeasa 
               floare.style.border="2px solid DarkGreen";                                 
                 }   
                
        },cst.floare.secEtape); //secEtape- durata la care se repeta apelarea functiei din setInterval
    }
    
}
function Omulet(src, top, left){
    this.src=src;
    this.top=top;
    this.left=left;
   var om=document.createElement("IMG");
    om.style.width=cst.omulet.width +"px";
    om.style.height=cst.omulet.height + "px";
    om.style.position="absolute";
    om.style.top=top+"px";
    om.style.left=left+"px";
    om.src=src;
    this.om=om;
    
}
function Comanda(){

    var div=document.createElement("DIV");
    div.id="divcom";
    div.style.width=cst.comanda.nrflorimax * cst.floare.dimmax+"px";
    div.style.height=cst.comanda.heightdiv+"%";
    this.divcom=div;
    var p=document.createElement("P");
    p.style.width=cst.comanda.widthp+"%";
    p.style.height=cst.comanda.heightp+"%";
    p.innerHTML="COMANDA:";
    p.id="pcom";
    this.pcom=p; 
    
    this.nrtipcom=[]; //vector ce retine cate flori am in comanda, din fiecare tip 
    for(var i=0; i<=cst.nrtipflori ;i++)
        this.nrtipcom.push(0); //initializez nrtipcom cu elemente egale cu 0
    
   this.generare_comanda=function(){
       //sterg continutul vechii comenzi 
       var c=document.getElementById("divcom");
        c.innerHTML=null;
       var nrflori=Math.floor(Math.random() * (cst.comanda.nrflorimax-5)+5); //generez random cate flori vreau sa aiba comanda (maxim nrtipflori din constante)
       for(var i=0; i<nrflori; i++)
        {
            var tipfloarecurenta;
            do{
            var index=Math.floor(Math.random() * tipsel.length); //generez un indice in vectorul tipsel (pt a afla un tip de floare) cat timp mai am pe ecran flori de tipul respectiv, dupa ce am scazut nr de flori din comanda cu acel tip 
            tipfloarecurenta=tipsel[index];
                //nrfloritip[tipfloarecurenta]-nrtipcom[tipfloarecurenta]
            }while(nrfloritip[tipfloarecurenta]-this.nrtipcom[tipfloarecurenta]<1);
        
            this.nrtipcom[tipfloarecurenta]++; 
            var src;
                
            for(var j=0; j<vecimg.length; j++)
                if(vecimg[j].id=="fl"+tipfloarecurenta)
                    {
                        src=vecimg[j].src;
                        break;
                    }
            //caut indicii la care pozitionez floare cu src in comanda 
            var left=0; //retine 0 daca in vectorul de flori din comanda nu am nicio floare sau left-ul ultimei flori adaugate+ dim floare 
            var l=vecfloricomanda.length;
            if(l>0)left=vecfloricomanda[l-1].left+cst.floare.dimmax;
            var fl=new Floare(src, 0, left ,1);
            vecfloricomanda.push(fl);
            c.appendChild(fl.fl);
        }
       
    }
}

function Piatra(src, top, left){
    var ptr=document.createElement("IMG");
    ptr.style.width=ptr.style.height=cst.piatra.dim +"px";
    ptr.style.position="absolute";
    ptr.style.top=top+"px";
    ptr.src=src;
    ptr.style.left=left+"px";
    this.ptr=ptr;
    this.top=top; this.left=left;
    this.width=this.height=cst.piatra.dim;
    
    //functie de miscare piatra  
    this.moveptr=function(topf, leftf, indfl){
        var left=this.left,top=this.top;//salvez this.left si this.top pentru ca nu sunt vizibile in setTimeout
    
        //setTimeout nu asteapta pana la terminarea executiei sale, continua testele din cod 
        setTimeout(function(){init_miscare(ptr, left, top, leftf, topf, vdif[niveldif].vit_piatra, indfl); 
                             vecflori[indfl].fl.style.border="2px solid DarkGreen";
                             ptr.style.border="none";},cst.piatra.timppornire); //cand pornesc miscarea pietrei, sterg borderul de la floare+piatra
    }
}

function Plici(src, top, left){
    var plici=document.createElement("IMG");
    plici.src=src;
    plici.style.width=plici.style.height=cst.plici.dim +"px";
    plici.style.position="absolute";
    plici.style.top=top+"px";
    plici.style.left=left+"px";
    plici.style.zIndex="10";
    this.pl=plici;
    this.top=top;
    this.left=left;
    this.width=this.height=cst.piatra.dim;
    this.pl.onmouseover=function(){
        overplici=1;
    }
    this.pl.onmouseout=function(){
        overplici=0;
        window.onkeyup=null; //nu se mai intampla nimic daca ridic tasta cand nu sunt pe mouseover
    }
}

function Update(){
    document.getElementById("data").innerHTML=Date();
    var topplici=plici.top;
    var leftplici=plici.left;
    var grd=window.getComputedStyle(document.getElementById("gradina"));
    if(overplici==1){ 
    for(var i=0; i<vecptr.length; i++){
            if(test_coliziune(topplici, leftplici, plici.height, plici.width, vecptr[i].top-parseInt(grd.top), vecptr[i].left-parseInt(grd.left), vecptr[i].height, vecptr[i].width)==true) 
        {
            scor+=vdif[niveldif].punctaj_piatra;
            vecptr[i].ptr.parentNode.removeChild(vecptr[i].ptr);
            vecptr.splice(i,1);
        }
    }
    }
    if(scor>=cst.punctaj_castig) win();
    var pscor=document.getElementById("scor");
    pscor.innerHTML="Scor curent: " + scor;
    pscor.innerHTML+="</br>"+ "Nr vieti: "+ vieti;
    
}

function win(){
    reset();
    for(var i=0; i<vecmsg.length; i++)
            if(vecmsg[i].id=="castig")
                alert(vecmsg[i].innerHTML);
    
}