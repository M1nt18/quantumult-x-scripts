// Quantumult X geo_location_checker parser for https://api.ip.sb/geoip
// ???geo_location_checker=https://api.ip.sb/geoip, https://cdn.jsdelivr.net/gh/M1nt18/quantumult-x-scripts@main/Scripts/ip-sb-qx.js

if ($response.statusCode != 200) {
  $done(null);
}

function v(x, fallback) {
  if (x !== undefined && x !== null && String(x).length > 0) return String(x);
  return fallback || "??";
}

var countryCN = {
  "HK": "????", "MO": "????", "TW": "????", "CN": "??", "JP": "??", "KR": "??",
  "SG": "???", "US": "??", "GB": "??", "DE": "??", "FR": "??", "NL": "??",
  "CA": "???", "AU": "????", "RU": "???", "TH": "??", "VN": "??", "MY": "????",
  "PH": "???", "ID": "?????", "IN": "??", "TR": "???", "BR": "??", "AR": "???"
};

var cityCN = {
  "Hong Kong": "??", "Singapore": "???", "Tokyo": "??", "Osaka": "??", "Seoul": "??",
  "Taipei": "??", "Los Angeles": "???", "San Jose": "???", "New York": "??",
  "London": "??", "Frankfurt": "????", "Amsterdam": "?????", "Paris": "??"
};

var flags = {
  "HK": "????", "MO": "????", "TW": "????", "CN": "????", "JP": "????", "KR": "????", "SG": "????",
  "US": "????", "GB": "????", "DE": "????", "FR": "????", "NL": "????", "CA": "????", "AU": "????",
  "RU": "????", "TH": "????", "VN": "????", "MY": "????", "PH": "????", "ID": "????", "IN": "????"
};

var body = $response.body;
var obj = JSON.parse(body || "{}");

var code = v(obj["country_code"] || obj["countryCode"], "").toUpperCase();
var flag = flags[code] || "???";
var country = countryCN[code] || v(obj["country"], code || "????");
var region = v(obj["region"] || obj["region_name"], "");
var cityRaw = v(obj["city"], "????");
var city = cityCN[cityRaw] || cityRaw;
var ip = v(obj["ip"] || obj["query"], "??IP");
var asnRaw = v(obj["asn"], "");
var asn = asnRaw ? (asnRaw.indexOf("AS") === 0 ? asnRaw : "AS" + asnRaw) : "??ASN";
var isp = v(obj["isp"] || obj["organization"] || obj["asn_organization"] || obj["org"], "?????");
var tz = v(obj["timezone"], "????");
var area = [country, region, city].filter(function (x) { return x && x !== "??"; }).join(" ");

var title = flag + " " + city;
var subtitle = "???: " + isp;
var description =
  "??: " + area + "\n" +
  "ASN: " + asn + "\n" +
  "???: " + isp + "\n" +
  "IP: " + ip + "\n" +
  "??: " + tz;

$done({ title: title, subtitle: subtitle, ip: ip, description: description });
