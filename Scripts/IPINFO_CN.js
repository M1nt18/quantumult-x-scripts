// Quantumult X geo_location_checker parser for ipinfo.io/json
// geo_location_checker = http://ipinfo.io/json, https://raw.githubusercontent.com/M1nt18/quantumult-x-scripts/main/Scripts/IPINFO_CN.js

if ($response.statusCode != 200) {
  $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

function pick(value, fallback) {
  if (value !== undefined && value !== null && String(value).length > 0) return String(value);
  return fallback || "";
}

function flagEmoji(code) {
  code = String(code || "").toUpperCase();
  if (code.length !== 2) return "";
  var first = code.charCodeAt(0) - 65 + 0x1F1E6;
  var second = code.charCodeAt(1) - 65 + 0x1F1E6;
  if (first < 0x1F1E6 || first > 0x1F1FF || second < 0x1F1E6 || second > 0x1F1FF) return "";
  return String.fromCodePoint(first) + String.fromCodePoint(second);
}

function countryName(code) {
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
    "AU": "\u6fb3\u5927\u5229\u4e9a",
    "AT": "\u5965\u5730\u5229",
    "DK": "\u4e39\u9ea6"
  };
  code = String(code || "").toUpperCase();
  return m[code] || code || "\u672a\u77e5\u56fd\u5bb6";
}

function cityName(city) {
  var m = {
    "Hong Kong": "\u9999\u6e2f",
    "Singapore": "\u65b0\u52a0\u5761",
    "Tokyo": "\u4e1c\u4eac",
    "Osaka": "\u5927\u962a",
    "Seoul": "\u9996\u5c14",
    "Taipei": "\u53f0\u5317",
    "London": "\u4f26\u6566",
    "Frankfurt": "\u6cd5\u5170\u514b\u798f",
    "Dusseldorf": "\u675c\u585e\u5c14\u591a\u592b",
    "D?sseldorf": "\u675c\u585e\u5c14\u591a\u592b",
    "Vienna": "\u7ef4\u4e5f\u7eb3"
  };
  return m[city] || city;
}

var ip = pick(obj["ip"], "\u672a\u77e5IP");
var code = pick(obj["country"], "").toUpperCase();
var flag = flagEmoji(code);
var country = countryName(code);
var region = pick(obj["region"], "");
var city = cityName(pick(obj["city"], ""));
var orgRaw = pick(obj["org"], "\u672a\u77e5\u670d\u52a1\u5546");
var asnMatch = orgRaw.match(/^(AS\d+)\s+(.+)$/i);
var asn = asnMatch ? asnMatch[1].toUpperCase() : "";
var org = asnMatch ? asnMatch[2] : orgRaw;
var timezone = pick(obj["timezone"], "");
var location = [country, region, city].filter(function (x) { return x && x.length > 0; }).join(" ");

var title = (flag ? flag + " " : "") + (city || region || country);
var subtitle = org;
var description =
  "\u670d\u52a1\u5546:" + org + "\n" +
  "\u5730\u533a:" + location + "\n" +
  "ASN:" + asn + "\n" +
  "IP:" + ip + "\n" +
  "\u65f6\u533a:" + timezone;

$done({ title, subtitle, ip, description });
