let csscache = [];
export default (rules) => {
    if (csscache.includes(rules)) {
        return;
    }
    document.head.innerHTML += `<style>${rules}</style>`;
    csscache.push(rules);
}
