var cst=new Object();
cst.tastamax=9;
cst.tastamin=0;
cst.nrtipflori=4;
cst.punctaj_castig=50;
cst.dim_ecran=200
cst.vitboxmin=10;
cst.vitboxmax=50; 
cst.nrvieti=3;
cst.intup=100;
cst.genflori=20000;

cst.floare={
    dimmin:30,
    dimmax:60,
    nretape:3,
    secEtape:3000
    //cat creste floarea intr-o etapa se calculeaza dupa formula: (dimmax-dimmin)/nretape (=5)
}
var vdif=[]; //vector cu constante in functie de nivelul de dificultate

cst.easy={
    nromuleti:10,
    nrflori:30,
    vit_piatra:70,
    punctaj_comanda:25,
    penalizare_floare:5,
    punctaj_piatra:15,
    castig_piatra:10
}
vdif[0]=cst.easy;
cst.medium={
    nromuleti:2,
    nrflori:30,
    vit_piatra:50,
    punctaj_comanda:15,
    penalizare_floare:10,
    punctaj_piatra:10,
    castig_piatra:5
}
vdif[1]=cst.medium;
cst.hard={
    nromuleti:3,
    nrflori:50,
    vit_piatra:30,
    punctaj_comanda:10,
    penalizare_floare:10,
    punctaj_piatra:5,
    castig_piatra:3
}

vdif[2]=cst.hard;

cst.omulet={
    width:100,
    height:100
}
cst.cutie={
    height:60,
    width:60,
    color:"red",
    left:0,
    top:0
}

cst.comanda={
    nrflorimax:5,
    heightdiv:30,
    heightp:80,
    widthp:30
}

cst.piatra={
    dim:40,
    timppornire:5000,
    gen:20000 /* diferenta de timp la care e generata o noua piatra */
}
cst.plici={
    dim:60,
    timppornire:2000,
    codtasta:70
}