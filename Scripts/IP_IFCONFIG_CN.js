// Quantumult X geo_location_checker parser for ifconfig.co/json
// Display style follows KOP-XIAO IP_API.js, but fields match ifconfig.co.

if ($response.statusCode != 200) {
  $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

var city0 = "\u9ad8\u8c2d\u5e02";
var isp0 = "Cross-GFW.org";

function City_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return city0;
  }
}

function ISP_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return isp0;
  }
}

function countryName(code, fallback) {
  var m = {
    "HK": "\u4e2d\u56fd\u9999\u6e2f",
    "MO": "\u4e2d\u56fd\u6fb3\u95e8",
    "TW": "\u53f0\u6e7e",
    "CN": "\u4e2d\u56fd",
    "JP": "\u65e5\u672c",
    "KR": "\u97e9\u56fd",
    "SG": "\u65b0\u52a0\u5761",
    "US": "\u7f8e\u56fd",
    "GB": "\u82f1\u56fd",
    "DE": "\u5fb7\u56fd",
    "FR": "\u6cd5\u56fd",
    "NL": "\u8377\u5170",
    "CA": "\u52a0\u62ff\u5927",
    "AU": "\u6fb3\u5927\u5229\u4e9a"
  };
  code = (code || "").toUpperCase();
  return m[code] || fallback || code || "\u672a\u77e5";
}

function cityName(city) {
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
  return m[city] || city;
}

function flagEmoji(code) {
  var m = {
    "CN": "\uD83C\uDDE8\uD83C\uDDF3",
    "HK": "\uD83C\uDDED\uD83C\uDDF0",
    "MO": "\uD83C\uDDF2\uD83C\uDDF4",
    "TW": "\uD83C\uDDE8\uD83C\uDDF3",
    "JP": "\uD83C\uDDEF\uD83C\uDDF5",
    "KR": "\uD83C\uDDF0\uD83C\uDDF7",
    "SG": "\uD83C\uDDF8\uD83C\uDDEC",
    "US": "\uD83C\uDDFA\uD83C\uDDF8",
    "GB": "\uD83C\uDDEC\uD83C\uDDE7",
    "DE": "\uD83C\uDDE9\uD83C\uDDEA",
    "FR": "\uD83C\uDDEB\uD83C\uDDF7",
    "NL": "\uD83C\uDDF3\uD83C\uDDF1",
    "CA": "\uD83C\uDDE8\uD83C\uDDE6",
    "AU": "\uD83C\uDDE6\uD83C\uDDFA"
  };
  return m[(code || "").toUpperCase()] || "";
}

var code = obj["country_iso"] || obj["country_code"] || "";
var country = countryName(code, obj["country"]);
var city = cityName(obj["city"] || obj["region"] || obj["country"] || "");
var isp = obj["asn_org"] || obj["org"] || obj["isp"] || "";
var asn = obj["asn"] || "";
var ip = obj["ip"] || obj["query"] || "";
var timezone = obj["time_zone"] || obj["timezone"] || "";
var flag = flagEmoji(code);

var title = (flag ? flag + " " : "") + City_ValidCheck(city);
var subtitle = ISP_ValidCheck(isp || asn);
var description =
  "\u670d\u52a1\u5546:" + ISP_ValidCheck(isp) + "\n" +
  "\u5730\u533a:" + country + " " + City_ValidCheck(city) + "\n" +
  "ASN:" + asn + "\n" +
  "IP:" + ip + "\n" +
  "\u65f6\u533a:" + timezone;

$done({ title, subtitle, ip, description });
