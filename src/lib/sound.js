let AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = undefined;
if (AudioContext) {
    ctx = new AudioContext();
}
let isOn = false;
let tracks = {};
let buffercache = {};
let audiocache = {};
let blobcache = {};

let setIsOn = (value) => {
    isOn = value;
};

let getIsOn = () => {
    return isOn;
};

/*
 * @param {Object} asset - The asset to load.
 * @param {string} asset.name - The name of the asset.
 * @param {string} asset.url - The URL of the asset.
 * @param {Array} [asset.chunks] - An array of chunk objects with start and end properties.
 */
let loadAudio = (asset) => {
    if (ctx) {
        fetch(asset.url).then((response) => {
            return response.arrayBuffer();
        }).then((arrayBuffer) => {
            ctx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                if (asset.chunks) {
                    audioBuffer.chunks = asset.chunks;
                    audioBuffer.chunkIndex = -1;
                }
                buffercache[asset.name] = audioBuffer;
            });
        });
    } else {
        fetch(asset.url).then((response) => {
            return response.blob();
        }).then((blob) => {
            let fileBlob = URL.createObjectURL(blob);
            let audio = new Audio(fileBlob);
            if (asset.chunks) {
                audio.chunks = asset.chunks;
                audio.chunkIndex = -1;
            }
            audiocache[asset.name] = audio;
            blobcache[asset.name] = fileBlob;
        });
    }
};

let createAndStartBufferSource = ({
    audioBuffer = undefined,
    start = 0,
    duration = undefined,
    name = '',
    loop = false
} = {}) => {
    if (audioBuffer == undefined) {
        return;
    }
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    let trackSource = ctx.createBufferSource();
    trackSource.buffer = audioBuffer;
    trackSource.loop = loop;
    trackSource.connect(ctx.destination);
    trackSource.onended = () => {
        if (tracks[name]) {
            tracks[name] = undefined;
        }
    };
    trackSource.start(0, start, duration);
    return trackSource;
};

let play = (name) => {
    if (!isOn) {
        return;
    }
    if (ctx) {
        if (tracks[name] || !buffercache[name]) {
            return;
        }
        tracks[name] = createAndStartBufferSource({
            audioBuffer: buffercache[name],
            name: name
        });
    } else {
        if (!audiocache[name]) {
            return;
        }
        let asset = audiocache[name];
        if (asset) {
            asset.loop = false;
            asset.play();
        }
    }
};

let stop = (name) => {
    if (tracks[name]) {
        tracks[name].stop();
        return;
    }
    let asset = audiocache[name];
    if (asset) {
        asset.pause();
        asset.currentTime = 0;
    }
};

let loop = (name) => {
    if (!isOn) {
        return;
    }
    if (ctx) {
        if (tracks[name]) {
            tracks[name].loop = true;
            return;
        }
        if (!buffercache[name]) {
            return;
        }
        tracks[name] = createAndStartBufferSource({
            audioBuffer: buffercache[name],
            name: name,
            loop: true
        });
    } else {
        let asset = audiocache[name];
        if (asset) {
            asset.loop = true;
            asset.play();
        }
    }
};

let playRandom = (name) => {
    if (!isOn) {
        return;
    }
    let asset = ctx ? buffercache[name] : audiocache[name];
    if (asset) {
        if (!asset.chunks) {
            play(name);
            return;
        }
        asset.chunkIndex = Math.floor(Math.random() * asset.chunks.length);
        playChunk(asset, name);
    }
};

let playUp = (name) => {
    if (!isOn) {
        return;
    }
    let asset = ctx ? buffercache[name] : audiocache[name];
    if (asset) {
        if (!asset.chunks) {
            this.play(name);
            return;
        }
        asset.chunkIndex += 1;
        if (asset.chunkIndex >= asset.chunks.length) {
            asset.chunkIndex = 0;
        }
        playChunk(asset, name);
    }
};

let playDown = (name) => {
    if (!isOn) {
        return;
    }
    let asset = ctx ? buffercache[name] : audiocache[name];
    if (asset) {
        if (!asset.chunks) {
            play(name);
            return;
        }
        asset.chunkIndex -= 1;
        if (asset.chunkIndex < 0) {
            asset.chunkIndex = asset.chunks.length - 1;
        }
        playChunk(asset, name);
    }
};

let playChunk = (asset, name) => {
    let end = asset.chunks[asset.chunkIndex].end;
    let start = asset.chunks[asset.chunkIndex].start;
    let duration = (end - start);
    if (ctx) {
        createAndStartBufferSource({
            audioBuffer: asset,
            name: name,
            start: start,
            duration: duration
        });
    } else {
        let blob = blobcache[name];
        if (!blob) {
            return;
        }
        let clone = new Audio(blob);
        let playPromise = clone.play();
        if (playPromise) {
            playPromise.then(() => {
                clone.currentTime = start;
                setTimeout(() => {
                    clone.pause();
                }, duration * 1000);
            });
        } else {
            clone.currentTime = start;
            setTimeout(() => {
                clone.pause();
            }, duration * 1000);
        }
    }
};

let playNthChunk = (name, index) => {
    if (!isOn) {
        return;
    }
    let asset = ctx ? buffercache[name] : audiocache[name];
    if (asset) {
        if (!asset.chunks) {
            play(name);
            return;
        }
        asset.chunkIndex = index;
        if (asset.chunkIndex >= asset.chunks.length) {
            asset.chunkIndex = 0;
        }
        playChunk(asset, name);
    }
};

export default (obj = {}) => {
    let {soundAssets} = obj;
    if (soundAssets) {
        Object.keys(soundAssets).forEach((name) => {
            let {url, chunks} = soundAssets[name];
            let asset = {name, url, chunks};
            loadAudio(asset);
        });
    }
    let sound = {
        play,
        stop,
        loop,
        playRandom,
        playUp,
        playDown,
        playNthChunk,
        setIsOn,
        getIsOn
    };
    obj.sound = sound;
    return obj;
};
