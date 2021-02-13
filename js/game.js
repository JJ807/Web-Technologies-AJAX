/*Automat Komorkowy */

/* Parametry gry */
//ustalona wielkosc swiata
const wiersz = 40;
const kol = 40;

//rozpoczecie symulacji
var start = false;
var stoper;
var czasReprodukcji = 1000; //1 sek

//liczba minionych pokolen
var lpokolen = 0;

//tablice 1D
var obecnePok = [wiersz];
var nastepnePok = [wiersz];

//stworzenie martwego swiata
function stworzSwiat() {
  let swiat = document.querySelector("#swiat");

  let siatka = document.createElement("table");
  siatka.setAttribute("id", "siatka");
  siatka.setAttribute("align", "center");
  siatka.style.borderCollapse = "collapse";
  siatka.style.border = "1px solid #585858";

  for (let i = 0; i < wiersz; ++i) {
    let tr = document.createElement("tr");
    for (let j = 0; j < kol; ++j) {
      let komorka = document.createElement("td");
      komorka.setAttribute("id", i + "_" + j);
      komorka.setAttribute("class", "martwa");
      komorka.addEventListener("click", wybranieKomorki);
      tr.appendChild(komorka);
    }
    siatka.appendChild(tr);
  }
  swiat.appendChild(siatka);
}

//tablice 2D
function stworzTablice() {
  for (let i = 0; i < wiersz; ++i) {
    obecnePok[i] = new Array(kol);
    nastepnePok[i] = new Array(kol);
  }
}

//inicjalizacja
function inicjalizujTablice() {
  for (let i = 0; i < wiersz; ++i) {
    for (let j = 0; j < kol; ++j) {
      obecnePok[i][j] = 0;
      nastepnePok[i][j] = 0;
    }
  }
}

//obsluga klikniecia danej komorki
function wybranieKomorki() {
  let komorka = this.id.split("_");
  let w = Number(komorka[0]);
  let k = Number(komorka[1]);

  // Zmiana stanu komorki na klikniecie
  if (this.className === "zywa") {
    this.setAttribute("class", "martwa");
    obecnePok[w][k] = 0;
  } else {
    this.setAttribute("class", "zywa");
    obecnePok[w][k] = 1;
  }
  info();
  drawPieChart();
}

//reguly gry Conwaya
function nowePokolenie() {
  lpokolen++;
  for (w in obecnePok) {
    for (k in obecnePok[w]) {
      let sasiedzi = liczbaSasiadow(w, k);

      // jesli komorka zywa
      if (obecnePok[w][k] == 1) {
        // liczba sasiadow inna niz 2 lub 3 -> umiera
        if (sasiedzi < 2 || sasiedzi > 3) {
          nastepnePok[w][k] = 0;
        }
        // w innym wypadku -> rodzi sie
        else if (sasiedzi == 2 || sasiedzi == 3) {
          nastepnePok[w][k] = 1;
        }
      }
      // jesli komorka martwa
      else {
        // i liczba sasiadow dokladnie 3
        if (sasiedzi == 3) {
          // nowa komorka sie rodzi
          nastepnePok[w][k] = 1;
        }
      }
    }
  }
}

function liczbaSasiadow(w, k) {
  let liczba = 0;
  let lwierszy = Number(w);
  let lkolumn = Number(k);

  // liczymy dla centralnej - spr czy nie jestesmy w zerowym wierszu
  if (lwierszy - 1 >= 0) {
    // gorny sasiad
    if (obecnePok[lwierszy - 1][lkolumn] == 1) ++liczba;
  }

  // spr pierwsza komorke, lewy gorny rog
  if (lwierszy - 1 >= 0 && lkolumn - 1 >= 0) {
    //lewy gorny sasiad
    if (obecnePok[lwierszy - 1][lkolumn - 1] == 1) ++liczba;
  }

  // pierwszy wiersz, ostatnia kolumna, prawy gorny rog
  if (lwierszy - 1 >= 0 && lkolumn + 1 < kol) {
    //prawy gorny sasiad
    if (obecnePok[lwierszy - 1][lkolumn + 1] == 1) ++liczba;
  }

  // spr zerowa kolumne
  if (lkolumn - 1 >= 0) {
    //lewy sasiad
    if (obecnePok[lwierszy][lkolumn - 1] == 1) ++liczba;
  }
  // spr ostatnia kolumne
  if (lkolumn + 1 < kol) {
    //prawy sasiad
    if (obecnePok[lwierszy][lkolumn + 1] == 1) ++liczba;
  }

  // spr dla lewego dolnego rogu
  if (lwierszy + 1 < wiersz && lkolumn - 1 >= 0) {
    //lewy dolny sasiad
    if (obecnePok[lwierszy + 1][lkolumn - 1] == 1) ++liczba;
  }

  // spr dla prawego dolnego rogu
  if (lwierszy + 1 < wiersz && lkolumn + 1 < kol) {
    //prawy dolny sasiad
    if (obecnePok[lwierszy + 1][lkolumn + 1] == 1) ++liczba;
  }

  // spr ostatni wiersz
  if (lwierszy + 1 < wiersz) {
    //dolny sasiad
    if (obecnePok[lwierszy + 1][lkolumn] == 1) ++liczba;
  }

  return liczba;
}

/*Aktualizacja pokolenia */
function aktualizujPokolenie() {
  for (w in obecnePok) {
    for (k in obecnePok[w]) {
      obecnePok[w][k] = nastepnePok[w][k]; //nadpisujemy poprzedni stan
      nastepnePok[w][k] = 0; //ustawiamy nastepny stan na zero, czeka na kolejna zmiane
    }
  }
}

/*Aktualizacja swiata */
function aktualizujSwiat() {
  let komorka = "";
  for (w in obecnePok) {
    for (k in obecnePok[w]) {
      komorka = document.getElementById(w + "_" + k);
      if (obecnePok[w][k] == 0) {
        komorka.setAttribute("class", "martwa");
      } else {
        komorka.setAttribute("class", "zywa");
      }
    }
  }
}

/*Reprodukcja */
function reprodukcja() {
  nowePokolenie();
  aktualizujPokolenie();
  aktualizujSwiat();
  // jesli reprodukcja rozpoczeta odlicz czas jej dzialania
  if (start) {
    stoper = setTimeout(reprodukcja, czasReprodukcji);
  }
  info();
  drawPieChart();
}

function startStop() {
  let btnStartStop = document.querySelector("#btnReprodukcja");

  if (!start) {
    start = true;
    btnStartStop.value = "Przerwij reprodukcję";
    reprodukcja();
  } else {
    start = false;
    btnStartStop.value = "Rozpocznij reprodukcję";
    clearTimeout(stoper);
  }
}

/*Zresetuj swiat */
function zresetujSwiat() {
  start = false; //ustawienie flagi
  let btnStartStop = document.querySelector("#btnReprodukcja");
  btnStartStop.value = "Rozpocznij reprodukcję"; //zmiana przycisku
  clearTimeout(stoper); //wyzerowanie stopera
  inicjalizujTablice(); //wyzerowanie tablicy
  aktualizujSwiat(); //skoro tablica wyzerowana -> ustawienie wygladu komorek na martwe

  lpokolen = 0;
  document.getElementById("lIteracji").innerHTML = 0;
  document.getElementById("lZywychKomorek").innerHTML = 0;
  document.getElementById("lMartwychKomorek").innerHTML = 1600;
  drawPieChart();
}

/*Liczba zywych i martwych komorek */
function liczKomorki() {
  var lm = 0;
  for (w in obecnePok) {
    for (k in obecnePok[w]) {
      if (obecnePok[w][k] == 0) {
        lm++;
      }
    }
  }
  return lm;
}

/*Informacje o stanie gry */
function info() {
  let iter = document.getElementById("lIteracji");
  let lzywych = document.getElementById("lZywychKomorek");
  let lmartwych = document.getElementById("lMartwychKomorek");

  iter.innerHTML = lpokolen;
  lzywych.innerHTML = wiersz * kol - liczKomorki();
  lmartwych.innerHTML = liczKomorki();
}

/*Narysowanie wykresu kolowego */
function drawPieChart() {
  //pobranie pierwszego i jedynego elementu svg z dokumentu
  const wykres = document.querySelector("svg");

  //jeden z kawalkow ma zawsze 100% wielkosci dla uzupelnienia wykresu
  const kawalki = [
    { procent: 1, kolor: "whitesmoke" },
    { percent: 0, kolor: "#ff9900" },
  ];

  //max liczba komorek
  let suma = wiersz * kol;

  //aktualizacja procentu zywych komorek na wykresie
  let zyweProcent = document.getElementById("lZywychKomorek").innerHTML / suma;
  var zywyKawalek = kawalki[1];
  zywyKawalek.procent = zyweProcent;

  let obecnyKawalek = 0;

  function pobierzKoordynaty(procent) {
    const x = Math.cos(2 * Math.PI * procent);
    const y = Math.sin(2 * Math.PI * procent);
    return [x, y];
  }

  kawalki.forEach((kawalek) => {
    //poczatkowe koordynaty
    const [startX, startY] = pobierzKoordynaty(obecnyKawalek);

    // kazdy kawalek zaczyna sie tam gdzie inny sie konczy
    obecnyKawalek += kawalek.procent;

    //koncowe koordynaty -> jednoczesnie poczatkowe dla d
    const [endX, endY] = pobierzKoordynaty(obecnyKawalek);

    // jezeli kawalek zajmuje ponad 50% wez wiekszy łuk
    const wiekszyLuk = kawalek.procent > 0.5 ? 1 : 0;

    // tablica z danymi sciezki
    const sciezkaTab = [
      `M ${startX} ${startY}`, // odpowiada za przeniesienie punktu
      `A 1 1 0 ${wiekszyLuk} 1 ${endX} ${endY}`, // odpowiada za łuk
      `L 0 0`, // odpowiada za linie czyli promien kola
    ];

    // stworzenie <path> i dodanie do niego elementu <svg>
    const sciezka = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    sciezka.setAttribute("d", sciezkaTab);
    sciezka.setAttribute("fill", kawalek.kolor);
    wykres.appendChild(sciezka);
  });
}

//po zaladowaniu strony
function poczatekGry() {
  stworzSwiat();
  stworzTablice();
  inicjalizujTablice();
  drawPieChart();
}

function wylosujSwiat() {
  zresetujSwiat();
  let komorka = "";
  for (w in obecnePok) {
    for (k in obecnePok[w]) {
      komorka = document.getElementById(w + "_" + k);
      // obecnePok[w][k] = Math.floor(Math.random() *2); //prawdopodobienstwo 50%
      //prawdopodobienstwo 30%:
      if (Math.random() <= 0.3) {
        obecnePok[w][k] = 1;
      } else {
        obecnePok[w][k] = 0;
      }
      if (obecnePok[w][k] == 0) {
        komorka.setAttribute("class", "martwa");
      } else {
        komorka.setAttribute("class", "zywa");
      }
    }
  }
  aktualizujSwiat();
  info();
  drawPieChart();
}

$(document).ready(poczatekGry);
