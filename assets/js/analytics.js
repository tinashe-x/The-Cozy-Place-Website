(function () {
  var MEASUREMENT_ID = window.COSY_GA4_ID || "";
  if (!MEASUREMENT_ID) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-analytics]");
    if (!a || typeof gtag !== "function") return;
    gtag("event", a.getAttribute("data-analytics"), { transport_type: "beacon" });
  });
})();
