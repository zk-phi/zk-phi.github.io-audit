const https = require('https');

const url = (
    'https://www.googleapis.com/pagespeedonline/v5/runPagespeed' +
    '?url=https://zk-phi.github.io/' +
    '&strategy=mobile'
);

https.get(url, (res) => {
    let buf = '';
    res.on('data', (d) => {
        buf += d;
    });
    res.on('end', (d) => {
        processResult(JSON.parse(buf));
    });
});

function processResult (res) {
    const lhres = res.lighthouseResult;

    const loadtime = Math.floor(
        lhres.audits["network-requests"].details.items[0].endTime
    );

    console.log([
        new Date().toLocaleString("ja-JP"),
        Math.floor(lhres.audits["network-requests"].details.items[0].endTime),
        lhres.audits.metrics.details.items[0].observedDomContentLoaded,
        lhres.audits.metrics.details.items[0].observedFirstPaint,
        lhres.audits.metrics.details.items[0].observedFirstContentfulPaint,
        lhres.audits.metrics.details.items[0].observedLargestContentfulPaint,
        lhres.audits.metrics.details.items[0].observedFirstVisualChange,
        lhres.audits.metrics.details.items[0].observedLastVisualChange,
    ].join("\t"));
}
