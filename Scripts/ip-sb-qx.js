// Quantumult X geo_location_checker parser for https://api.ip.sb/geoip
// Config example:
// geo_location_checker=https://api.ip.sb/geoip, https://raw.githubusercontent.com/OWNER/quantumult-x-scripts/main/Scripts/ip-sb-qx.js

function pick() {
  for (const value of arguments) {
    if (value !== undefined && value !== null && `${value}`.length > 0) return `${value}`;
  }
  return "";
}

try {
  const status = typeof $response !== "undefined" ? $response.statusCode : 0;
  if (status && status !== 200) {
    $done({
      title: "IP.SB ????",
      subtitle: `HTTP ${status}`,
      ip: "",
      description: ""
    });
  } else {
    const body = typeof $response !== "undefined" ? $response.body : "{}";
    const data = JSON.parse(body || "{}");

    const ip = pick(data.ip);
    const country = pick(data.country, data.country_code);
    const city = pick(data.city);
    const region = pick(data.region);
    const asnRaw = pick(data.asn);
    const asn = asnRaw && !asnRaw.toUpperCase().startsWith("AS") ? `AS${asnRaw}` : asnRaw;
    const org = pick(data.organization, data.org, data.isp);
    const timezone = pick(data.timezone);

    const location = [country, region, city].filter(Boolean).join(" ");
    const title = [ip, location].filter(Boolean).join(" | ");
    const subtitle = [asn, org].filter(Boolean).join(" | ");
    const description = [
      ip ? `IP: ${ip}` : "",
      location ? `??: ${location}` : "",
      asn ? `ASN: ${asn}` : "",
      org ? `??: ${org}` : "",
      timezone ? `??: ${timezone}` : ""
    ].filter(Boolean).join("\n");

    $done({ title, subtitle, ip, description });
  }
} catch (error) {
  $done({
    title: "IP.SB ????",
    subtitle: `${error}`,
    ip: "",
    description: ""
  });
}
