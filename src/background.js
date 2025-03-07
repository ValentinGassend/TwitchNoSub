
chrome.webNavigation.onBeforeNavigate.addListener(function () {

}, {
    url: [{ hostContains: "twitch" }]
});

var isChrome = chrome.declarativeNetRequest != undefined;
var cdnLink = '';

if (isChrome) {

    chrome.runtime.onStartup.addListener(() => {
        chrome.runtime.reload();
    });
}


const app = () => {
    if (isChrome) {

        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                'id': 1001,
                'priority': 1,
                'action': {
                    'type': 'redirect',
                    'redirect': { url: cdnLink }
                },
                'condition': { urlFilter: 'https://static.twitchcdn.net/assets/amazon-ivs-wasmworker.min-*.js' }
            }],
            removeRuleIds: [1001]
        });

        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                'id': 1002,
                'priority': 1,
                'action': {
                    'type': 'redirect',
                    'redirect': { url: cdnLink }
                },
                'condition': { urlFilter: 'https://assets.twitch.tv/assets/amazon-ivs-wasmworker.min-*.js' }
            }],
            removeRuleIds: [1002]
        });
    } else {

        browser.webRequest.onBeforeRequest.addListener(() => {
            return { redirectUrl: cdnLink };
        }, {
            urls: [
                "https://static.twitchcdn.net/assets/amazon-ivs-wasmworker.min-*.js",
                "https://assets.twitch.tv/assets/amazon-ivs-wasmworker.min-*.js"
            ],
            types: ["main_frame", "script"]
        }, ["blocking"]);
    }

};

(async () => {

    try {
        const response = await fetch("https://api.github.com/repos/besuper/TwitchNoSub/commits");
        const content = await response.json();

        var latestCommit = content[0].sha;

        console.log("Lastest commit sha: " + latestCommit);

        cdnLink = `https://cdn.jsdelivr.net/gh/besuper/TwitchNoSub@${latestCommit}/src/amazon-ivs-worker.min.js`;
    } catch (e) {
        console.log(e);

        cdnLink = `https://cdn.jsdelivr.net/gh/besuper/TwitchNoSub/src/amazon-ivs-worker.min.js`;
    }

    console.log("CDN link : " + cdnLink);

    app();
})();