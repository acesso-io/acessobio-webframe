// Configurações da stream de video
let constraints = {};
let constraintsBase = {
    video: {
        facingMode: 'user',
    },
    audio: false
};

const isMobile = () => {
    return navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
        ? true
        : false;
};

const isIOS = () => {
    return navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
        ? true
        : false;
};

const isAndroid = () => {
    return navigator.userAgent.match(/Android/i)
        ? true
        : false;
};

const verifyAndSetPopupNotSupportBrowser = () => {

    let _isChrome = platform.description.toLowerCase().indexOf('chrome') > -1;
    let _isFirefox = platform.description.toLowerCase().indexOf('firefox') > -1;
    let _isSafari = platform.description.toLowerCase().indexOf('safari') > -1;
    let _isEdge = platform.description.toLowerCase().indexOf('edge') > -1;
    let _isOpera = platform.description.toLowerCase().indexOf('opera') > -1;

    if (isMobile()) {

        if (isAndroid()) {

            if (_isChrome || _isFirefox || _isEdge || _isFirefox) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.add("android");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
        else if (isIOS()) {
            if (_isSafari && (!_isChrome && !_isOpera && !_isEdge && !_isFirefox)) {
                return true;
            }
            else {
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
                document.getElementById('box--support').classList.add("android");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
        else if (isIOS()) {
            if (_isSafari && (!_isChrome && !_isOpera && !_isEdge && !_isFirefox)) {
                return true;
            }
            else {
                document.getElementById('box--support').classList.add("safari");
                document.getElementById('box--support').style.display = 'block';
                return false;
            }
        }
    }
};

const isSupportBrowser = verifyAndSetPopupNotSupportBrowser();

let videoOrientation;
let track = null;
let cameraOpen;
let svgMask;
let defs;
let style;
let groupMain;
let groupMask;
let pathBackground;
let pathLine;
let pathFocus;
let bottomSilhouetteDocument;
let react1;
let react2;
let react3;
let svgText;
let svgText2;
let stream;
let aspectRatioVideo = 1280 / 720;
let videoWidth = 0;
let videoHeight = 0;
let mWidth = 0;
let mHeight = 0;
let resolutionWidth = 1280;
let resolutionHeight = 720;
let isResolutionRead = false;
var subPath = window.location.pathname + '/';
let forwardTimes = [];
let avgTimeInMs;

let isCaptureReady = false;
let isLoading = false;
let videoSourceInfoId;

let isFaceApiIsRunning = false;
let counterIsRunning = 0;

var onSuccessCaptureJS;
var onFailedCaptureJS;

let TYPE_PROCESS = null;
let TYPE_PROCESS_INITIAL = null;
const TYPE_CAMERA = {
    CAMERA_NORMAL: 1,
    CAMERA_INTELIGENCE: 2
};

let TYPE_PROCESS_DOCUMENT = null;
let TYPE_PROCESS_DOCUMENT_INITIAL = null;
const TYPE_DOCUMENT = {
    CNH: 1,
    RG: 2,
    CPF: 3,
    NEW_RG: 4,
    OTHERS: 5
};

let FLOW;
const FLOW_TYPE = {
    FRONT: 1,
    BACK: 2
};

let _LABEL_DOCUMENT_OTHERS;
let base64Front;

let isCentralized = false;
let isTimerTaking = false;
let timerTake;

const SILHOUETTE_CONFIGURATIONS = {
    CLOSE: {
        WIDTH: isMobile() ? 285 : 342,
        HEIGHT: isMobile() ? 456 : 547.2
    }
};

let COLOR_SILHOUETTE = {
    PRIMARY: '#297fff',
    SECONDARY: '#fff',
    NEUTRAL: '#fff'
};

let totalSeconds = 0;
let isTimerSessionContinueRunning = false;
let timerSession;

let _centralized = {
    silhoutteWidth: null,
    topSILHOUETTEThresholdVertical: null,
    bottomSILHOUETTEThresholdVertical: null,
    inSILHOUETTEThresholdHorizontal: null,
    overSILHOUETTEThresholdHorizontal: null,
    faceTurnedSILHOUETTEThresholdHorizontal: null,
    CSPWidthLeft: null,
    CSPWidthRight: null,
    CSPHeightTop: null,
    CSPHeightBottom: null,
    distanceLeftByNose: null,
    distanceRightByNose: null,
    differenceInDistance: null,
    differenceLeftY: null,
    differenceRightY: null,
    differenceNoseYThreshold: null
};


let minConfidence = 0.5;
let inputSize = 224;
let scoreThreshold = 0.5;

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

// Chrome 1 - 79
const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// video da abertura da câmera
let cameraVideo;
// canvas utilizado na captura
let cameraCanvas;
// canvas overlay (landmarks)
let cameraOverlay;
// botão de captura
let buttonCapture;
// loading
let boxLoading;
// box da câmera
let boxCamera;

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
            if (!isResolutionRead) {
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
        onFailedCaptureJS(`navigator.MediaDevices.getUserMedia error: ${error.message}, ${error.name}`);
    } else {
        onFailedCaptureJS('Ooopss algo deu errado na abertura da câmera');
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

        if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {
            constraintsBase.video.facingMode = "environment";
            defaultConstraints.video.facingMode = "environment";
            cameraVideo.style.webkitTransform = "none";
            cameraCanvas.style.webkitTransform = "none";
        }

        // configuração base
        Object.assign(constraints, constraintsBase);
        // exceto Safari
        if (!isSafari) {
            if (isFirefox && isMobile() && (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL || TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE)) {
                defaultConstraints.video.facingMode = 'user';
            }
            Object.assign(constraints, defaultConstraints);
        }

        setConstraint(constraints);
    }

    navigator.mediaDevices
        .getUserMedia(getConstraints())
        .then(gotStream)
        .then(setMobileStyle())
        .then(setTypeSilhouette)
        .then(calcBtnCapturePos)
        .then(calcMarginMask)
        .then(() => {
            if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
                verifyFaceApiIsRunning();
                setConfiguration();
            }
            else {
                if (isLoading) {
                    hideBoxLoading();
                    hideMessage();
                    isLoading = false;
                }
            }
        })
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

const completedAnimation = () => {
    hideBoxLoading();
    document.getElementById('box--completed').style.display = 'inline-block';
};

const stopStuffsAfterTake = () => {
    // stop tracking
    track.stop();

    // hide mask
    setVisibilityAfterTake();

    hideMessage();

    hideBoxDocumentInfo();

    // set camera status
    cameraOpen = false;
};

const setVisibilityOpenCamera = () => {
    // show mask
    svgMask.style.display = 'unset';

    // show camera video
    cameraVideo.style.display = 'unset';

    // hides box loading
    hideBoxLoading();
};

const setVisibilityAfterTake = () => {
    svgMask.style.display = 'none';
    // hide video
    cameraVideo.style.display = 'none';
};

const calcBtnCapturePos = async () => {
    if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL) {
        // diferença entre o video e a area visivel (na web fica com a faixa preta caso ultrapasse a area do video)

        buttonCapture.style.bottom = (((cameraVideo.offsetHeight - mHeight) / 2) / 2 / 2) + 'px';

        buttonCapture.style.display = 'inline-block';
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {
        buttonCapture.style.top = (bottomSilhouetteDocument + 10) + 'px';
        buttonCapture.style.display = 'inline-block';
        createBoxDocumentInfo();
    }
    else if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
        buttonCapture.style.display = 'none';
    }
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
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
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
        if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL || TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
            loadMask(COLOR_SILHOUETTE.SECONDARY);
        }
        else {
            loadMaskDocument(COLOR_SILHOUETTE.SECONDARY);
        }
    }

    calcBtnCapturePos();

    calcMarginMask();
    setMobileStyle();
    setTopLabelMessage();
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

const downloadModels = async () => {

    if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(getAppPartURL('/models')),
            faceapi.nets.faceLandmark68Net.loadFromUri(getAppPartURL('/models'))
        ])
            .then(() => {
                callAllMethodsInit();
            })
            .catch((error) => {
                onFailedCaptureJS('Não foi possível baixar os modelos');
            });
    }
};

const getFaceDetectorOptions = () => {
    return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
};

const isFaceDetectionModelLoaded = () => {
    return !!faceapi.nets.tinyFaceDetector.params;
};

const updateTimeStats = (timeInMs) => {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
    avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
};

const verifyFaceApiIsRunning = () => {
    if (isFaceApiIsRunning) {
        return;
    }
    else if (counterIsRunning >= 8) {
        TYPE_PROCESS = TYPE_CAMERA.CAMERA_NORMAL;
        COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE.NEUTRAL;
        loadMask(COLOR_SILHOUETTE.SECONDARY);
        calcBtnCapturePos();
        onPlay();
    }
    else {
        setTimeout(() => {
            counterIsRunning++;
            verifyFaceApiIsRunning();
        }, 1000);
    }
};

const startTimerSession = () => {
    if (isTimerSessionContinueRunning) {
        timerSession = setTimeout(() => {
            totalSeconds++;
            startTimerSession();
        }, 1000);
    }
};

const onPlay = async () => {
    try {
        if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {

            if (
                cameraVideo.paused ||
                cameraVideo.ended ||
                isCaptureReady
            ) {
                return setTimeout(() => onPlay());
            }

            if (!isTimerSessionContinueRunning) {
                isTimerSessionContinueRunning = true;
                startTimerSession();
            }

            const ts = Date.now();
            updateTimeStats(Date.now() - ts);
        }
        else if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
            if (
                cameraVideo.paused ||
                cameraVideo.ended ||
                !isFaceDetectionModelLoaded() ||
                (isMobile() && videoOrientation === Orientation.LANDSCAPE) ||
                isCaptureReady
            ) {
                return setTimeout(() => onPlay());
            }

            const options = getFaceDetectorOptions();
            const ts = Date.now();

            const result = await faceapi
                .detectSingleFace(cameraVideo, options)
                .withFaceLandmarks();

            updateTimeStats(Date.now() - ts);

            if (isLoading) {
                isFaceApiIsRunning = true;
                hideBoxLoading();
                isTimerSessionContinueRunning = true;
                startTimerSession();
                isLoading = false;
            }
            else {
                if (result) {
                    if (isCaptureReady) return setTimeout(() => onPlay());

                    let dims = faceapi.matchDimensions(cameraOverlay, cameraVideo, true);
                    dims.height = cameraVideo.offsetHeight;
                    dims.width = cameraVideo.offsetWidth;
                    const resizedResult = faceapi.resizeResults(result, dims);

                    if (isCentralizedFace(
                        resizedResult.landmarks.positions[0]._x,
                        resizedResult.landmarks.positions[0]._y,
                        resizedResult.landmarks.positions[16]._x,
                        resizedResult.landmarks.positions[16]._y,
                        resizedResult.landmarks.positions[27]._x,
                        resizedResult.landmarks.positions[27]._y
                    )) {

                        if (!isTimerTaking) {
                            initTimerTake(1700);
                        }
                    }
                }
                else {
                    changeColorMask(COLOR_SILHOUETTE.SECONDARY);
                    hideMessage();
                }
            }
        }

        setTimeout(() => onPlay());

    } catch (error) {
        console.log(erro);
    }
};

const changeColorMask = (color) => {
    document.getElementById('focus-silhouette').style.stroke = color;
};

const setImageBackgroundAndLoading = () => {
    showBoxLoading(false);
    buttonCapture.style.display = 'none';
};

const initTimerTake = (milliseconds) => {
    isTimerTaking = true;
    timerTake = setTimeout(() => {
        if (isCentralized) {
            clearTimeout(timerTake);
            takePicture();
        }
        else {
            isTimerTaking = false;
            clearTimeout(timerTake);
        }
    }, milliseconds);
};

/**
 * Captura da foto
 */
const takePicture = () => {
    if (cameraOpen) {
        if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL ||
            TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF ||
            TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {

            let base64 = getBase64Canvas();
            isCaptureReady = true;
            setImageBackgroundAndLoading();

            onSuccessCaptureJS({
                base64: base64,
                Log: getLog()
            });

            completedAnimation();
            stopStuffsAfterTake();
        }
        else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG) {

            if (FLOW === FLOW_TYPE.FRONT) {
                base64Front = getBase64Canvas();
                FLOW = FLOW_TYPE.BACK;
                isCaptureReady = false;
                setLabelDocumentInfo();
                showBoxLoading(false);
                loadMaskDocument(COLOR_SILHOUETTE.SECONDARY);
                setTimeout(() => {
                    hideBoxLoading();
                }, 1000);


                return;
            }
            else if (FLOW === FLOW_TYPE.BACK) {
                let base64 = getBase64Canvas();
                isCaptureReady = true;
                setImageBackgroundAndLoading();

                onSuccessCaptureJS({
                    base64: base64Front,
                    base64Back: base64,
                    Log: getLog()
                });

                completedAnimation();
                stopStuffsAfterTake();
            }
        }
    } else {
        setVisibilityOpenCamera();

        startCamera();
    }
};

const getLog = () => {
    if (TYPE_PROCESS !== null) {
        return {
            TYPE_PROCESS_INITIAL: TYPE_PROCESS_INITIAL,
            TYPE_PROCESS: TYPE_PROCESS,
            TOTAL_SECONDS: totalSeconds,
            Device: platform.ua,
            SILHOUETTE: {
                width: mWidth,
                height: mHeight
            },
            video: {
                width: cameraVideo.offsetWidth,
                height: cameraVideo.offsetHeight
            },
            radio: aspectRatioVideo,
            screen: {
                width: screen.width,
                height: screen.height
            }
        };
    }
    else if (TYPE_PROCESS_DOCUMENT !== null) {
        return {
            TYPE_PROCESS_DOCUMENT_INITIAL: TYPE_PROCESS_DOCUMENT_INITIAL,
            TYPE_PROCESS_DOCUMENT: TYPE_PROCESS_DOCUMENT,
            TOTAL_SECONDS: totalSeconds,
            Device: platform.ua,
            SILHOUETTE: {
                width: mWidth,
                height: mHeight
            },
            video: {
                width: cameraVideo.offsetWidth,
                height: cameraVideo.offsetHeight
            },
            radio: aspectRatioVideo,
            screen: {
                width: screen.width,
                height: screen.height
            }
        };
    }
};

const getBase64Canvas = () => {
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);
    return cameraCanvas.toDataURL('image/jpeg');
};

const isCentralizedFace = (leftX, leftY, rightX, rightY, noseX, noseY) => {
    _centralized.silhoutteWidth = mWidth;

    if (isMobile()) {
        _centralized.topSilhouetteThresholdVertical = 8 / 100 * cameraVideo.offsetHeight;
        _centralized.bottomSilhouetteThresholdVertical = 3.47 / 100 * cameraVideo.offsetHeight;
        _centralized.inSilhouetteThresholdHorizontal = 12 / 100 * cameraVideo.offsetWidth;
        _centralized.overSilhouetteThresholdHorizontal = 4 / 100 * cameraVideo.offsetWidth;
        _centralized.faceTurnedSilhouetteThresholdHorizontal = 15 / 100 * cameraVideo.offsetWidth;
        _centralized.differenceNoseYThreshold = 7 / 100 * cameraVideo.offsetHeight;
    }
    else {
        _centralized.topSilhouetteThresholdVertical = 4 / 100 * cameraVideo.offsetHeight;
        _centralized.bottomSilhouetteThresholdVertical = 3 / 100 * cameraVideo.offsetHeight;
        _centralized.inSilhouetteThresholdHorizontal = 1 / 100 * cameraVideo.offsetWidth;
        _centralized.overSilhouetteThresholdHorizontal = 4 / 100 * cameraVideo.offsetWidth;
        _centralized.faceTurnedSilhouetteThresholdHorizontal = 9 / 100 * cameraVideo.offsetWidth;
        _centralized.differenceNoseYThreshold = 7 / 100 * cameraVideo.offsetHeight;
    }

    _centralized.differenceLeftY = leftY - noseY;
    _centralized.differenceRightY = rightY - noseY;

    _centralized.CSPWidthLeft = cameraVideo.offsetWidth / 2 - _centralized.silhoutteWidth / 2;
    _centralized.CSPWidthRight = cameraVideo.offsetWidth / 2 + _centralized.silhoutteWidth / 2;
    _centralized.CSPHeightTop = cameraVideo.offsetHeight / 2 - _centralized.topSilhouetteThresholdVertical;
    _centralized.CSPHeightBottom = cameraVideo.offsetHeight / 2 + _centralized.bottomSilhouetteThresholdVertical;
    _centralized.distanceLeftByNose = noseX - leftX;
    _centralized.distanceRightByNose = rightX - noseX;

    if (_centralized.distanceLeftByNose >= _centralized.distanceRightByNose) {
        _centralized.differenceInDistance = _centralized.distanceLeftByNose - _centralized.distanceRightByNose;
    }
    else {
        _centralized.differenceInDistance = _centralized.distanceRightByNose - _centralized.distanceLeftByNose;
    }

    if (leftX >= _centralized.CSPWidthLeft - _centralized.overSilhouetteThresholdHorizontal &&
        leftX <= _centralized.CSPWidthLeft + _centralized.inSilhouetteThresholdHorizontal &&
        rightX <= _centralized.CSPWidthRight + _centralized.overSilhouetteThresholdHorizontal &&
        rightX >= _centralized.CSPWidthRight - _centralized.inSilhouetteThresholdHorizontal &&
        noseY >= _centralized.CSPHeightTop && noseY <= _centralized.CSPHeightBottom &&
        _centralized.differenceInDistance < _centralized.faceTurnedSilhouetteThresholdHorizontal &&
        _centralized.differenceLeftY < _centralized.differenceNoseYThreshold && _centralized.differenceRightY < _centralized.differenceNoseYThreshold &&
        _centralized.differenceLeftY > -_centralized.differenceNoseYThreshold && _centralized.differenceRightY > -_centralized.differenceNoseYThreshold) {

        changeColorMask(COLOR_SILHOUETTE.PRIMARY);

        showMessage('Não se mexa...');

        isCentralized = true;
        return true;
    }
    else {

        changeColorMask(COLOR_SILHOUETTE.SECONDARY);

        if (rightX - leftX > _centralized.silhoutteWidth) {
            showMessage('Afaste o rosto');
        }
        else if (rightX - leftX < _centralized.silhoutteWidth - _centralized.inSilhouetteThresholdHorizontal) {
            showMessage('Aproxime o rosto');
        }
        else if (noseY <= _centralized.CSPHeightTop) {
            showMessage('Centralize o rosto');
        }
        else if (noseY >= _centralized.CSPHeightBottom) {
            showMessage('Centralize o rosto');
        }
        else if (leftX <= _centralized.CSPWidthLeft - _centralized.overSilhouetteThresholdHorizontal) {
            showMessage('Rosto para cima');
        }
        else if (rightX >= _centralized.CSPWidthRight + _centralized.overSilhouetteThresholdHorizontal) {
            showMessage('Rosto para baixo');
        }
        else if (_centralized.differenceLeftY > _centralized.differenceNoseYThreshold && _centralized.differenceRightY > _centralized.differenceNoseYThreshold) {
            showMessage('Rosto inclinado');
        }
        else if (_centralized.differenceLeftY < -_centralized.differenceNoseYThreshold && _centralized.differenceRightY < -_centralized.differenceNoseYThreshold) {
            showMessage('Rosto inclinado');
        }
        else if (_centralized.distanceLeftByNose > _centralized.distanceRightByNose) {
            showMessage('Rosto de lado');
        }
        else if (_centralized.distanceLeftByNose < _centralized.distanceRightByNose) {
            showMessage('Rosto de lado');
        }

        isCentralized = false;
        isTimerTaking = false;
        clearTimeout(timerTake);

        return false;
    }
};

const showBoxLoading = (isTransparent = true) => {
    boxLoading.style.backgroundColor = isTransparent ? "transparent" : "white";
    boxLoading.style.display = "block";
};

const hideBoxLoading = () => {
    boxLoading.style.backgroundColor = "transparent";
    boxLoading.style.backgroundImage = '';
    boxLoading.style.display = "none";
};

const showBoxLockOrientation = () => {
    document.getElementById("box--orientation").style.visibility = 'visible';
    document.getElementById("box--orientation").style.opacity = 1;
};

const hideBoxLockOrientation = () => {
    document.getElementById("box--orientation").style.visibility = 'hidden';
    document.getElementById("box--orientation").style.opacity = 0;
};

const showMessage = (message) => {
    document.getElementById("message").innerHTML = message;
    document.getElementById("message").style.visibility = 'visible';
    document.getElementById("message").style.opacity = 1;
};

const hideMessage = () => {
    document.getElementById("message").innerHTML = '';
    document.getElementById("message").style.visibility = 'hidden';
    document.getElementById("message").style.opacity = 0;
};

const addEventPlay = () => {
    cameraVideo.addEventListener('play', () => {
        cameraOpen = true;
        onPlay();
    });
};

const loadMask = async (color) => {

    let mBoxWidth = cameraVideo.offsetWidth;
    let mBoxHeight = cameraVideo.offsetHeight;
    let borderColor = color;
    let borderWidth = 5;
    let backgroundOpacity = '0.7';


    let currentAspectRatio = 0;

    if (mBoxWidth > mBoxHeight) {
        videoOrientation = Orientation.LANDSCAPE;
    }


    if (isMobile()) {
        videoWidth = cameraVideo.offsetWidth;
        videoHeight = cameraVideo.offsetHeight;
    } else {
        currentAspectRatio = cameraVideo.offsetWidth / cameraVideo.offsetHeight;


        if (aspectRatioVideo > currentAspectRatio) {
            videoHeight = cameraVideo.offsetWidth / aspectRatioVideo;
            videoWidth = cameraVideo.offsetWidth;
        }
        else {
            videoHeight = cameraVideo.offsetHeight;
            videoWidth = cameraVideo.offsetHeight * aspectRatioVideo;
        }
    }

    if (isMobile()) {
        if (resolutionHeight > resolutionWidth) {
            let vResolutionHeight = resolutionHeight;
            let vResolutionWidth = resolutionWidth;
            resolutionHeight = vResolutionWidth;
            resolutionWidth = vResolutionHeight;
        }
    }

    let factorWidth = (videoWidth / resolutionWidth) * SILHOUETTE_CONFIGURATIONS.CLOSE.WIDTH;
    let factorHeight = (videoHeight / resolutionHeight) * SILHOUETTE_CONFIGURATIONS.CLOSE.HEIGHT;

    if (isMobile()) {

        if (videoOrientation === Orientation.PORTRAIT) {
            mWidth = factorHeight / (SILHOUETTE_CONFIGURATIONS.CLOSE.HEIGHT / SILHOUETTE_CONFIGURATIONS.CLOSE.WIDTH);

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

    let point1X = mBoxXCenter + halfMWidth;
    let point1Y = mBoxYCenter + half14Height;


    let point2X = mBoxXCenter + fractionWidthX;
    let point2Y = mBoxYCenter + halfHeight;


    let point3H = mBoxXCenter - fractionWidthX * 2;


    let point4X = mBoxXCenter - halfMWidth;
    let point4Y = mBoxYCenter + half14Height;


    let point5V = mBoxYCenter - half14Height;


    let point6X = mBoxXCenter - fractionWidthX;
    let point6Y = mBoxYCenter - halfHeight;


    let point7h = fractionWidthX * 2;


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


    if (!svgMask) {
        svgMask = document.createElementNS(xmlns, 'svg');
    }


    svgMask.setAttributeNS(
        null,
        'viewBox',
        '0 0 ' + mBoxWidth + ' ' + mBoxHeight
    );
    svgMask.setAttributeNS(null, 'width', mBoxWidth);
    svgMask.setAttributeNS(null, 'height', mBoxHeight);
    svgMask.style.display = 'block';
    svgMask.setAttributeNS(null, 'id', `svgMask`);


    if (!defs) {
        defs = document.createElementNS(xmlns, 'defs');
    }


    if (!style) {
        style = document.createElementNS(xmlns, 'style');
    }
    style.textContent = `.cls-background{opacity:${backgroundOpacity};}.cls-focus{fill:none;stroke:${borderColor};stroke-miterlimit:10;stroke-width:${borderWidth}px;}`;

    if (!groupMain) {
        groupMain = document.createElementNS(xmlns, 'g');
    }


    groupMain.setAttributeNS(null, 'id', `main`);
    groupMain.setAttributeNS(null, 'data-name', `main`);


    if (!groupMask) {
        groupMask = document.createElementNS(xmlns, 'g');
    }

    groupMask.setAttributeNS(null, 'id', `mask`);


    if (!pathBackground) {
        pathBackground = document.createElementNS(xmlns, 'path');
    }

    pathBackground.setAttributeNS(null, 'id', `background`);
    pathBackground.setAttributeNS(null, 'class', `cls-background`);
    pathBackground.setAttributeNS(null, 'd', d);

    if (!pathFocus) {
        pathFocus = document.createElementNS(xmlns, 'rect');
    }


    pathFocus.setAttributeNS(null, 'id', `focus-silhouette`);
    pathFocus.setAttributeNS(null, 'class', `cls-focus`);
    pathFocus.setAttributeNS(null, 'x', point4X);
    pathFocus.setAttributeNS(null, 'y', point6Y);
    pathFocus.setAttributeNS(null, 'width', mWidth);
    pathFocus.setAttributeNS(null, 'height', mHeight);
    pathFocus.setAttributeNS(null, 'rx', arcXY);


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

const setTypeSilhouette = () => {
    if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL || TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
        loadMask(COLOR_SILHOUETTE.SECONDARY);
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH ||
             TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG ||
             TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF ||
             TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG ||
             TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {
        loadMaskDocument(COLOR_SILHOUETTE.SECONDARY);
    }
};

const loadMaskDocument = async (color) => {

    // parameters -----------------------------------
    let mBoxWidth = cameraVideo.offsetWidth;
    let mBoxHeight = cameraVideo.offsetHeight;
    let borderColor = color;
    let borderWidth = 3;
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

    if (isMobile() && isIOS()) {
        if (resolutionHeight > resolutionWidth) {
            let vResolutionHeight = resolutionHeight;
            let vResolutionWidth = resolutionWidth;
            resolutionHeight = vResolutionWidth;
            resolutionWidth = vResolutionHeight;
        }
    }

    // ajusta o tamanho da máscara com base no video
    // 300px referente a largura, usamos esse valor pois bate com a distância ocular ideal para biometria
    // 480px referente a altura padrão de um rosto
    let factorWidth;
    let factorHeight;

    if (isMobile()) {
        factorWidth = videoWidth * 0.9;
        factorHeight = videoHeight * 0.72;
    } else {
        factorWidth = (videoWidth / resolutionWidth) * ((videoWidth * 0.70) > 400 ? 400 : videoWidth * 0.70);
        factorHeight = (videoHeight / resolutionHeight) * ((videoHeight * 0.70) > 500 ? 500 : videoHeight * 0.70);
    }

    if (isMobile()) {

        if (videoOrientation === Orientation.PORTRAIT) {
            mWidth = factorHeight / ((videoHeight * 0.8) / (videoWidth * 0.9));

            mHeight = factorHeight;
        } else {
            mWidth = factorWidth;
            mHeight = factorHeight;
        }
    } else {
        mWidth = factorWidth;
        mHeight = factorHeight;
    }

    if (isMobile()) {
        // no modo portrait levamos em conta a altura e calculamos a largura da máscara
        // quando estamos simulando um dispositivo móvel no navegador a abertura da câmera sempre é landscape
        // porém os lados são cortados no vídeo para dar a impressão de portrait
        // por isso usamos a alttura como referência, por ser o valor real do video (sem cortes)

        mWidth = factorWidth;
        mHeight = factorHeight;
    } else {
        mWidth = factorWidth;
        mHeight = factorHeight;
    }

    let exists = document.getElementById('svgMask') !== null;
    let mBoxXCenter = mBoxWidth / 2;
    let mBoxYCenter = mBoxHeight / 2;

    let halfMWidth = mWidth / 2;
    let halfHeight = mHeight / 2;
    let fractionX = 0.15;
    let fractionWidthX = halfMWidth * fractionX;

    // ---------------
    //   5  6   7  8
    //            
    //
    //
    //            
    //   4  3   2  1
    // ---------------

    // point 1
    let point1X = mBoxXCenter + halfMWidth;
    let point1Y = mBoxYCenter + halfHeight;

    // point 2
    let point2X = mBoxXCenter + fractionWidthX;
    let point2Y = mBoxYCenter + halfHeight;

    // point 3
    let point3H = mBoxXCenter - fractionWidthX * 2;

    // point 4
    let point4X = mBoxXCenter - halfMWidth;
    let point4Y = mBoxYCenter + halfHeight;

    // point 5
    let point5V = mBoxYCenter - halfHeight;

    // point 6
    let point6X = mBoxXCenter - fractionWidthX;
    let point6Y = mBoxYCenter - halfHeight;

    // point 7
    let point7h = fractionWidthX * 2;

    // point 8
    let point8X = mBoxXCenter + halfMWidth;
    let point8Y = mBoxYCenter - halfHeight;

    if (isMobile()) {
        point6Y = point6Y / 2;
        point8Y = point8Y / 2;
        point2Y = point2Y - point6Y;
        point4Y = point4Y - point6Y;
        point1Y = point1Y - point6Y;
        point5V = point5V / 2;
    }

    let arcXY = 0;
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

    bottomSilhouetteDocument = point6Y + mHeight;

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
    pathFocus.setAttributeNS(null, 'id', `focus-silhouette`);
    pathFocus.setAttributeNS(null, 'class', `cls-focus`);
    pathFocus.setAttributeNS(null, 'x', point4X);
    pathFocus.setAttributeNS(null, 'y', point6Y);
    pathFocus.setAttributeNS(null, 'width', mWidth);
    pathFocus.setAttributeNS(null, 'height', mHeight);
    pathFocus.setAttributeNS(null, 'rx', arcXY);

    if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH) {
        if (!pathLine) {
            pathLine = document.createElementNS(xmlns, 'path');
        }
        pathLine.setAttributeNS(null, 'id', `line`);
        pathLine.setAttributeNS(null, 'd', `M ${point4X} ${isMobile() ? mBoxYCenter - point6Y : mBoxYCenter} l ${point1X - point4X} 0`);
        pathLine.setAttributeNS(null, 'fill', 'none');
        pathLine.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
        pathLine.setAttributeNS(null, 'stroke-width', '3');

        if (!react1) {
            react1 = document.createElementNS(xmlns, 'rect');
        }
        react1.setAttributeNS(null, 'id', `rect-top-cnh`);
        react1.setAttributeNS(null, 'class', `cls-focus`);
        react1.setAttributeNS(null, 'x', point4X + mWidth * 0.19);
        react1.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (halfHeight * 0.13 + halfHeight * 0.57));
        react1.setAttributeNS(null, 'width', mWidth * 0.30);
        react1.setAttributeNS(null, 'height', halfHeight * 0.57);
        react1.setAttributeNS(null, 'stroke-width', 3);
        react1.setAttributeNS(null, 'fill', 'none');
        react1.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

        if (!react2) {
            react2 = document.createElementNS(xmlns, 'rect');
        }
        react2.setAttributeNS(null, 'id', `rect-bottom-cnh`);
        react2.setAttributeNS(null, 'class', `cls-focus`);
        react2.setAttributeNS(null, 'x', point4X + (mWidth * 0.16));
        react2.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) + (halfHeight * 0.1));
        react2.setAttributeNS(null, 'width', mWidth * 0.77);
        react2.setAttributeNS(null, 'height', halfHeight * 0.4);
        react2.setAttributeNS(null, 'stroke-width', 3);
        react2.setAttributeNS(null, 'fill', 'none');
        react2.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

        if (!svgText) {
            svgText = document.createElementNS(xmlns, 'text');
        }

        svgText.setAttributeNS(null, 'id', `text1`);
        svgText.setAttributeNS(null, 'class', `cls-text`);
        svgText.setAttributeNS(null, 'x', point4X + mWidth * 0.19);
        svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (halfHeight * 0.13 + halfHeight * 0.57) - 10);
        svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
        svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
        svgText.innerHTML = '';
        let textNode = document.createTextNode("FOTO");
        svgText.appendChild(textNode);
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG) {
        if (FLOW === FLOW_TYPE.FRONT) {
            if (!react1) {
                react1 = document.createElementNS(xmlns, 'rect');
            }
            react1.setAttributeNS(null, 'id', `rect1`);
            react1.setAttributeNS(null, 'class', `cls-focus`);
            react1.setAttributeNS(null, 'x', point4X + ((mWidth - mWidth * 0.45) / 2));
            react1.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.40));
            react1.setAttributeNS(null, 'width', mWidth * 0.45);
            react1.setAttributeNS(null, 'height', mHeight * 0.40);
            react1.setAttributeNS(null, 'stroke-width', 3);
            react1.setAttributeNS(null, 'fill', 'none');
            react1.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!react2) {
                react2 = document.createElementNS(xmlns, 'rect');
            }
            react2.setAttributeNS(null, 'id', `rect2`);
            react2.setAttributeNS(null, 'class', `cls-focus`);
            react2.setAttributeNS(null, 'x', point4X + ((mWidth - mWidth * 0.45) / 2));
            react2.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) + (mHeight * 0.05));
            react2.setAttributeNS(null, 'width', mWidth * 0.45);
            react2.setAttributeNS(null, 'height', mHeight * 0.38);
            react2.setAttributeNS(null, 'stroke-width', 3);
            react2.setAttributeNS(null, 'fill', 'none');
            react2.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!svgText) {
                svgText = document.createElementNS(xmlns, 'text');
            }
            svgText.setAttributeNS(null, 'id', `text1`);
            svgText.setAttributeNS(null, 'class', `cls-text`);
            svgText.setAttributeNS(null, 'x', mBoxXCenter - 25);
            svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.42));
            svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
            svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
            svgText.innerHTML = '';
            let textNode = document.createTextNode("FOTO");
            svgText.appendChild(textNode);
        }
        else if (FLOW === FLOW_TYPE.BACK) {
            if (!react1) {
                react1 = document.createElementNS(xmlns, 'rect');
            }
            react1.setAttributeNS(null, 'id', `rect1`);
            react1.setAttributeNS(null, 'class', `cls-focus`);
            react1.setAttributeNS(null, 'x', point4X + (mWidth - mWidth * 0.15));
            react1.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.28));
            react1.setAttributeNS(null, 'width', mWidth * 0.0735);
            react1.setAttributeNS(null, 'height', mHeight * 0.198);
            react1.setAttributeNS(null, 'stroke-width', 3);
            react1.setAttributeNS(null, 'fill', 'none');
            react1.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!react2) {
                react2 = document.createElementNS(xmlns, 'rect');
            }
            react2.setAttributeNS(null, 'id', `rect2`);
            react2.setAttributeNS(null, 'class', `cls-focus`);
            react2.setAttributeNS(null, 'x', point4X + (mWidth - mWidth * 0.30));
            react2.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.28));
            react2.setAttributeNS(null, 'width', mWidth * 0.0735);
            react2.setAttributeNS(null, 'height', mHeight * 0.49);
            react2.setAttributeNS(null, 'stroke-width', 3);
            react2.setAttributeNS(null, 'fill', 'none');
            react2.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!svgText) {
                svgText = document.createElementNS(xmlns, 'text');
            }
            svgText.setAttributeNS(null, 'id', `text1`);
            svgText.setAttributeNS(null, 'class', `cls-text`);
            svgText.setAttributeNS(null, 'x', point4X + (mWidth - (mWidth * 0.30 - (mWidth * 0.0735) / 2)));
            svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.45));
            svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
            svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
            svgText.setAttributeNS(null, 'style', 'writing-mode: tb;');

            svgText.innerHTML = '';
            let textNode = document.createTextNode("NOME");
            svgText.appendChild(textNode);
        }
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG) {
        if (FLOW === FLOW_TYPE.FRONT) {
            if (!react1) {
                react1 = document.createElementNS(xmlns, 'rect');
            }
            react1.setAttributeNS(null, 'id', `rect1`);
            react1.setAttributeNS(null, 'class', `cls-focus`);
            react1.setAttributeNS(null, 'x', point4X + (mWidth - (mWidth * 0.58) - (mWidth * 0.09)));
            react1.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.40));
            react1.setAttributeNS(null, 'width', mWidth * 0.58);
            react1.setAttributeNS(null, 'height', mHeight * 0.30);
            react1.setAttributeNS(null, 'stroke-width', 3);
            react1.setAttributeNS(null, 'fill', 'none');
            react1.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!svgText) {
                svgText = document.createElementNS(xmlns, 'text');
            }
            svgText.setAttributeNS(null, 'id', `text1`);
            svgText.setAttributeNS(null, 'class', `cls-text`);
            svgText.setAttributeNS(null, 'x', point4X + (mWidth - (mWidth * 0.58) - (mWidth * 0.09)));
            svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.42));
            svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
            svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
            svgText.innerHTML = '';
            let textNode = document.createTextNode("FOTO");
            svgText.appendChild(textNode);
        }
        else if (FLOW === FLOW_TYPE.BACK) {
            if (!react1) {
                react1 = document.createElementNS(xmlns, 'rect');
            }
            react1.setAttributeNS(null, 'id', `rect1`);
            react1.setAttributeNS(null, 'class', `cls-focus`);
            react1.setAttributeNS(null, 'x', point4X + mWidth * 0.09);
            react1.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) + ((mHeight * 0.25) / 2));
            react1.setAttributeNS(null, 'width', mWidth * 0.62);
            react1.setAttributeNS(null, 'height', mHeight * 0.30);
            react1.setAttributeNS(null, 'stroke-width', 3);
            react1.setAttributeNS(null, 'fill', 'none');
            react1.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);

            if (!svgText) {
                svgText = document.createElementNS(xmlns, 'text');
            }
            svgText.setAttributeNS(null, 'id', `text1`);
            svgText.setAttributeNS(null, 'class', `cls-text`);
            svgText.setAttributeNS(null, 'x', point4X + mWidth * 0.09);
            svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) + ((mHeight * 0.25) / 2) - 10);
            svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
            svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
            svgText.innerHTML = '';
            let textNode = document.createTextNode("DIGITAL");
            svgText.appendChild(textNode);
        }
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF) {
        if (!svgText) {
            svgText = document.createElementNS(xmlns, 'text');
        }
        svgText.setAttributeNS(null, 'id', `text1`);
        svgText.setAttributeNS(null, 'class', `cls-text-medium`);
        svgText.setAttributeNS(null, 'x', point4X + (mWidth * 0.40));
        svgText.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.45));
        svgText.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
        svgText.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
        svgText.setAttributeNS(null, 'style', 'writing-mode: tb;');

        svgText.innerHTML = '';
        let textNode = document.createTextNode("000.000.000-00");
        svgText.appendChild(textNode);

        if (!svgText2) {
            svgText2 = document.createElementNS(xmlns, 'text');
        }
        svgText2.setAttributeNS(null, 'id', `text2`);
        svgText2.setAttributeNS(null, 'class', `cls-text-big`);
        svgText2.setAttributeNS(null, 'x', point4X + (mWidth - (mWidth * 0.30 - (mWidth * 0.09) / 2)));
        svgText2.setAttributeNS(null, 'y', (isMobile() ? mBoxYCenter - point6Y : mBoxYCenter) - (mHeight * 0.30));
        svgText2.setAttributeNS(null, 'stroke', COLOR_SILHOUETTE.SECONDARY);
        svgText2.setAttributeNS(null, 'fill', COLOR_SILHOUETTE.SECONDARY);
        svgText2.setAttributeNS(null, 'style', 'writing-mode: tb;');

        svgText2.innerHTML = '';
        let textNode2 = document.createTextNode("CPF");
        svgText2.appendChild(textNode2);
    }

    // structure
    if (!exists) {
        groupMask.appendChild(pathBackground);
        groupMask.appendChild(pathFocus);
        if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH) {
            groupMask.appendChild(pathLine);
            groupMask.appendChild(react1);
            groupMask.appendChild(react2);
            groupMask.appendChild(svgText);
        }
        else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG) {
            if (FLOW === FLOW_TYPE.FRONT) {
                groupMask.appendChild(react1);
                groupMask.appendChild(react2);
                groupMask.appendChild(svgText);
            }
            else if (FLOW === FLOW_TYPE.BACK) {
                groupMask.appendChild(react1);
                groupMask.appendChild(react2);
                groupMask.appendChild(svgText);
            }
        }
        else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG) {
            if (FLOW === FLOW_TYPE.FRONT) {
                groupMask.appendChild(react1);
                groupMask.appendChild(svgText);
            }
            else if (FLOW === FLOW_TYPE.BACK) {
                groupMask.appendChild(react1);
                groupMask.appendChild(svgText);
            }
        }
        else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF) {
            groupMask.appendChild(svgText);
            groupMask.appendChild(svgText2);
        }

        groupMain.appendChild(groupMask);
        defs.appendChild(style);
        svgMask.appendChild(defs);
        svgMask.appendChild(groupMain);
        boxCamera.appendChild(svgMask);
    }
};

const setTopLabelMessage = () => {
    document.getElementById("message").style.top = `${cameraVideo.offsetHeight / 2 - mHeight / 2 - 25}px`;
};

var initCameraNormal = (COLOR_SILHOUETTE_PRIMARY) => {
    if (!isSupportBrowser) return;

    TYPE_PROCESS = TYPE_CAMERA.CAMERA_NORMAL;
    TYPE_PROCESS_INITIAL = TYPE_CAMERA.CAMERA_NORMAL;

    if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
        COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_PRIMARY;
    }

    setControls();

    isLoading = true;
    showBoxLoading(false);


    callAllMethodsInit();
};

var initCameraInteligence = (COLOR_SILHOUETTE_PRIMARY, COLOR_SILHOUETTE_SECONDARY, COLOR_SILHOUETTE_CAMERA_NORMAL) => {
    if (!isSupportBrowser) return;

    TYPE_PROCESS = TYPE_CAMERA.CAMERA_INTELIGENCE;
    TYPE_PROCESS_INITIAL = TYPE_CAMERA.CAMERA_INTELIGENCE;

    if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
        COLOR_SILHOUETTE.PRIMARY = COLOR_SILHOUETTE_PRIMARY;
    }
    if (COLOR_SILHOUETTE_SECONDARY !== "" && COLOR_SILHOUETTE_SECONDARY !== undefined && COLOR_SILHOUETTE_SECONDARY !== null) {
        COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_SECONDARY;
    }
    if (COLOR_SILHOUETTE_CAMERA_NORMAL !== "" && COLOR_SILHOUETTE_CAMERA_NORMAL !== undefined && COLOR_SILHOUETTE_CAMERA_NORMAL !== null) {
        COLOR_SILHOUETTE.NEUTRAL = COLOR_SILHOUETTE_CAMERA_NORMAL;
    }

    setControls();

    isLoading = true;
    showBoxLoading(false);

    downloadModels();
};

var initDocument = (TYPE, COLOR_SILHOUETTE_PRIMARY, LABEL_DOCUMENT_OTHERS) => {
    if (!isSupportBrowser) return;

    let _TYPE = parseInt(TYPE);
    if (_TYPE === TYPE_DOCUMENT.CNH || _TYPE === TYPE_DOCUMENT.CPF || _TYPE === TYPE_DOCUMENT.RG || _TYPE === TYPE_DOCUMENT.NEW_RG || _TYPE === TYPE_DOCUMENT.OTHERS) {
        TYPE_PROCESS_DOCUMENT = _TYPE;
        TYPE_PROCESS_DOCUMENT_INITIAL = _TYPE;
        FLOW = FLOW_TYPE.FRONT;

        if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
            COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_PRIMARY;
        }

        if (_TYPE === TYPE_DOCUMENT.OTHERS) {
            if (LABEL_DOCUMENT_OTHERS !== "" && LABEL_DOCUMENT_OTHERS !== undefined && LABEL_DOCUMENT_OTHERS !== null) {
                _LABEL_DOCUMENT_OTHERS = LABEL_DOCUMENT_OTHERS;
            }
            else {
                _LABEL_DOCUMENT_OTHERS = 'Outros';
            }
        }
    }
    else {
        onFailedCaptureJS('Tipo de documento inválido!');
        return;
    }

    setControls();

    isLoading = true;
    showBoxLoading(false);

    callAllMethodsInit();
};

const createBoxDocumentInfo = () => {
    if (!document.getElementById('box--document-info')) {
        let boxInfo = document.createElement('div');
        boxInfo.id = 'box--document-info';
        boxInfo.style.width = '100%';
        let _height = (cameraVideo.offsetHeight - parseFloat(buttonCapture.style.top.replace('px', ''))) - buttonCapture.height / 2;
        boxInfo.style.height = _height + 'px';
        boxInfo.innerHTML = `<span id="label--document">${getLabelDocument()}</span>`;
        boxCamera.appendChild(boxInfo);
        document.getElementById('label--document').style.top = (_height / 2) + 'px';
    }
    else {
        let _height = (cameraVideo.offsetHeight - parseFloat(buttonCapture.style.top.replace('px', ''))) - buttonCapture.height / 2;
        document.getElementById('box--document-info').style.height = _height + 'px';
        document.getElementById('box--document-info').innerHTML = `<span id="label--document">${getLabelDocument()}</span>`;
        document.getElementById('label--document').style.top = (_height / 2) + 'px';
    }
};

const hideBoxDocumentInfo = () => {
    let _box = document.getElementById('box--document-info');
    if (_box) {
        document.getElementById('box--document-info').style.display = 'none';
    }
};

const setLabelDocumentInfo = () => {
    document.getElementById('label--document').innerHTML = getLabelDocument();
};

const setControls = () => {
    cameraVideo = document.querySelector('#camera--video');
    cameraCanvas = document.querySelector('#camera--canvas');
    cameraOverlay = document.querySelector('#camera--overlay');
    buttonCapture = document.querySelector('#camera--trigger');
    boxLoading = document.querySelector('#box--loading');
    boxCamera = document.querySelector('#box-camera');
};

const callAllMethodsInit = () => {
    addClickEvent();
    setOrientation();
    addEventPlay();
    addEventResize();
    startCamera();
    setConfiguration();
};

const setConfiguration = () => {
    if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
        setTopLabelMessage();
    }
};

const getLabelDocument = () => {
    if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CNH) {
        return 'CNH Aberta';
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.CPF) {
        return 'CPF';
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.RG || TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.NEW_RG) {
        if (FLOW === FLOW_TYPE.FRONT) {
            return 'RG Frente';
        }
        else {
            return 'RG Verso';
        }
    }
    else if (TYPE_PROCESS_DOCUMENT === TYPE_DOCUMENT.OTHERS) {
        return _LABEL_DOCUMENT_OTHERS;
    }
};

const setOrientation = () => {
    let orientation =
        (screen.orientation || {}).type ||
        screen.mozOrientation ||
        screen.msOrientation;

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
            handleError(e);
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

const visibilityChange = () => {
    if (document.hidden) {
        isTimerSessionContinueRunning = false;
        cameraVideo.pause();
    } else {
        if (!isCaptureReady) {
            cameraVideo.play();
            isTimerSessionContinueRunning = true;
            startTimerSession();
        }
    }
};

window.addEventListener('orientationchange', orientationChange);
navigator.mediaDevices.ondevicechange = orientationChange;
document.addEventListener('visibilitychange', visibilityChange, false);

