// Configurações da stream de video
let constraints = {};
let constraintsBase = {
    video: {
        facingMode: 'user',
    },
    audio: false
};

let videoOrientation;
let track = null;
let cameraOpen;
let svgMask;
let defs;
let style;
let groupMain;
let groupMask;
let pathBackground;
let pathFocus;
let stream;
let aspectRatioVideo = 1280 / 720;
let videoWidth = 0;
let videoHeight = 0;
let mWidth = 0;
let mHeight = 0;
let resolutionWidth = 1280;
let resolutionHeight = 720;
let _resolutionWidth = 1280;
let _resolutionHeight = 720;

var isResolutionRead = false;

var subPath = window.location.pathname + '/';
let forwardTimes = [];
let avgTimeInMs;

let isLoading = false;
let videoSourceInfoId;

/** Delegates variable region */
var onSuccessCaptureJS;
var onFailedCaptureJS;
/** End region */

let TYPE_PROCESS;
const TYPE_CAMERA = {
    CAMERA_NORMAL: 1
};

let FLOW;
const FLOW_TYPE = {
    CLOSE: 1
};

const SILHUETTE_CONFIGURATIONS = {
    CLOSE: {
        WIDTH: 285,
        HEIGHT: 456
    }
};

let resultCamera = {
    type: null,
    base64: null
};

// Opera 8.0+
const isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
        return p !== undefined && p.toString() === '[object SafariRemoteNotification]';
    })(
        !window['safari'] ||
        (typeof safari !== 'undefined' && safari.pushNotification)
    );

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Edge (based on chromium) detection
const isEdgeChromium = isChrome && navigator.userAgent.indexOf('Edg') != -1;

// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS;

// video da abertura da câmera
const cameraVideo = document.querySelector('#camera--video');
// imagem capturada
const cameraOutput = document.querySelector('#camera--output');
// canvas utilizado na captura
const cameraCanvas = document.querySelector('#camera--canvas');
// canvas overlay (landmarks)
const cameraOverlay = document.querySelector('#camera--overlay');
// botão de captura
const buttonCapture = document.querySelector('#camera--trigger');
// loading
const boxLoading = document.querySelector('#box--loading');
// box da câmera
const boxCamera = document.querySelector('#box-camera');

const isMobile = () =>
    navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
        ? true
        : false;

const isIOS = () =>
    navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
        ? true
        : false;

const isAndroid = () =>
    navigator.userAgent.match(/Android/i)
        ? true
        : false;

const getAndroidVersion = (ua) => {
    ua = (ua || navigator.userAgent).toLowerCase();
    let match = ua.match(/android\s([0-9\.]*)/i);
    return match ? match[1] : undefined;
};

const Orientation = {
    PORTRAIT: 1,
    LANDSCAPE: 2
};

const addClickEvent = () => {
    if (buttonCapture) {
        buttonCapture.onclick = takePicture;
    }
};

const gotStream = (mediaStream) => {
    if (mediaStream) {
        // make stream available to console
        stream = window.stream = mediaStream;
        cameraVideo.srcObject = mediaStream;
        setTrack(mediaStream);
        // Refresh button list in case labels have become available
    }
    return navigator.mediaDevices.enumerateDevices();
};

const getUrlVars = () => {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

const gotDevices = (deviceInfos) => {
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];

        if (deviceInfo.kind === 'videoinput') {
            videoSourceInfoId = deviceInfo.deviceId ? deviceInfo.deviceId : undefined;
            if (!isFirefox) {
                break;
            }

        }
    }
};

const setTrack = (mediaStream) => {

    if (mediaStream) {
        track = mediaStream.getVideoTracks()[0];
        if (track.getSettings()) {
            if(!isResolutionRead) {
                isResolutionRead = true;
                resolutionWidth = track.getSettings().width;
                resolutionHeight = track.getSettings().height;
            }
            
        }
        setConstraint(track.getConstraints());
    }
};

const setConstraint = (newConstraints) => {
    if (newConstraints) {
        let _constraints = {};
        // copia os dados básicos (video.user e audio)
        Object.assign(_constraints, constraints);
        // copia a resolucao nova
        Object.assign(_constraints, newConstraints);
        // define na variavel
        constraints = _constraints;
        setAspectRatio(constraints);
    }
};

const setAspectRatio = (constraints) => {
    let width = 1280;
    let height = 720;

    // largura
    if (
        constraints &&
        constraints.video &&
        constraints.video.width &&
        constraints.video.width.exact
    ) {
        width = constraints.video.width.exact;
    }

    // altura
    if (
        constraints &&
        constraints.video &&
        constraints.video.height &&
        constraints.video.height.exact
    ) {
        height = constraints.video.height.exact;
    }

    if (width && height) {
        // landscape
        if (width > height) {
            aspectRatioVideo = width / height;
        }
        // portrait
        else {
            aspectRatioVideo = height / width;
        }
    }
};

const handleError = (error) => {
    if (error) {
        console.log(
            'navigator.MediaDevices.getUserMedia error: ',
            error.message,
            error.name
        );
    } else {
        console.log('Ooopss algo deu errado na abertura da câmera');
    }
};

const setMobileStyle = () => {
    if (isMobile()) {
        cameraVideo.style['object-fit'] = 'cover';
    } else {
        cameraVideo.style['object-fit'] = '';
    }
};

navigator.mediaDevices.enumerateDevices().catch(handleError);

const startCamera = () => {
    if (window.stream) {
        window.stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    if (
        !constraints ||
        !constraints.video ||
        !constraints.video.width ||
        !constraints.video.height ||
        !constraints.video.width.min ||
        !constraints.video.width.ideal ||
        !constraints.video.width.max ||
        !constraints.video.height.min ||
        !constraints.video.height.ideal ||
        !constraints.video.height.max
    ) {
        // configuração base
        Object.assign(constraints, constraintsBase);
        // exceto Safari
        if (!isSafari) {
            if (isFirefox && isMobile()) {
                defaultConstraints.video.facingMode = 'user';
            }
            Object.assign(constraints, defaultConstraints);
        }

        setConstraint(constraints);
    }

    navigator.mediaDevices
        .getUserMedia(getConstraints())
        .then(setMobileStyle())
        .then(gotStream)
        .then(loadMask())
        .then(calcBtnCapturePos)
        .then(calcMarginMask)
        .catch((error) => {
            handleError(error);
        });
};

const newGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Captura da foto
 */
const takePicture = () => {
    if (cameraOpen) {
        showBoxLoading(false);
        buttonCapture.style.display = 'none';
        // canvas
        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;
        cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);

        // image
        cameraOutput.src = cameraCanvas.toDataURL('image/jpeg');
        cameraOutput.style.display = 'block';

        //resultCamera.base64 = cameraCanvas.toDataURL('image/jpeg');

        let base64 = cameraCanvas.toDataURL("image/jpeg");
        onSuccessCaptureJS(base64);
        
      //  sendData();
        stopStuffsAfterTake();
        setTimeout(() => { completedAnimation(); }, 2000);
    } else {
        // hides captured image
        setVisibilityOpenCamera();

        // start camera again
        startCamera();
    }
};

const verifyAndSetPopupNotSupportBrowser = () => {

    let _isChrome = platform.description.toLowerCase().indexOf('chrome') > -1;
    let _isFirefox = platform.description.toLowerCase().indexOf('firefox') > -1;
    let _isSafari = platform.description.toLowerCase().indexOf('safari') > -1;
    let _isEdge = platform.description.toLowerCase().indexOf('edge') > -1;
    let _isOpera = platform.description.toLowerCase().indexOf('opera') > -1;

    //console.log(`${_isChrome} _isFirefox ${_isFirefox} _isEdge ${_isEdge} _isFirefox ${_isFirefox} _isSafari ${_isSafari}`);

    if (isMobile()) {
        if (isAndroid()) {

            if (_isChrome || _isFirefox || _isEdge || _isFirefox) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.remove("safari");
                document.getElementById('box--support').classList.add("android");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
        else if (isIOS()) {
            if (_isSafari) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.remove("android");
                document.getElementById('box--support').classList.add("safari");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
    }
    else {
        if (!isIOS()) {
            if (_isChrome || _isOpera || _isEdge || _isFirefox) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.remove("safari");
                document.getElementById('box--support').classList.add("android");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
        else if (isIOS()) {
            if (_isSafari) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.remove("android");
                document.getElementById('box--support').classList.add("safari");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
    }
};


const completedAnimation = () => {
    hideBoxLoading();
    document.getElementById('box--completed').style.display = 'inline-block';
};

const stopStuffsAfterTake = () => {
    // stop tracking
    track.stop();
    // hide mask
    setVisibilityAfterTake();
    // set camera status
    cameraOpen = false;
};

const setVisibilityOpenCamera = () => {
    cameraOutput.style = 'display: none;';

    // show mask
    svgMask.style.display = 'unset';

    // show camera video
    cameraVideo.style.display = 'unset';

    // hides box loading
    hideBoxLoading();
};

const setVisibilityAfterTake = () => {
    svgMask.style.display = 'none';

    // show loading
    showBoxLoading(true);

    // hide video
    cameraVideo.style.display = 'none';

    resizeImageOut();
};

const resizeImageOut = async () => {
    if (isMobile()) {
        cameraOutput.style.width = '100%';
        cameraOutput.style.height = '100%';
        cameraOutput.style['object-fit'] = 'cover';
        cameraOutput.style.top = '';
        cameraOutput.style.left = '';
    } else {
        cameraOutput.style['object-fit'] = '';
        let aspectRatioScreen = 0;
        aspectRatioScreen = boxCamera.offsetWidth / boxCamera.offsetHeight;

        // faixa preta emcima e embaixo
        if (aspectRatioVideo > aspectRatioScreen) {
            videoHeight = boxCamera.offsetWidth / aspectRatioVideo;
            videoWidth = boxCamera.offsetWidth;
        }
        // faixa preta nas laterais
        else {
            videoHeight = boxCamera.offsetHeight;
            videoWidth = boxCamera.offsetHeight * aspectRatioVideo;
        }

        // set a captured image
        // cameraOutput.style.width = videoWidth;
        // cameraOutput.style.height = videoHeight;

        // ajusta a posicao (left x top)
        if (boxCamera.offsetWidth > videoWidth) {
            cameraOutput.style.left = (boxCamera.offsetWidth - videoWidth) / 2;
            cameraOutput.style.top = '';
        } else if (boxCamera.offsetHeight > videoHeight) {
            cameraOutput.style.left = '';
            cameraOutput.style.top = (boxCamera.offsetHeight - videoHeight) / 2;
        }

        let aspectRatioImg = cameraOutput.offsetWidth / cameraOutput.offsetHeight;

        // faixa preta emcima e embaixo
        if (aspectRatioImg > aspectRatioScreen) {
            // set a captured image
            cameraOutput.style.width = videoWidth;
            cameraOutput.style.height = null;
        }
        // faixa preta nas laterais
        else {
            cameraOutput.style.width = null;
            cameraOutput.style.height = videoHeight;
        }
    }
};

const calcBtnCapturePos = async () => {

    // diferença entre o video e a area visivel (na web fica com a faixa preta caso ultrapasse a area do video)
    //let diff = boxCamera.offsetHeight - videoHeight;
    //let bottom = diff > 0 ? diff / 2 : 0 + 20;

    buttonCapture.style.bottom = (((cameraVideo.offsetHeight - mHeight) / 2) / 2 - 30) + 'px';
    buttonCapture.style.display = 'inline-block';
};

const calcMarginMask = async () => {
    // diferença entre o video e a area visivel (na web fica com a faixa preta caso ultrapasse a area do video)
    let diffH = boxCamera.offsetHeight - videoHeight;
    let diffW = boxCamera.offsetWidth - videoWidth;
    let paddingH = diffH > 0 ? diffH / 2 : 0;
    let paddingW = diffW > 0 ? diffW / 2 : 0;
    cameraOverlay.style.padding = `${paddingH}px ${paddingW}px`;
};

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        if (resultCamera.requestFullscreen) {
            resultCamera.requestFullscreen();
        } else if (resultCamera.mozRequestFullScreen) {
            resultCamera.mozRequestFullScreen();
        } else if (resultCamera.webkitRequestFullscreen) {
            resultCamera.webkitRequestFullscreen();
        } else if (resultCamera.msRequestFullscreen) {
            resultCamera.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

const orientationChange = () => {
    setOrientation();
    window.scrollTo(0, document.body.scrollHeight);
    updateView();
    toggleFullScreen();
};

const updateView = () => {
    if (cameraOpen) {
        loadMask();
    }
    // has image ?
    else if (cameraOutput.src !== '') {
        resizeImageOut();
    }

    calcBtnCapturePos();

    calcMarginMask();
    setMobileStyle();
};

const addEventResize = async () => {
    window.addEventListener('resize', (e) => {
        setOrientation();
        updateView();
        toggleFullScreen();
    });
};

const getAppPartURL = (strPart) => {
    if (!subPath || subPath == '') {
        subPath = '/';
    }

    if (strPart.length > 0) {
        if (
            strPart.toLowerCase().indexOf('http') > -1 ||
            strPart.toLowerCase().indexOf('https') > -1
        ) {
            return strPart;
        }

        switch (strPart.substr(0, 1)) {
            case '/':
            case '.':
            case '~':
                strPart = strPart.replace(/\.\.|\~/, '');
                strPart = strPart.replace(/\//, '');
                break;
        }

        return (
            window.location.protocol +
            '//' +
            (window.location.host + subPath + strPart)
        );
    } else {
        return window.location.protocol + '//' + (window.location.host + subPath);
    }
};

const updateTimeStats = (timeInMs) => {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
    avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
    //console.log(`time: ${Math.round(avgTimeInMs)} ms - fps: ${faceapi.utils.round( 1000 / avgTimeInMs )}`);
};

const onPlay = async () => {
    try {
        hideBoxLoading();

        if (
            cameraVideo.paused ||
            cameraVideo.ended
        ) {
            return setTimeout(() => onPlay());
        }
        const ts = Date.now();
        updateTimeStats(Date.now() - ts);

        setTimeout(() => onPlay());

    } catch (error) {
        console.error('Erro ao processar frame', error);
    }
};

const showBoxLoading = (isTransparent = true) => {
    isLoading = true;
    boxLoading.style.backgroundColor = isTransparent ? "transparent" : "white";
    boxLoading.style.display = "block";
};

const hideBoxLoading = () => {
    isLoading = false;
    boxLoading.style.display = "none";
};

const showBoxLockOrientation = () => {
    document.getElementById('box--orientation').style.display = 'block';
};

const hideBoxLockOrientation = () => {
    document.getElementById('box--orientation').style.display = 'none';
};

const addEventPlay = () => {
    cameraVideo.addEventListener('play', () => {
        cameraOpen = true;
        onPlay();
    });
};

const loadMask = async (color = "#e9e9e9") => {
    // parameters -----------------------------------
    let mBoxWidth = cameraVideo.offsetWidth;
    let mBoxHeight = cameraVideo.offsetHeight;
    let borderColor = color;
    let borderWidth = 5;
    let backgroundOpacity = '0.7';
    // parameters -----------------------------------

    let currentAspectRatio = 0;

    if (mBoxWidth > mBoxHeight) {
        videoOrientation = Orientation.LANDSCAPE;
    }

    // video proportion
    if (isMobile()) {
        videoWidth = cameraVideo.offsetWidth;
        videoHeight = cameraVideo.offsetHeight;
    } else {
        currentAspectRatio = cameraVideo.offsetWidth / cameraVideo.offsetHeight;

        // faixa preta emcima e embaixo
        if (aspectRatioVideo > currentAspectRatio) {
            videoHeight = cameraVideo.offsetWidth / aspectRatioVideo;
            videoWidth = cameraVideo.offsetWidth;
        }
        // faixa preta nas laterais
        else {
            videoHeight = cameraVideo.offsetHeight;
            videoWidth = cameraVideo.offsetHeight * aspectRatioVideo;
        }
    }

    //console.log(`mBoxWidth ${mBoxWidth}, mBoxHeight ${mBoxHeight}, videoWidth ${videoWidth}, videoHeight ${videoHeight}, resolutionWidth ${resolutionWidth}, resolutionHeight ${resolutionHeight}`);

    // ajusta o tamanho da máscara com base no video
    // 300px referente a largura, usamos esse valor pois bate com a distância ocular ideal para biometria
    // 480px referente a altura padrão de um rosto

    if(isMobile() && isIOS()) {
        if(resolutionHeight > resolutionWidth) {
            let vResolutionHeight = resolutionHeight;
            let vResolutionWidth = resolutionWidth;
            resolutionHeight = vResolutionWidth;
            resolutionWidth = vResolutionHeight;
        }
    } 

    let factorWidth = (videoWidth / resolutionWidth) * (FLOW === FLOW_TYPE.CLOSE ? SILHUETTE_CONFIGURATIONS.CLOSE.WIDTH : SILHUETTE_CONFIGURATIONS.AWAY.WIDTH);
    let factorHeight = (videoHeight / resolutionHeight) * (FLOW === FLOW_TYPE.CLOSE ? SILHUETTE_CONFIGURATIONS.CLOSE.HEIGHT : SILHUETTE_CONFIGURATIONS.AWAY.HEIGHT);


    if (isMobile()) {
        // no modo portrait levamos em conta a altura e calculamos a largura da máscara
        // quando estamos simulando um dispositivo móvel no navegador a abertura da câmera sempre é landscape
        // porém os lados são cortados no vídeo para dar a impressão de portrait
        // por isso usamos a alttura como referência, por ser o valor real do video (sem cortes)
        if (videoOrientation === Orientation.PORTRAIT) {
            
            if (FLOW === FLOW_TYPE.CLOSE) {
                mWidth = factorHeight / (SILHUETTE_CONFIGURATIONS.CLOSE.HEIGHT / SILHUETTE_CONFIGURATIONS.CLOSE.WIDTH);
            }
            else {
                mWidth = factorHeight / (SILHUETTE_CONFIGURATIONS.AWAY.HEIGHT / SILHUETTE_CONFIGURATIONS.AWAY.WIDTH);
            }

            mHeight = factorHeight;
        } else {
            mWidth = factorWidth;
            mHeight = factorHeight;
        }
    } else {
        mWidth = factorWidth;
        mHeight = factorHeight;
    }

    let exists = document.getElementById('svgMask') !== null;
    let mBoxXCenter = mBoxWidth / 2;
    let mBoxYCenter = mBoxHeight / 2;

    let halfMWidth = mWidth / 2;
    let halfHeight = mHeight / 2;
    let half14Height = mHeight / 4;
    let fractionX = 0.15;
    let fractionWidthX = halfMWidth * fractionX;

    // ---------------
    //      6   7
    //   5         8
    //
    //
    //   4         1
    //      3   2
    // ---------------

    // point 1
    let point1X = mBoxXCenter + halfMWidth;
    let point1Y = mBoxYCenter + half14Height;

    // point 2
    let point2X = mBoxXCenter + fractionWidthX;
    let point2Y = mBoxYCenter + halfHeight;

    // point 3
    let point3H = mBoxXCenter - fractionWidthX * 2;

    // point 4
    let point4X = mBoxXCenter - halfMWidth;
    let point4Y = mBoxYCenter + half14Height;

    // point 5
    let point5V = mBoxYCenter - half14Height;

    // point 6
    let point6X = mBoxXCenter - fractionWidthX;
    let point6Y = mBoxYCenter - halfHeight;

    // point 7
    let point7h = fractionWidthX * 2;

    // point 8
    let point8X = mBoxXCenter + halfMWidth;
    let point8Y = mBoxYCenter - half14Height;

   
    let arcXY = halfMWidth - fractionWidthX;

    let mov0 = 'M0,0';
    let v0 = 'V' + mBoxHeight;
    let h0 = 'H' + mBoxWidth;
    let v1 = 'V0';
    let z0 = 'Z';
    let mov1 = `M${point1X},${point1Y}`;
    let arc1 = `A${arcXY},${arcXY},0,0,1,${point2X},${point2Y}`;
    let h1 = `H${point3H}`;
    let arc2 = `A${arcXY},${arcXY},0,0,1,${point4X},${point4Y}`;
    let v2 = `V${point5V}`;
    let arc3 = `A${arcXY},${arcXY},0,0,1,${point6X},${point6Y}`;
    let h2 = `h${point7h}`;
    let arc4 = `A${arcXY},${arcXY},0,0,1,${point8X},${point8Y}`;
    let z = 'Z';
    let d = `${mov0}${v0}${h0}${v1}${z0}${mov1}${arc1}${h1}${arc2}${v2}${arc3}${h2}${arc4}${z}`;
    let xmlns = 'http://www.w3.org/2000/svg';

    // svg
    if (!svgMask) {
        svgMask = document.createElementNS(xmlns, 'svg');
    }

    // svg attributes
    svgMask.setAttributeNS(
        null,
        'viewBox',
        '0 0 ' + mBoxWidth + ' ' + mBoxHeight
    );
    svgMask.setAttributeNS(null, 'width', mBoxWidth);
    svgMask.setAttributeNS(null, 'height', mBoxHeight);
    svgMask.style.display = 'block';
    svgMask.setAttributeNS(null, 'id', `svgMask`);



    // definitions
    if (!defs) {
        defs = document.createElementNS(xmlns, 'defs');
    }

    // style
    if (!style) {
        style = document.createElementNS(xmlns, 'style');
    }
    style.textContent = `.cls-background{opacity:${backgroundOpacity};}.cls-focus{fill:none;stroke:${borderColor};stroke-miterlimit:10;stroke-width:${borderWidth}px;}`;

    if (!groupMain) {
        groupMain = document.createElementNS(xmlns, 'g');
    }

    // main group
    groupMain.setAttributeNS(null, 'id', `main`);
    groupMain.setAttributeNS(null, 'data-name', `main`);

    // maks group
    if (!groupMask) {
        groupMask = document.createElementNS(xmlns, 'g');
    }

    groupMask.setAttributeNS(null, 'id', `mask`);

    // background
    if (!pathBackground) {
        pathBackground = document.createElementNS(xmlns, 'path');
    }

    pathBackground.setAttributeNS(null, 'id', `background`);
    pathBackground.setAttributeNS(null, 'class', `cls-background`);
    pathBackground.setAttributeNS(null, 'd', d);

    if (!pathFocus) {
        pathFocus = document.createElementNS(xmlns, 'rect');
    }

    // focus
    pathFocus.setAttributeNS(null, 'id', `focus`);
    pathFocus.setAttributeNS(null, 'class', `cls-focus`);
    pathFocus.setAttributeNS(null, 'x', point4X);
    pathFocus.setAttributeNS(null, 'y', point6Y);
    pathFocus.setAttributeNS(null, 'width', mWidth);
    pathFocus.setAttributeNS(null, 'height', mHeight);
    pathFocus.setAttributeNS(null, 'rx', arcXY);

    // structure
    if (!exists) {
        groupMask.appendChild(pathBackground);
        groupMask.appendChild(pathFocus);
        groupMain.appendChild(groupMask);
        defs.appendChild(style);
        svgMask.appendChild(defs);
        svgMask.appendChild(groupMain);
        boxCamera.appendChild(svgMask);
    }
};

const init = () => {
    showBoxLoading(false);
    TYPE_PROCESS = TYPE_CAMERA.CAMERA_NORMAL;
    FLOW = FLOW_TYPE.CLOSE;
    callAllMethodsInit();
};

const callAllMethodsInit = () => {
    addClickEvent();
    setOrientation();
    addEventPlay();
    addEventResize();
    startCamera();
};

const setOrientation = () => {
    let orientation =
        (screen.orientation || {}).type ||
        screen.mozOrientation ||
        screen.msOrientation;

    // se tem o parametro orientation (chrome, explorer ou mozilla)
    if (orientation) {
        if (
            orientation == 'landscape-primary' ||
            orientation == 'landscape-secondary'
        ) {
            videoOrientation = Orientation.LANDSCAPE;
        } else {
            videoOrientation = Orientation.PORTRAIT;
        }
    } else {
        // caso não exista, possivelmente Safari
        if (boxCamera.offsetWidth > boxCamera.offsetHeight) {
            videoOrientation = Orientation.LANDSCAPE;
        } else {
            videoOrientation = Orientation.PORTRAIT;
        }
    }

    if (isMobile()) {
        if (videoOrientation === Orientation.LANDSCAPE) {
            showBoxLockOrientation();
        }
        else {
            hideBoxLockOrientation();
        }
    }
};

const getMedia = () => {
    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    clearErrorMessage();
    videoblock.style.display = 'none';
    navigator.mediaDevices
        .getUserMedia(getConstraints())
        .then(gotStream)
        .catch((e) => {
            errorMessage('getUserMedia', e.message, e.name);
        });
};

const getConstraints = () => {
    return constraints;
};

const defaultConstraints = {
    video: {
        width: {
            min: 640,
            ideal: 1280,
            max: 1920,
        },
        height: {
            min: 480,
            ideal: 720,
            max: 1080
        },
    },
};

//------------------------------------------------------

document.getElementById('reinit').onclick = () => { location.reload(); };

window.onload = () => {
    if (verifyAndSetPopupNotSupportBrowser()) {
        init();
    }
};

window.addEventListener('orientationchange', orientationChange);
navigator.mediaDevices.ondevicechange = orientationChange;


const sendData = () => {
    subPath = ""; //comentar ao subir no squad
    let log = ` Silhuette { w: ${mWidth} h: ${mHeight} }, Video { w: ${cameraVideo.offsetWidth} h: ${cameraVideo.offsetHeight} radio: ${aspectRatioVideo} }, Screen { w: ${screen.width} h: ${screen.height} }, Plataform: ${JSON.stringify(platform).toString()}`;
    $.ajax({
        url: getAppPartURL("Home/Send"),
        method: "POST",
        data: { DeviceModel: platform.ua, Base64Center: resultCamera.base64, log: log }
    })
        .done(() => {
            //console.log('foi');
        }).fail(() => {
            //alert('erro ao enviar, nos avise fazendo favor.');
        });
};


