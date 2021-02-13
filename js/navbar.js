function highlight() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  var name = page.split(".");
  var element = document.getElementById(name[0]);
  element.classList.toggle("active-nav");
}

/*Górny pasek nawigacji */

//dodanie navbara do kazdej strony
$.get("navbar.html", function (data) {
  $(".navbar").replaceWith(data);
  highlight();
});
