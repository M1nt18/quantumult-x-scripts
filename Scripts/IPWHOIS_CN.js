// Quantumult X geo_location_checker parser for ipwho.is
// geo_location_checker = http://ipwho.is/?lang=zh-CN, https://raw.githubusercontent.com/M1nt18/quantumult-x-scripts/main/Scripts/IPWHOIS_CN.js

if ($response.statusCode != 200) {
  $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

if (obj["success"] === false) {
  $done(null);
}

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

var ip = pick(obj["ip"], "\u672a\u77e5IP");
var code = pick(obj["country_code"], "");
var flag = flagEmoji(code);
var country = pick(obj["country"], "\u672a\u77e5\u56fd\u5bb6");
var region = pick(obj["region"], "");
var city = pick(obj["city"], "");
var asn = obj["connection"] && obj["connection"]["asn"] ? "AS" + obj["connection"]["asn"] : "\u672a\u77e5ASN";
var org = obj["connection"] ? pick(obj["connection"]["org"] || obj["connection"]["isp"], "\u672a\u77e5\u670d\u52a1\u5546") : "\u672a\u77e5\u670d\u52a1\u5546";
var isp = obj["connection"] ? pick(obj["connection"]["isp"] || obj["connection"]["org"], org) : org;
var timezone = obj["timezone"] ? pick(obj["timezone"]["id"], "") : "";
var location = [country, region, city].filter(function (x) { return x && x.length > 0; }).join(" ");

var title = (flag ? flag + " " : "") + (city || region || country);
var subtitle = org;
var description =
  "\u670d\u52a1\u5546:" + org + "\n" +
  "\u5730\u533a:" + location + "\n" +
  "ASN:" + asn + "\n" +
  "ISP:" + isp + "\n" +
  "IP:" + ip + "\n" +
  "\u65f6\u533a:" + timezone;

$done({ title, subtitle, ip, description });
