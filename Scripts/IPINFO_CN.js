// Quantumult X geo_location_checker parser for ipinfo.io/json
if ($response.statusCode != 200) { $done(null); }
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

function countryName(code, fallback) {
  code = String(code || "").toUpperCase();
  var m = {
    "AD":"\u5b89\u9053\u5c14","AE":"\u963f\u8054\u914b","AF":"\u963f\u5bcc\u6c57","AG":"\u5b89\u63d0\u74dc\u548c\u5df4\u5e03\u8fbe","AI":"\u5b89\u572d\u62c9","AL":"\u963f\u5c14\u5df4\u5c3c\u4e9a","AM":"\u4e9a\u7f8e\u5c3c\u4e9a","AO":"\u5b89\u54e5\u62c9","AR":"\u963f\u6839\u5ef7","AS":"\u7f8e\u5c5e\u8428\u6469\u4e9a","AT":"\u5965\u5730\u5229","AU":"\u6fb3\u5927\u5229\u4e9a","AW":"\u963f\u9c81\u5df4","AX":"\u5965\u5170\u7fa4\u5c9b","AZ":"\u963f\u585e\u62dc\u7586",
    "BA":"\u6ce2\u9ed1","BB":"\u5df4\u5df4\u591a\u65af","BD":"\u5b5f\u52a0\u62c9\u56fd","BE":"\u6bd4\u5229\u65f6","BF":"\u5e03\u57fa\u7eb3\u6cd5\u7d22","BG":"\u4fdd\u52a0\u5229\u4e9a","BH":"\u5df4\u6797","BI":"\u5e03\u9686\u8fea","BJ":"\u8d1d\u5b81","BM":"\u767e\u6155\u5927","BN":"\u6587\u83b1","BO":"\u73bb\u5229\u7ef4\u4e9a","BR":"\u5df4\u897f","BS":"\u5df4\u54c8\u9a6c","BT":"\u4e0d\u4e39","BW":"\u535a\u8328\u74e6\u7eb3","BY":"\u767d\u4fc4\u7f57\u65af","BZ":"\u4f2f\u5229\u5179",
    "CA":"\u52a0\u62ff\u5927","CD":"\u521a\u679c\u91d1","CF":"\u4e2d\u975e","CG":"\u521a\u679c\u5e03","CH":"\u745e\u58eb","CI":"\u79d1\u7279\u8fea\u74e6","CL":"\u667a\u5229","CM":"\u5580\u9ea6\u9686","CN":"\u4e2d\u56fd","CO":"\u54e5\u4f26\u6bd4\u4e9a","CR":"\u54e5\u65af\u8fbe\u9ece\u52a0","CU":"\u53e4\u5df4","CV":"\u4f5b\u5f97\u89d2","CY":"\u585e\u6d66\u8def\u65af","CZ":"\u6377\u514b",
    "DE":"\u5fb7\u56fd","DJ":"\u5409\u5e03\u63d0","DK":"\u4e39\u9ea6","DM":"\u591a\u7c73\u5c3c\u514b","DO":"\u591a\u7c73\u5c3c\u52a0","DZ":"\u963f\u5c14\u53ca\u5229\u4e9a","EC":"\u5384\u74dc\u591a\u5c14","EE":"\u7231\u6c99\u5c3c\u4e9a","EG":"\u57c3\u53ca","ES":"\u897f\u73ed\u7259","ET":"\u57c3\u585e\u4fc4\u6bd4\u4e9a","FI":"\u82ac\u5170","FJ":"\u6590\u6d4e","FR":"\u6cd5\u56fd",
    "GB":"\u82f1\u56fd","GD":"\u683c\u6797\u7eb3\u8fbe","GE":"\u683c\u9c81\u5409\u4e9a","GF":"\u6cd5\u5c5e\u572d\u4e9a\u90a3","GH":"\u52a0\u7eb3","GI":"\u76f4\u5e03\u7f57\u9640","GL":"\u683c\u9675\u5170","GM":"\u5188\u6bd4\u4e9a","GN":"\u51e0\u5185\u4e9a","GR":"\u5e0c\u814a","GT":"\u5371\u5730\u9a6c\u62c9","GU":"\u5173\u5c9b","GY":"\u572d\u4e9a\u90a3",
    "HK":"\u4e2d\u56fd\u9999\u6e2f","HN":"\u6d2a\u90fd\u62c9\u65af","HR":"\u514b\u7f57\u5730\u4e9a","HT":"\u6d77\u5730","HU":"\u5308\u7259\u5229","ID":"\u5370\u5ea6\u5c3c\u897f\u4e9a","IE":"\u7231\u5c14\u5170","IL":"\u4ee5\u8272\u5217","IN":"\u5370\u5ea6","IQ":"\u4f0a\u62c9\u514b","IR":"\u4f0a\u6717","IS":"\u51b0\u5c9b","IT":"\u610f\u5927\u5229","JM":"\u7259\u4e70\u52a0","JO":"\u7ea6\u65e6","JP":"\u65e5\u672c",
    "KE":"\u80af\u5c3c\u4e9a","KG":"\u5409\u5c14\u5409\u65af\u65af\u5766","KH":"\u67ec\u57d4\u5be8","KP":"\u671d\u9c9c","KR":"\u97e9\u56fd","KW":"\u79d1\u5a01\u7279","KY":"\u5f00\u66fc\u7fa4\u5c9b","KZ":"\u54c8\u8428\u514b\u65af\u5766","LA":"\u8001\u631d","LB":"\u9ece\u5df4\u5ae9","LK":"\u65af\u91cc\u5170\u5361","LR":"\u5229\u6bd4\u91cc\u4e9a","LT":"\u7acb\u9676\u5b9b","LU":"\u5362\u68ee\u5821","LV":"\u62c9\u8131\u7ef4\u4e9a","LY":"\u5229\u6bd4\u4e9a",
    "MA":"\u6469\u6d1b\u54e5","MC":"\u6469\u7eb3\u54e5","MD":"\u6469\u5c14\u591a\u74e6","ME":"\u9ed1\u5c71","MG":"\u9a6c\u8fbe\u52a0\u65af\u52a0","MK":"\u5317\u9a6c\u5176\u987f","ML":"\u9a6c\u91cc","MM":"\u7f05\u7538","MN":"\u8499\u53e4","MO":"\u4e2d\u56fd\u6fb3\u95e8","MR":"\u6bdb\u91cc\u5854\u5c3c\u4e9a","MT":"\u9a6c\u8033\u4ed6","MU":"\u6bdb\u91cc\u6c42\u65af","MV":"\u9a6c\u5c14\u4ee3\u592b","MX":"\u58a8\u897f\u54e5","MY":"\u9a6c\u6765\u897f\u4e9a","MZ":"\u83ab\u6851\u6bd4\u514b",
    "NA":"\u7eb3\u7c73\u6bd4\u4e9a","NG":"\u5c3c\u65e5\u5229\u4e9a","NI":"\u5c3c\u52a0\u62c9\u74dc","NL":"\u8377\u5170","NO":"\u632a\u5a01","NP":"\u5c3c\u6cca\u5c14","NZ":"\u65b0\u897f\u5170","OM":"\u963f\u66fc","PA":"\u5df4\u62ff\u9a6c","PE":"\u79d8\u9c81","PF":"\u6cd5\u5c5e\u6ce2\u5229\u5c3c\u897f\u4e9a","PG":"\u5df4\u5e03\u4e9a\u65b0\u51e0\u5185\u4e9a","PH":"\u83f2\u5f8b\u5bbe","PK":"\u5df4\u57fa\u65af\u5766","PL":"\u6ce2\u5170","PR":"\u6ce2\u591a\u9ece\u5404","PS":"\u5df4\u52d2\u65af\u5766","PT":"\u8461\u8404\u7259","PY":"\u5df4\u62c9\u572d",
    "QA":"\u5361\u5854\u5c14","RO":"\u7f57\u9a6c\u5c3c\u4e9a","RS":"\u585e\u5c14\u7ef4\u4e9a","RU":"\u4fc4\u7f57\u65af","RW":"\u5362\u65fa\u8fbe","SA":"\u6c99\u7279\u963f\u62c9\u4f2f","SD":"\u82cf\u4e39","SE":"\u745e\u5178","SG":"\u65b0\u52a0\u5761","SI":"\u65af\u6d1b\u6587\u5c3c\u4e9a","SK":"\u65af\u6d1b\u4f10\u514b","SN":"\u585e\u5185\u52a0\u5c14","SO":"\u7d22\u9a6c\u91cc","SR":"\u82cf\u91cc\u5357","SV":"\u8428\u5c14\u74e6\u591a","SY":"\u53d9\u5229\u4e9a",
    "TH":"\u6cf0\u56fd","TJ":"\u5854\u5409\u514b\u65af\u5766","TL":"\u4e1c\u5e1d\u6c76","TN":"\u7a81\u5c3c\u65af","TR":"\u571f\u8033\u5176","TT":"\u7279\u7acb\u5c3c\u8fbe\u548c\u591a\u5df4\u54e5","TW":"\u53f0\u6e7e","TZ":"\u5766\u6851\u5c3c\u4e9a","UA":"\u4e4c\u514b\u5170","UG":"\u4e4c\u5e72\u8fbe","US":"\u7f8e\u56fd","UY":"\u4e4c\u62c9\u572d","UZ":"\u4e4c\u5179\u522b\u514b\u65af\u5766","VE":"\u59d4\u5185\u745e\u62c9","VN":"\u8d8a\u5357","ZA":"\u5357\u975e","ZM":"\u8d5e\u6bd4\u4e9a","ZW":"\u6d25\u5df4\u5e03\u97e6"
  };
  return m[code] || fallback || code || "\u672a\u77e5\u56fd\u5bb6";
}

function placeName(name) {
  var m = {
    "Hong Kong":"\u9999\u6e2f","Macau":"\u6fb3\u95e8","Macao":"\u6fb3\u95e8","Tokyo":"\u4e1c\u4eac","Osaka":"\u5927\u962a","Nagoya":"\u540d\u53e4\u5c4b","Fukuoka":"\u798f\u5188","Sapporo":"\u672d\u5e4c","Yokohama":"\u6a2a\u6ee8","Seoul":"\u9996\u5c14","Busan":"\u91dc\u5c71","Taipei":"\u53f0\u5317","Kaohsiung":"\u9ad8\u96c4","Singapore":"\u65b0\u52a0\u5761",
    "Los Angeles":"\u6d1b\u6749\u77f6","San Jose":"\u5723\u4f55\u585e","San Francisco":"\u65e7\u91d1\u5c71","Seattle":"\u897f\u96c5\u56fe","New York":"\u7ebd\u7ea6","Chicago":"\u829d\u52a0\u54e5","Dallas":"\u8fbe\u62c9\u65af","Miami":"\u8fc8\u963f\u5bc6","Ashburn":"\u963f\u4ec0\u672c","Washington":"\u534e\u76db\u987f","Atlanta":"\u4e9a\u7279\u5170\u5927","Phoenix":"\u51e4\u51f0\u57ce","Denver":"\u4e39\u4f5b","Las Vegas":"\u62c9\u65af\u7ef4\u52a0\u65af","Houston":"\u4f11\u65af\u6566",
    "London":"\u4f26\u6566","Manchester":"\u66fc\u5f7b\u65af\u7279","Frankfurt":"\u6cd5\u5170\u514b\u798f","Dusseldorf":"\u675c\u585e\u5c14\u591a\u592b","D\u00fcsseldorf":"\u675c\u585e\u5c14\u591a\u592b","Berlin":"\u67cf\u6797","Munich":"\u6155\u5c3c\u9ed1","Hamburg":"\u6c49\u5821","Paris":"\u5df4\u9ece","Marseille":"\u9a6c\u8d5b","Amsterdam":"\u963f\u59c6\u65af\u7279\u4e39","Rotterdam":"\u9e7f\u7279\u4e39","Vienna":"\u7ef4\u4e5f\u7eb3","Zurich":"\u82cf\u9ece\u4e16","Stockholm":"\u65af\u5fb7\u54e5\u5c14\u6469","Copenhagen":"\u54e5\u672c\u54c8\u6839","Oslo":"\u5965\u65af\u9646","Helsinki":"\u8d6b\u5c14\u8f9b\u57fa","Madrid":"\u9a6c\u5fb7\u91cc","Barcelona":"\u5df4\u585e\u7f57\u90a3","Milan":"\u7c73\u5170","Rome":"\u7f57\u9a6c","Warsaw":"\u534e\u6c99","Prague":"\u5e03\u62c9\u683c","Budapest":"\u5e03\u8fbe\u4f69\u65af",
    "England":"\u82f1\u683c\u5170","California":"\u52a0\u5229\u798f\u5c3c\u4e9a","New Jersey":"\u65b0\u6cfd\u897f","Texas":"\u5f97\u514b\u8428\u65af","Virginia":"\u5f17\u5409\u5c3c\u4e9a","Oregon":"\u4fc4\u52d2\u5188","Washington State":"\u534e\u76db\u987f\u5dde","Hong Kong":"\u9999\u6e2f","Macau":"\u6fb3\u95e8"
  };
  return m[name] || name || "";
}

var ip = pick(obj["ip"], "\u672a\u77e5IP");
var code = pick(obj["country"], "").toUpperCase();
var country = countryName(code, "");
var region = placeName(pick(obj["region"], ""));
var city = placeName(pick(obj["city"], ""));
var orgRaw = pick(obj["org"], "\u672a\u77e5\u670d\u52a1\u5546");
var asnMatch = orgRaw.match(/^(AS\d+)\s+(.+)$/i);
var asn = asnMatch ? asnMatch[1].toUpperCase() : "";
var org = asnMatch ? asnMatch[2] : orgRaw;
var timezone = pick(obj["timezone"], "");
var flag = flagEmoji(code);
var locParts = [country, region, city].filter(function(x){ return x && x.length > 0; });
var title = (flag ? flag + " " : "") + (city || region || country);
var subtitle = org;
var description = "\u670d\u52a1\u5546:" + org + "\n" + "\u5730\u533a:" + locParts.join(" ") + "\n" + "ASN:" + asn + "\n" + "IP:" + ip + "\n" + "\u65f6\u533a:" + timezone;
$done({ title, subtitle, ip, description });
