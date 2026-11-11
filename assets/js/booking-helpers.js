(function (global) {
  var WA_NUMBER = "27646662761";
  var RATES = {
    whole: { short: 59, long: 55 },
    one: { short: 39, long: 35 }
  };

  function parseStayType(value) {
    if (!value) return null;
    return /one bedroom/i.test(value) ? "one" : "whole";
  }

  function nightsBetween(checkin, checkout) {
    var a = new Date(checkin + "T12:00:00");
    var b = new Date(checkout + "T12:00:00");
    var nights = Math.round((b - a) / 86400000);
    return nights > 0 ? nights : 0;
  }

  function estimateStayTotal(opts) {
    var stayType = opts && opts.stayType;
    var checkin = opts && opts.checkin;
    var checkout = opts && opts.checkout;
    var key =
      typeof stayType === "string" && (stayType === "one" || stayType === "whole")
        ? stayType
        : parseStayType(stayType);
    var nights = nightsBetween(checkin, checkout);
    if (!key || nights < 1) return null;
    var rateBand = nights >= 11 ? "long" : "short";
    var nightlyRate = RATES[key][rateBand];
    return {
      nights: nights,
      nightlyRate: nightlyRate,
      total: nights * nightlyRate,
      rateBand: rateBand,
      stayKey: key
    };
  }

  function buildWhatsAppUrl(opts) {
    var stayType = (opts && opts.stayType) || "one or two-bedroom";
    var from = (opts && opts.checkin) || "[check-in]";
    var to = (opts && opts.checkout) || "[check-out]";
    var n = (opts && opts.guests) || "[number]";
    var text =
      "Hi, I'd like to enquire about staying at The Cosy Place. I'm interested in the " +
      stayType +
      " option from " +
      from +
      " to " +
      to +
      " for " +
      n +
      " guests. Could you please confirm availability?";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }

  global.CosyBooking = {
    RATES: RATES,
    estimateStayTotal: estimateStayTotal,
    buildWhatsAppUrl: buildWhatsAppUrl,
    parseStayType: parseStayType
  };
})(window);
