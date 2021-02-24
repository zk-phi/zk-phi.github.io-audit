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

const extractFields = (res) => {
    const loadtime = Math.floor(
        res.audits["network-requests"].details.items[0].endTime
    );

    const brokeDown = res.audits["mainthread-work-breakdown"].details.items.reduce((l, r) => {
        l[r.group] = r.duration;
        return l;
    }, {});

    return [
        new Date().toLocaleString("ja-JP"),
        Math.floor(res.audits["network-requests"].details.items[0].endTime),
        res.audits.metrics.details.items[0].observedDomContentLoaded,
        res.audits.metrics.details.items[0].observedFirstPaint,
        res.audits.metrics.details.items[0].observedFirstContentfulPaint,
        res.audits.metrics.details.items[0].observedLargestContentfulPaint,
        res.audits.metrics.details.items[0].observedFirstVisualChange,
        res.audits.metrics.details.items[0].observedLastVisualChange,
        res.audits.metrics.details.items[0].observedCumulativeLayoutShift,
        Math.floor(brokeDown.styleLayout),
        Math.floor(brokeDown.other),
        Math.floor(brokeDown.paintCompositeRender),
        Math.floor(brokeDown.scriptEvaluation),
        Math.floor(brokeDown.parseHTML),
        Math.floor(brokeDown.scriptParseCompile),
    ];
}

(async () => console.log(extractFields(await runLighthouse()).join('\t')))();
