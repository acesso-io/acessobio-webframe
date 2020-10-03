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
            if (_isSafari && (_isChrome && _isOpera && _isEdge && _isFirefox)) {
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
let pathFocus;
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

let TYPE_PROCESS;
let TYPE_PROCESS_INITIAL;
var TYPE_CAMERA = {
    CAMERA_NORMAL: 1,
    CAMERA_INTELIGENCE: 2
};

let FLOW;
const FLOW_TYPE = {
    CLOSE: 1
};

let isCentralized = false;
let isTimerTaking = false;
let timerTake;

const SILHUETTE_CONFIGURATIONS = {
    CLOSE: {
        WIDTH: isMobile() ? 285 : 342,
        HEIGHT: isMobile() ? 456 : 547.2
    }
};

const PERCENT_FACE_TOP_BY_VIDEO_THRESHOLD = {
    CLOSE: {
        MIN: 36,
        MAX: 41
    }
};

let COLOR_SILHUETTE = {
    PRIMARY: '#297fff',
    SECONDARY: '#fff'
};

let totalSeconds = 0;
let isTimerSessionContinueRunning = false;
let timerSession;

let resultCamera = {
    base64: null
};

let _centralized = {
    silhoutteWidth: null,
    topSilhuetteThresholdVertical: null,
    bottomSilhuetteThresholdVertical: null,
    inSilhuetteThresholdHorizontal: null,
    overSilhuetteThresholdHorizontal: null,
    faceTurnedSilhuetteThresholdHorizontal: null,
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
        .then(loadMask(COLOR_SILHUETTE.SECONDARY))
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

        buttonCapture.style.bottom = (((cameraVideo.offsetHeight - mHeight) / 2) / 2 - 30) + 'px';

        buttonCapture.style.display = 'inline-block';
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
        loadMask(COLOR_SILHUETTE.SECONDARY);
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
                console.error('Não foi possível baixar os modelos', error);
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
    else if (counterIsRunning >= 6) {
        TYPE_PROCESS = TYPE_CAMERA.CAMERA_NORMAL;
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
        if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL) {
            if (isLoading) {
                hideBoxLoading();
                hideMessage();
            }

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
                            if (FLOW === FLOW_TYPE.CLOSE) {
                                initTimerTake(1700);
                            }
                        }
                    }
                }
                else {
                    changeColorMask(COLOR_SILHUETTE.SECONDARY);
                    hideMessage();
                }
            }
        }

        setTimeout(() => onPlay());

    } catch (error) {
        console.error('Erro ao processar frame', error);
    }
};

const changeColorMask = (color) => {
    document.getElementById('focus-silhuette').style.stroke = color;
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
        if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_NORMAL || TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
            let base64 = getBase64Canvas();
            isCaptureReady = true;
            setImageBackgroundAndLoading();

            resultCamera.base64 = base64;

            onSuccessCaptureJS({
                base64: base64,
                Log: {
                    TYPE_PROCESS_INITIAL: TYPE_PROCESS_INITIAL,
                    TYPE_PROCESS: TYPE_PROCESS,
                    TOTAL_SECONDS: totalSeconds,
                    Device: platform.ua,
                    Silhuette: {
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
                }
            });

            completedAnimation();
            stopStuffsAfterTake();
        }
    } else {
        
        setVisibilityOpenCamera();
		
        startCamera();
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

	if(isMobile()){
		_centralized.topSilhuetteThresholdVertical = 8 / 100 * cameraVideo.offsetHeight;
		_centralized.bottomSilhuetteThresholdVertical = 3.47 / 100 * cameraVideo.offsetHeight;
		_centralized.inSilhuetteThresholdHorizontal = 12 / 100 * cameraVideo.offsetWidth;
		_centralized.overSilhuetteThresholdHorizontal = 4 / 100 * cameraVideo.offsetWidth;
		_centralized.faceTurnedSilhuetteThresholdHorizontal = 15 / 100 * cameraVideo.offsetWidth;
		_centralized.differenceNoseYThreshold = 7 / 100 * cameraVideo.offsetHeight;
	}
	else {
		_centralized.topSilhuetteThresholdVertical = 4 / 100 * cameraVideo.offsetHeight;
		_centralized.bottomSilhuetteThresholdVertical = 3 / 100 * cameraVideo.offsetHeight;
		_centralized.inSilhuetteThresholdHorizontal = 1 / 100 * cameraVideo.offsetWidth;
		_centralized.overSilhuetteThresholdHorizontal = 4 / 100 * cameraVideo.offsetWidth;
		_centralized.faceTurnedSilhuetteThresholdHorizontal = 9 / 100 * cameraVideo.offsetWidth;
		_centralized.differenceNoseYThreshold = 7 / 100 * cameraVideo.offsetHeight;
	}
	
    _centralized.differenceLeftY = leftY - noseY;
    _centralized.differenceRightY = rightY - noseY;

    _centralized.CSPWidthLeft = cameraVideo.offsetWidth / 2 - _centralized.silhoutteWidth / 2;
    _centralized.CSPWidthRight = cameraVideo.offsetWidth / 2 + _centralized.silhoutteWidth / 2;
    _centralized.CSPHeightTop = cameraVideo.offsetHeight / 2 - _centralized.topSilhuetteThresholdVertical;
    _centralized.CSPHeightBottom = cameraVideo.offsetHeight / 2 + _centralized.bottomSilhuetteThresholdVertical;
    _centralized.distanceLeftByNose = noseX - leftX;
    _centralized.distanceRightByNose = rightX - noseX;

    if (_centralized.distanceLeftByNose >= _centralized.distanceRightByNose) {
        _centralized.differenceInDistance = _centralized.distanceLeftByNose - _centralized.distanceRightByNose;
    }
    else {
        _centralized.differenceInDistance = _centralized.distanceRightByNose - _centralized.distanceLeftByNose;
    }
	
    if (leftX >= _centralized.CSPWidthLeft - _centralized.overSilhuetteThresholdHorizontal &&
        leftX <= _centralized.CSPWidthLeft + _centralized.inSilhuetteThresholdHorizontal &&
        rightX <= _centralized.CSPWidthRight + _centralized.overSilhuetteThresholdHorizontal &&
        rightX >= _centralized.CSPWidthRight - _centralized.inSilhuetteThresholdHorizontal &&
        noseY >= _centralized.CSPHeightTop && noseY <= _centralized.CSPHeightBottom &&
        _centralized.differenceInDistance < _centralized.faceTurnedSilhuetteThresholdHorizontal &&
        _centralized.differenceLeftY < _centralized.differenceNoseYThreshold && _centralized.differenceRightY < _centralized.differenceNoseYThreshold &&
        _centralized.differenceLeftY > -_centralized.differenceNoseYThreshold && _centralized.differenceRightY > -_centralized.differenceNoseYThreshold) {

        changeColorMask(COLOR_SILHUETTE.PRIMARY);

        showMessage('Não se mexa...');

        isCentralized = true;
        return true;
    }
    else {

        changeColorMask(COLOR_SILHUETTE.SECONDARY);

        if (rightX - leftX > _centralized.silhoutteWidth) {
            showMessage('Afaste o rosto');
        }
        else if (rightX - leftX < _centralized.silhoutteWidth - _centralized.inSilhuetteThresholdHorizontal) {
            showMessage('Aproxime o rosto');
        }
        else if (noseY <= _centralized.CSPHeightTop) {
            showMessage('Centralize o rosto');
        }
        else if (noseY >= _centralized.CSPHeightBottom) {
            showMessage('Centralize o rosto');
        }
        else if (leftX <= _centralized.CSPWidthLeft - _centralized.overSilhuetteThresholdHorizontal) {
            showMessage('Rosto para cima');
        }
        else if (rightX >= _centralized.CSPWidthRight + _centralized.overSilhuetteThresholdHorizontal) {
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

    if (isMobile() && isIOS()) {
        if (resolutionHeight > resolutionWidth) {
            let vResolutionHeight = resolutionHeight;
            let vResolutionWidth = resolutionWidth;
            resolutionHeight = vResolutionWidth;
            resolutionWidth = vResolutionHeight;
        }
    }
	
    let factorWidth = (videoWidth / resolutionWidth) * (FLOW === FLOW_TYPE.CLOSE ? SILHUETTE_CONFIGURATIONS.CLOSE.WIDTH : SILHUETTE_CONFIGURATIONS.AWAY.WIDTH);
    let factorHeight = (videoHeight / resolutionHeight) * (FLOW === FLOW_TYPE.CLOSE ? SILHUETTE_CONFIGURATIONS.CLOSE.HEIGHT : SILHUETTE_CONFIGURATIONS.AWAY.HEIGHT);

    if (isMobile()) {
        
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

    
    pathFocus.setAttributeNS(null, 'id', `focus-silhuette`);
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

const setTopLabelMessage = () => {
    document.getElementById("message").style.top = `${cameraVideo.offsetHeight / 2 - mHeight / 2 - 25}px`;
};

var init = (TYPE, COLOR_SILHUETTE_PRIMARY, COLOR_SILHUETTE_SECONDARY) => {
    if (!isSupportBrowser) return;

    let _TYPE = parseInt(TYPE);

    if (_TYPE === TYPE_CAMERA.CAMERA_NORMAL || _TYPE === TYPE_CAMERA.CAMERA_INTELIGENCE) {
        TYPE_PROCESS = _TYPE;
        TYPE_PROCESS_INITIAL = _TYPE;
    }
    else {
        TYPE_PROCESS = TYPE_CAMERA.CAMERA_NORMAL;
        TYPE_PROCESS_INITIAL = TYPE_CAMERA.CAMERA_NORMAL;
    }
	
	if(COLOR_SILHUETTE_PRIMARY !== "" && COLOR_SILHUETTE_PRIMARY !== undefined && COLOR_SILHUETTE_PRIMARY !== null){
	    COLOR_SILHUETTE.PRIMARY = COLOR_SILHUETTE_PRIMARY;
	}
	if(COLOR_SILHUETTE_SECONDARY !== "" && COLOR_SILHUETTE_SECONDARY !== undefined && COLOR_SILHUETTE_SECONDARY !== null){
	    COLOR_SILHUETTE.SECONDARY = COLOR_SILHUETTE_SECONDARY;
	}

    FLOW = FLOW_TYPE.CLOSE;

    isLoading = true;
    showBoxLoading(false);

    if (TYPE_PROCESS === TYPE_CAMERA.CAMERA_INTELIGENCE) {
        verifyFaceApiIsRunning();
        downloadModels();
    }
    else {
        callAllMethodsInit();
    }
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

document.addEventListener("DOMContentLoaded", () => {
	
	cameraVideo = document.querySelector('#camera--video');
	
	cameraCanvas = document.querySelector('#camera--canvas');
	
	cameraOverlay = document.querySelector('#camera--overlay');
	
	buttonCapture = document.querySelector('#camera--trigger');
	
	boxLoading = document.querySelector('#box--loading');
	
	boxCamera = document.querySelector('#box-camera');
	document.getElementById('reinit').onclick = () => { location.reload(); };
});

window.addEventListener('orientationchange', orientationChange);
navigator.mediaDevices.ondevicechange = orientationChange;
document.addEventListener('visibilitychange', visibilityChange, false);

