const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const runLighthouse = async () => {
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless']
    });

    const runnerResult = await lighthouse('https://zk-phi.github.io/', {
        output: 'json',
        onlyCategories: ['performance'],
        port: chrome.port
    });

    await chrome.kill();
    return JSON.parse(runnerResult.report);
};

const processResult = (res) => {
    const loadtime = Math.floor(
        res.audits["network-requests"].details.items[0].endTime
    );

    console.log([
        new Date().toLocaleString("ja-JP"),
        Math.floor(res.audits["network-requests"].details.items[0].endTime),
        res.audits.metrics.details.items[0].observedDomContentLoaded,
        res.audits.metrics.details.items[0].observedFirstPaint,
        res.audits.metrics.details.items[0].observedFirstContentfulPaint,
        res.audits.metrics.details.items[0].observedLargestContentfulPaint,
        res.audits.metrics.details.items[0].observedFirstVisualChange,
        res.audits.metrics.details.items[0].observedLastVisualChange,
        res.audits.metrics.details.items[0].observedCumulativeLayoutShift,
    ].join("\t"));
}

(async () => processResult(await runLighthouse()))();
