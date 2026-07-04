// Quantumult X geo_location_checker parser for https://api.ip.sb/geoip
// geo_location_checker=https://api.ip.sb/geoip, https://cdn.jsdelivr.net/gh/M1nt18/quantumult-x-scripts@main/Scripts/ip-sb-qx.js

if ($response.statusCode != 200) {
  $done(null);
}

function pick(value, fallback) {
  if (value !== undefined && value !== null && String(value).length > 0) return String(value);
  return fallback || "";
}

function mapCountry(code, name) {
  var c = String(code || "").toUpperCase();
  var m = {
    HK: "\u4e2d\u56fd\u9999\u6e2f",
    MO: "\u4e2d\u56fd\u6fb3\u95e8",
    TW: "\u4e2d\u56fd\u53f0\u6e7e",
    CN: "\u4e2d\u56fd",
    JP: "\u65e5\u672c",
    KR: "\u97e9\u56fd",
    SG: "\u65b0\u52a0\u5761",
    US: "\u7f8e\u56fd",
    GB: "\u82f1\u56fd",
    DE: "\u5fb7\u56fd",
    FR: "\u6cd5\u56fd",
    NL: "\u8377\u5170",
    CA: "\u52a0\u62ff\u5927",
    AU: "\u6fb3\u5927\u5229\u4e9a"
  };
  return m[c] || pick(name, c || "\u672a\u77e5\u5730\u533a");
}

function mapCity(name) {
  var n = pick(name, "");
  var m = {
    "Hong Kong": "\u9999\u6e2f",
    "Singapore": "\u65b0\u52a0\u5761",
    "Tokyo": "\u4e1c\u4eac",
    "Osaka": "\u5927\u962a",
    "Seoul": "\u9996\u5c14",
    "Taipei": "\u53f0\u5317",
    "Los Angeles": "\u6d1b\u6749\u77f6",
    "San Jose": "\u5723\u4f55\u585e",
    "New York": "\u7ebd\u7ea6",
    "London": "\u4f26\u6566",
    "Frankfurt": "\u6cd5\u5170\u514b\u798f",
    "Amsterdam": "\u963f\u59c6\u65af\u7279\u4e39",
    "Paris": "\u5df4\u9ece"
  };
  return m[n] || n || "\u672a\u77e5\u57ce\u5e02";
}

var obj = JSON.parse($response.body || "{}");
var ip = pick(obj.ip || obj.query, "\u672a\u77e5IP");
var code = pick(obj.country_code || obj.countryCode, "").toUpperCase();
var country = mapCountry(code, obj.country);
var region = pick(obj.region || obj.region_name, "");
var city = mapCity(obj.city);
var asnRaw = pick(obj.asn, "");
var asn = asnRaw ? (asnRaw.indexOf("AS") === 0 ? asnRaw : "AS" + asnRaw) : "\u672a\u77e5ASN";
var isp = pick(obj.isp || obj.organization || obj.asn_organization || obj.org, "\u672a\u77e5\u670d\u52a1\u5546");
var timezone = pick(obj.timezone, "\u672a\u77e5\u65f6\u533a");
var area = [country, region, city].filter(function (x) { return x && x.length > 0; }).join(" ");

var title = city + " | " + ip;
var subtitle = "\u670d\u52a1\u5546: " + isp + " | " + asn;
var description =
  "\u5730\u533a: " + area + "\n" +
  "ASN: " + asn + "\n" +
  "\u670d\u52a1\u5546: " + isp + "\n" +
  "IP: " + ip + "\n" +
  "\u65f6\u533a: " + timezone;

$done({ title: title, subtitle: subtitle, ip: ip, description: description });
