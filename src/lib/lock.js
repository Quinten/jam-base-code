let parseUri = (sourceUri) => {
    let uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
    return uriParts[3];
};

export default () => {
    let addressToCheck = '';
    try {
        addressToCheck = window.top.location.href;
    } catch(e) {
        // we are in an iframe
        addressToCheck = document.referrer;
    }

    let m = [
        'c3VwZXJuYXBpZS5jb20=',
        'cXVpbnRlbi5naXRodWIuaW8=',
        'c3VwZXJuYXBpZS5pdGNoLmlv',
        'c3VwZXJuYXBpZS5naXRodWIuaW8=',
        'aHRtbC1jbGFzc2ljLml0Y2guem9uZQ==',
        'djZwOWQ5dDQuc3NsLmh3Y2RuLm5ldA==',
        'bG9jYWxob3N0',
        'MC4wLjAuMA=='
    ];

    if (m.indexOf(btoa(parseUri(addressToCheck))) > -1) {
        return true;
    } else {
        ['click', 'keyup'].forEach(ev => {
            window.addEventListener(ev, e => {
                window.top.location = atob('aHR0cHM6Ly9zdXBlcm5hcGllLmNvbS8=');
            });
        });
    }
};
