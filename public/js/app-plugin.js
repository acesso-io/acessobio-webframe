//Version 1.0.5
var errorFragmentShader = false;

class AcessoWebFrameSupport {

    isMobile = () => {
        return navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i) ?
            true :
            false;
    }

    isIOS = () => {
        return navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ?
            true :
            false;
    };

    isAndroid = () => {
        return navigator.userAgent.match(/Android/i) ?
            true :
            false;
    };

    _isMobile = this.isMobile();

    verifyBrowserSupport = () => {
        let _isChrome = platform.description.toLowerCase().indexOf('chrome') > -1;
        let _isFirefox = platform.description.toLowerCase().indexOf('firefox') > -1;
        let _isSafari = platform.description.toLowerCase().indexOf('safari') > -1;
        let _isEdge = platform.description.toLowerCase().indexOf('edge') > -1;
        let _isOpera = platform.description.toLowerCase().indexOf('opera') > -1;

        if (this._isMobile) {
            if (this.isAndroid()) {
                if (_isChrome || _isFirefox || _isEdge || _isFirefox) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.isIOS()) {
                if (_isSafari && (!_isChrome && !_isOpera && !_isEdge && !_isFirefox)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (!this.isIOS()) {
                if (_isChrome || _isOpera || _isEdge || _isFirefox) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.isIOS()) {
                if (_isSafari && (!_isChrome && !_isOpera && !_isEdge && !_isFirefox)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    isSupportBrowser = this.verifyBrowserSupport();

    // Opera 8.0+
    isOpera =
        (!!window.opr && !!opr.addons) ||
        !!window.opera ||
        navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function(p) {
            return p !== undefined && p.toString() === '[object SafariRemoteNotification]';
        })(!window['safari'] ||
            (typeof safari !== 'undefined' && safari.pushNotification)
        );

    // Chrome 1 - 79
    isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    browserNotSupport = () => {
        if (this._isMobile) {
            if (this.isAndroid()) {
                return {
                    message: 'Navegadores permitidos:',
                    listBrowsersSupport: ['Chrome', 'Firefox', 'Edge', 'Opera']
                };
            } else if (this.isIOS()) {
                return {
                    message: 'Navegadores permitidos:',
                    listBrowsersSupport: ['Safari']
                };
            }
        } else {
            if (this.isIOS()) {
                return {
                    message: 'Navegadores permitidos:',
                    listBrowsersSupport: ['Safari']
                };
            } else {
                return {
                    message: 'Navegadores permitidos:',
                    listBrowsersSupport: ['Chrome', 'Firefox', 'Edge', 'Opera']
                };
            }
        }
    };
}

class AcessoWebFramePopup {
    constructor() {
        this.Message;
        this.boxLoading;
        this.boxOrientation;
    }

    showBoxLoading = () => {
        if (this.boxLoading) {
            this.boxLoading.style.backgroundColor = "white";
            this.boxLoading.style.display = "block";
        }
    };

    hideBoxLoading = () => {
        if (this.boxLoading) {
            this.boxLoading.style.display = "none";
        }
    };

    showBoxLockOrientation = () => {
        if (this.boxOrientation) {
            this.boxOrientation.style.visibility = 'visible';
            this.boxOrientation.style.opacity = 1;
        }
    };

    hideBoxLockOrientation = () => {
        if (this.boxOrientation) {
            this.boxOrientation.style.visibility = 'hidden';
            this.boxOrientation.style.opacity = 0;
        }
    };

    showMessage = (message) => {
        if (this.Message && this.Message.innerHTML !== message) {
            this.Message.innerHTML = message;
            this.Message.style.visibility = 'visible';
            this.Message.style.opacity = 1;
        }
    };

    hideMessage = () => {
        if (this.Message) {
            this.Message.innerHTML = '';
            this.Message.style.visibility = 'hidden';
            this.Message.style.opacity = 0;
        }
    };
}

class AcessoWebFrameModel {
    constructor() {
        this.isfaceApiLoaded = false;
    }

    loadModelsCameraInteligence = async() => {
        if (!this.isfaceApiLoaded) {
            return await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(this.getHostUrlBase('models')),
                    faceapi.nets.faceLandmark68Net.loadFromUri(this.getHostUrlBase('models'))
                ])
                .then(() => {
                    this.isfaceApiLoaded = true;
                })
                .catch(() => {
                    return Promise.reject(new Error('Não foi possível baixar os modelos, pode ser erro de diretório ou arquivos do face-api não carregados anteriormente.'));
                });
        } else {
            return Promise.resolve();
        }
    };

    getFaceDetectorOptions = () => {
        return new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    };

    isFaceDetectionModelLoaded = () => {
        return !!faceapi.nets.tinyFaceDetector.params;
    };

    isFaceLandmark68NetLoaded = () => {
        return !!faceapi.nets.faceLandmark68Net.params;
    };

    getHostUrlBase = (path) => {
        return window.location.protocol + '//' + window.location.host + "/" + path;
    }
}

class AcessoWebFrame {
    constructor() {
        this.acessoWebFrameSupport = new AcessoWebFrameSupport();
        this.acessoWebFramePopup = new AcessoWebFramePopup();
        this.acessoWebFrameModel = new AcessoWebFrameModel();

        this.SILHOUETTE_CONFIGURATIONS = {
            CLOSE: {
                WIDTH: this.acessoWebFrameSupport._isMobile ? 285 : 307.8,
                HEIGHT: this.acessoWebFrameSupport._isMobile ? 456 : 492.48
            }
        };

        this.constraints = {};
        this.constraintsBase = {
            video: {
                facingMode: 'user'
            },
            audio: false
        };

        this.videoOrientation;
        this.track = null;
        this.cameraOpen;
        this.svgMask;
        this.defs;
        this.style;
        this.groupMain;
        this.groupMask;
        this.pathBackground;
        this.pathLine;
        this.pathFocus;
        this.bottomSilhouetteDocument;
        this.react1;
        this.react2;
        this.react3;
        this.svgText;
        this.svgText2;
        this.stream;
        this.aspectRatioVideo = 1280 / 720;
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.mWidth = 0;
        this.mHeight = 0;
        this.resolutionWidth = 1280;
        this.resolutionHeight = 720;
        this.isResolutionRead = false;
        this.subPath = window.location.pathname + '/';
        this.forwardTimes = [];
        this.avgTimeInMs;

        this.isCaptureReady = false;
        this.isLoading = false;
        this.videoSourceInfoId;

        this.isFaceApiIsRunning = false;
        this.counterIsRunning = 0;

        this.onSuccessCaptureJS;
        this.onFailedCaptureJS;
        this.onBrowserNotSupportJS;

        this.TYPE_PROCESS = null;
        this.TYPE_PROCESS_INITIAL = null;
        this.TYPE_CAMERA = {
            CAMERA_NORMAL: 1,
            CAMERA_INTELIGENCE: 2
        };

        this.TYPE_PROCESS_DOCUMENT = null;
        this.TYPE_PROCESS_DOCUMENT_INITIAL = null;
        this.TYPE_DOCUMENT = {
            CNH: 1,
            RG: 2,
            CPF: 3,
            NEW_RG: 4,
            OTHERS: 5,
            RG_FRONT: 6,
            RG_BACK: 7,
            NEW_RG_FRONT: 8,
            NEW_RG_BACK: 9
        };

        this.FLOW;
        this.FLOW_TYPE = {
            FRONT: 1,
            BACK: 2
        };

        this.FACE_MODE = null;
        this.FACE_MODE_TYPE = {
            FRONT: 1,
            BACK: 2
        };

        this.LABEL_DOCUMENT_OTHERS;
        this.base64Front;

        this.isCentralized = false;
        this.isTimerTaking = false;
        this.timerTake;

        this.COLOR_SILHOUETTE = {
            PRIMARY: '#297fff',
            SECONDARY: '#fff',
            NEUTRAL: '#fff'
        };

        this.totalSeconds = 0;
        this.isTimerSessionContinueRunning = false;
        this.timerSession;

        this.centralized = {
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

        this.cameraVideo;
        this.cameraCanvas;
        this.cameraOverlay;
        this.buttonCapture;
        this.boxCamera;
        this.boxOrientation;
        this.FocusSilhouette;
    }

    Orientation = {
        PORTRAIT: 1,
        LANDSCAPE: 2
    };

    defaultConstraints = {
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

    getAndroidVersion = (ua) => {
        ua = (ua || navigator.userAgent).toLowerCase();
        let match = ua.match(/android\s([0-9\.]*)/i);
        return match ? match[1] : undefined;
    };

    addClickEvent = () => {
        if (this.buttonCapture) {
            this.buttonCapture.onclick = this.takePicture;
        }
    };

    gotStream = (mediaStream) => {
        if (mediaStream) {
            this.stream = window.stream = mediaStream;
            this.cameraVideo.srcObject = mediaStream;
            this.setTrack(mediaStream);
        }
    };

    gotDevices = (deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];

            if (deviceInfo.kind === 'videoinput') {
                this.videoSourceInfoId = deviceInfo.deviceId ? deviceInfo.deviceId : undefined;
                if (!this.isFirefox) {
                    break;
                }
            }
        }
    };

    setTrack = (mediaStream) => {
        if (mediaStream) {
            this.track = mediaStream.getVideoTracks()[0];
            if (this.track.getSettings()) {
                if (!this.isResolutionRead) {
                    this.isResolutionRead = true;
                    this.resolutionWidth = this.track.getSettings().width;
                    this.resolutionHeight = this.track.getSettings().height;
                }
            }
            this.setConstraint(this.track.getConstraints());
        }
    };

    setConstraint = (newConstraints) => {
        if (newConstraints) {
            let _constraints = {};
            // copia os dados básicos (video.user e audio)
            Object.assign(_constraints, this.constraints);
            // copia a resolucao nova
            Object.assign(_constraints, newConstraints);
            // define na variavel
            this.constraints = _constraints;
            this.setAspectRatio(this.constraints);
        }
    };

    setAspectRatio = (constraints) => {
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
                this.aspectRatioVideo = width / height;
            }
            // portrait
            else {
                this.aspectRatioVideo = height / width;
            }
        }
    };

    handleError = (error) => {
        if (error) {
            this.onFailedCaptureJS(`navigator.MediaDevices.getUserMedia error: ${error.message}, ${error.name}`);
        } else {
            this.onFailedCaptureJS('Ooopss algo deu errado na abertura da câmera');
        }
    };

    setMobileStyle = () => {
        if (this.cameraVideo) {
            if (this.acessoWebFrameSupport._isMobile) {
                this.cameraVideo.style['object-fit'] = 'cover';
            } else {
                this.cameraVideo.style['object-fit'] = '';
            }
        }
    };

    startCamera = () => {
        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        if (!this.constraints ||
            !this.constraints.video ||
            !this.constraints.video.width ||
            !this.constraints.video.height ||
            !this.constraints.video.width.min ||
            !this.constraints.video.width.ideal ||
            !this.constraints.video.width.max ||
            !this.constraints.video.height.min ||
            !this.constraints.video.height.ideal ||
            !this.constraints.video.height.max
        ) {

            if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK ||
                (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL && this.FACE_MODE === this.FACE_MODE_TYPE.BACK)) {
                this.constraintsBase.video.facingMode = "environment";
                this.defaultConstraints.video.facingMode = "environment";
                this.cameraVideo.style.webkitTransform = "none";
                this.cameraCanvas.style.webkitTransform = "none";
            }

            // configuração base
            Object.assign(this.constraints, this.constraintsBase);
            // exceto Safari
            if (!this.acessoWebFrameSupport.isSafari) {
                if (
                    this.acessoWebFrameSupport.isFirefox && this.acessoWebFrameSupport._isMobile &&
                    ((this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL && this.FACE_MODE === this.FACE_MODE_TYPE.FRONT) ||
                        this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE)
                ) {
                    this.defaultConstraints.video.facingMode = 'user';
                }
                Object.assign(this.constraints, this.defaultConstraints);
            }

            this.setConstraint(this.constraints);
        }

        navigator.mediaDevices
            .getUserMedia(this.getConstraints())
            .then(this.gotStream)
            .then(this.setMobileStyle())
            .then(this.setTypeSilhouette)
            .then(this.calcBtnCapturePos)
            .then(this.calcMarginMask)
            .then(() => {
                if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
                    this.verifyFaceApiIsRunning();
                    this.setConfiguration();
                } else {
                    if (this.isLoading) {
                        this.acessoWebFramePopup.hideBoxLoading();
                        this.acessoWebFramePopup.hideMessage();
                        this.isLoading = false;
                    }
                }
            })
            .catch((error) => {
                this.handleError(error);
            });
    };

    stopStuffsAfterTake = () => {
        // stop tracking
        this.track.stop();

        // hide mask
        this.setVisibilityAfterTake();

        this.acessoWebFramePopup.hideMessage();

        this.hideBoxDocumentInfo();

        // set camera status
        this.cameraOpen = false;
    };

    setVisibilityOpenCamera = () => {
        // show mask
        this.svgMask.style.display = 'unset';

        // show camera video
        this.cameraVideo.style.display = 'unset';

        // hides box loading
        this.acessoWebFramePopup.hideBoxLoading();
    };

    setVisibilityAfterTake = () => {
        this.svgMask.style.display = 'none';
        // hide video
        this.cameraVideo.style.display = 'none';
    };

    calcBtnCapturePos = async() => {
        if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL) {
            // diferença entre o video e a area visivel (na web fica com a faixa preta caso ultrapasse a area do video)
            this.buttonCapture.style.top = '';
            this.buttonCapture.style.bottom = (((this.cameraVideo.offsetHeight - this.mHeight) / 2) / 2 / 2) + 'px';

            this.buttonCapture.style.display = 'inline-block';
        } else if (
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS) {
            this.buttonCapture.style.bottom = '';
            this.buttonCapture.style.top = (this.bottomSilhouetteDocument + 10) + 'px';
            this.buttonCapture.style.display = 'inline-block';
            this.createBoxDocumentInfo();
        } else if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
            this.buttonCapture.style.display = 'none';
        }
    };

    calcMarginMask = async() => {
        // diferença entre o video e a area visivel (na web fica com a faixa preta caso ultrapasse a area do video)
        let diffH = this.boxCamera.offsetHeight - this.videoHeight;
        let diffW = this.boxCamera.offsetWidth - this.videoWidth;
        let paddingH = diffH > 0 ? diffH / 2 : 0;
        let paddingW = diffW > 0 ? diffW / 2 : 0;
        this.cameraOverlay.style.padding = `${paddingH}px ${paddingW}px`;
    };

    toggleFullScreen = () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    orientationChange = () => {
        this.setOrientation();
        window.scrollTo(0, document.body.scrollHeight);
        this.updateView();
        this.toggleFullScreen();
    };

    updateView = () => {
        if (this.cameraOpen) {
            if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL || this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
                this.loadMask(this.COLOR_SILHOUETTE.SECONDARY);
            } else {
                this.loadMaskDocument(this.COLOR_SILHOUETTE.SECONDARY);
            }

            this.calcBtnCapturePos();

            this.calcMarginMask();
            this.setMobileStyle();
            this.setTopLabelMessage();
        }
    };

    addEventResize = async() => {
        window.addEventListener('resize', (e) => {
            this.setOrientation();
            this.updateView();
            this.toggleFullScreen();
        });
    };

    updateTimeStats = (timeInMs) => {
        this.forwardTimes = [timeInMs].concat(this.forwardTimes).slice(0, 30);
        this.avgTimeInMs = this.forwardTimes.reduce((total, t) => total + t) / this.forwardTimes.length;
    };

    verifyFaceApiIsRunning = () => {
        if (this.isFaceApiIsRunning) {
            return;
        } else if (errorFragmentShader || this.counterIsRunning >= 8) {
            this.TYPE_PROCESS = this.TYPE_CAMERA.CAMERA_NORMAL;
            this.COLOR_SILHOUETTE.SECONDARY = this.COLOR_SILHOUETTE.NEUTRAL;
            this.loadMask(this.COLOR_SILHOUETTE.SECONDARY);
            this.calcBtnCapturePos();
            this.acessoWebFramePopup.hideBoxLoading();
            this.acessoWebFramePopup.hideMessage();
            this.isLoading = false;
            this.onPlay();
        } else {
            setTimeout(() => {
                this.counterIsRunning++;
                this.verifyFaceApiIsRunning();
            }, 1000);
        }
    };

    startTimerSession = () => {
        if (this.isTimerSessionContinueRunning) {
            this.timerSession = setTimeout(() => {
                this.totalSeconds++;
                this.startTimerSession();
            }, 1000);
        }
    };

    onPlay = async() => {
        try {
            if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS) {

                if (
                    this.cameraVideo.paused ||
                    this.cameraVideo.ended ||
                    this.isCaptureReady
                ) {
                    return setTimeout(() => { this.onPlay(); });
                }

                if (!this.isTimerSessionContinueRunning) {
                    this.isTimerSessionContinueRunning = true;
                    this.startTimerSession();
                }

                const ts = Date.now();
                this.updateTimeStats(Date.now() - ts);
            } else if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
                if (
                    this.cameraVideo.paused ||
                    this.cameraVideo.ended ||
                    !this.acessoWebFrameModel.isFaceDetectionModelLoaded() ||
                    (this.acessoWebFrameSupport._isMobile && this.videoOrientation === this.Orientation.LANDSCAPE) ||
                    this.isCaptureReady
                ) {
                    return setTimeout(() => { this.onPlay(); });
                }

                const options = this.acessoWebFrameModel.getFaceDetectorOptions();
                const ts = Date.now();

                const result = await faceapi
                    .detectSingleFace(this.cameraVideo, options)
                    .withFaceLandmarks();

                this.updateTimeStats(Date.now() - ts);

                if (this.isLoading) {
                    this.isFaceApiIsRunning = true;
                    this.acessoWebFramePopup.hideBoxLoading();
                    this.isTimerSessionContinueRunning = true;
                    this.startTimerSession();
                    this.isLoading = false;
                } else {
                    if (result) {
                        if (this.isCaptureReady) return setTimeout(() => { this.onPlay(); });

                        let dims = faceapi.matchDimensions(this.cameraOverlay, this.cameraVideo, true);
                        dims.height = this.cameraVideo.offsetHeight;
                        dims.width = this.cameraVideo.offsetWidth;
                        const resizedResult = faceapi.resizeResults(result, dims);

                        if (this.isCentralizedFace(
                                resizedResult.landmarks.positions[0]._x,
                                resizedResult.landmarks.positions[0]._y,
                                resizedResult.landmarks.positions[16]._x,
                                resizedResult.landmarks.positions[16]._y,
                                resizedResult.landmarks.positions[27]._x,
                                resizedResult.landmarks.positions[27]._y
                            )) {

                            if (!this.isTimerTaking) {
                                this.initTimerTake(1700);
                            }
                        }
                    } else {
                        this.changeColorMask(this.COLOR_SILHOUETTE.NEUTRAL);
                        this.acessoWebFramePopup.hideMessage();
                    }
                }
            }

            return setTimeout(() => { this.onPlay(); });

        } catch (error) {
            console.log(error);
        }
    };

    changeColorMask = (color) => {
        if (!this.FocusSilhouette) {
            this.FocusSilhouette = this.boxCamera.querySelector('#focus-silhouette');
        }
        if (this.FocusSilhouette.getAttribute('style') !== `stroke: ${color};`) {
            this.FocusSilhouette.setAttribute('style', `stroke: ${color};`);
        }
    };

    setLoading = () => {
        this.acessoWebFramePopup.showBoxLoading();
        this.buttonCapture.style.display = 'none';
    };

    initTimerTake = (milliseconds) => {
        this.isTimerTaking = true;
        this.timerTake = setTimeout(() => {
            if (this.isCentralized) {
                clearTimeout(this.timerTake);
                this.takePicture();
            } else {
                this.isTimerTaking = false;
                clearTimeout(this.timerTake);
            }
        }, milliseconds);
    };

    takePicture = () => {
        if (this.cameraOpen) {
            if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL ||
                this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK) {

                let base64 = this.getBase64Canvas();
                this.isCaptureReady = true;
                this.setLoading();

                this.onSuccessCaptureJS({
                    base64: base64,
                    Log: this.getLog()
                });

                this.stopStuffsAfterTake();
                this.acessoWebFramePopup.hideBoxLoading();
            } else if (
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG
            ) {

                if (this.FLOW === this.FLOW_TYPE.FRONT) {
                    this.base64Front = this.getBase64Canvas();
                    this.FLOW = this.FLOW_TYPE.BACK;
                    this.isCaptureReady = false;
                    this.setLabelDocumentInfo();
                    this.acessoWebFramePopup.showBoxLoading();
                    this.loadMaskDocument(this.COLOR_SILHOUETTE.SECONDARY);
                    setTimeout(() => {
                        this.acessoWebFramePopup.hideBoxLoading();
                    }, 1000);
                } else if (this.FLOW === this.FLOW_TYPE.BACK) {
                    let base64 = this.getBase64Canvas();
                    this.isCaptureReady = true;
                    this.setLoading();

                    this.onSuccessCaptureJS({
                        base64: this.base64Front,
                        base64Back: base64,
                        Log: this.getLog()
                    });

                    this.stopStuffsAfterTake();
                    this.acessoWebFramePopup.hideBoxLoading();
                }
            }
        } else {
            this.setVisibilityOpenCamera();

            this.startCamera();
        }
    };

    getLog = () => {
        if (this.TYPE_PROCESS !== null) {
            return {
                TYPE_PROCESS_INITIAL: this.TYPE_PROCESS_INITIAL,
                TYPE_PROCESS: this.TYPE_PROCESS,
                TOTAL_SECONDS: this.totalSeconds,
                Device: platform.ua,
                SILHOUETTE: {
                    width: this.mWidth,
                    height: this.mHeight
                },
                video: {
                    width: this.cameraVideo.offsetWidth,
                    height: this.cameraVideo.offsetHeight
                },
                radio: this.aspectRatioVideo,
                screen: {
                    width: screen.width,
                    height: screen.height
                }
            };
        } else if (this.TYPE_PROCESS_DOCUMENT !== null) {
            return {
                TYPE_PROCESS_DOCUMENT_INITIAL: this.TYPE_PROCESS_DOCUMENT_INITIAL,
                TYPE_PROCESS_DOCUMENT: this.TYPE_PROCESS_DOCUMENT,
                TOTAL_SECONDS: this.totalSeconds,
                Device: platform.ua,
                SILHOUETTE: {
                    width: this.mWidth,
                    height: this.mHeight
                },
                video: {
                    width: this.cameraVideo.offsetWidth,
                    height: this.cameraVideo.offsetHeight
                },
                radio: this.aspectRatioVideo,
                screen: {
                    width: screen.width,
                    height: screen.height
                }
            };
        }
    };

    getBase64Canvas = () => {
        this.cameraCanvas.width = this.cameraVideo.videoWidth;
        this.cameraCanvas.height = this.cameraVideo.videoHeight;
        this.cameraCanvas.getContext('2d').drawImage(this.cameraVideo, 0, 0);
        return this.cameraCanvas.toDataURL('image/jpeg');
    };

    isCentralizedFace = (leftX, leftY, rightX, rightY, noseX, noseY) => {
        this.centralized.silhoutteWidth = this.mWidth;

        if (this.acessoWebFrameSupport._isMobile) {
            this.centralized.topSilhouetteThresholdVertical = 8 / 100 * this.cameraVideo.offsetHeight;
            this.centralized.bottomSilhouetteThresholdVertical = 3.47 / 100 * this.cameraVideo.offsetHeight;
            this.centralized.inSilhouetteThresholdHorizontal = 12 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.overSilhouetteThresholdHorizontal = 4 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.faceTurnedSilhouetteThresholdHorizontal = 15 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.differenceNoseYThreshold = 7 / 100 * this.cameraVideo.offsetHeight;
        } else {
            this.centralized.topSilhouetteThresholdVertical = 4 / 100 * this.cameraVideo.offsetHeight;
            this.centralized.bottomSilhouetteThresholdVertical = 3 / 100 * this.cameraVideo.offsetHeight;
            this.centralized.inSilhouetteThresholdHorizontal = 1 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.overSilhouetteThresholdHorizontal = 4 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.faceTurnedSilhouetteThresholdHorizontal = 9 / 100 * this.cameraVideo.offsetWidth;
            this.centralized.differenceNoseYThreshold = 7 / 100 * this.cameraVideo.offsetHeight;
        }

        this.centralized.differenceLeftY = leftY - noseY;
        this.centralized.differenceRightY = rightY - noseY;

        this.centralized.CSPWidthLeft = this.cameraVideo.offsetWidth / 2 - this.centralized.silhoutteWidth / 2;
        this.centralized.CSPWidthRight = this.cameraVideo.offsetWidth / 2 + this.centralized.silhoutteWidth / 2;
        this.centralized.CSPHeightTop = this.cameraVideo.offsetHeight / 2 - this.centralized.topSilhouetteThresholdVertical;
        this.centralized.CSPHeightBottom = this.cameraVideo.offsetHeight / 2 + this.centralized.bottomSilhouetteThresholdVertical;
        this.centralized.distanceLeftByNose = noseX - leftX;
        this.centralized.distanceRightByNose = rightX - noseX;

        if (this.centralized.distanceLeftByNose >= this.centralized.distanceRightByNose) {
            this.centralized.differenceInDistance = this.centralized.distanceLeftByNose - this.centralized.distanceRightByNose;
        } else {
            this.centralized.differenceInDistance = this.centralized.distanceRightByNose - this.centralized.distanceLeftByNose;
        }

        if (leftX >= this.centralized.CSPWidthLeft - this.centralized.overSilhouetteThresholdHorizontal &&
            leftX <= this.centralized.CSPWidthLeft + this.centralized.inSilhouetteThresholdHorizontal &&
            rightX <= this.centralized.CSPWidthRight + this.centralized.overSilhouetteThresholdHorizontal &&
            rightX >= this.centralized.CSPWidthRight - this.centralized.inSilhouetteThresholdHorizontal &&
            noseY >= this.centralized.CSPHeightTop && noseY <= this.centralized.CSPHeightBottom &&
            this.centralized.differenceInDistance < this.centralized.faceTurnedSilhouetteThresholdHorizontal &&
            this.centralized.differenceLeftY < this.centralized.differenceNoseYThreshold && this.centralized.differenceRightY < this.centralized.differenceNoseYThreshold &&
            this.centralized.differenceLeftY > -this.centralized.differenceNoseYThreshold && this.centralized.differenceRightY > -this.centralized.differenceNoseYThreshold) {

            this.changeColorMask(this.COLOR_SILHOUETTE.PRIMARY);
            this.acessoWebFramePopup.showMessage('Não se mexa...');

            this.isCentralized = true;
            return true;
        } else {

            this.changeColorMask(this.COLOR_SILHOUETTE.SECONDARY);

            if (rightX - leftX > this.centralized.silhoutteWidth) {
                this.acessoWebFramePopup.showMessage('Afaste o rosto');
            } else if (rightX - leftX < this.centralized.silhoutteWidth - this.centralized.inSilhouetteThresholdHorizontal) {
                this.acessoWebFramePopup.showMessage('Aproxime o rosto');
            } else if (noseY <= this.centralized.CSPHeightTop) {
                this.acessoWebFramePopup.showMessage('Centralize o rosto');
            } else if (noseY >= this.centralized.CSPHeightBottom) {
                this.acessoWebFramePopup.showMessage('Centralize o rosto');
            } else if (leftX <= this.centralized.CSPWidthLeft - this.centralized.overSilhouetteThresholdHorizontal) {
                this.acessoWebFramePopup.showMessage('Rosto para cima');
            } else if (rightX >= this.centralized.CSPWidthRight + this.centralized.overSilhouetteThresholdHorizontal) {
                this.acessoWebFramePopup.showMessage('Rosto para baixo');
            } else if (this.centralized.differenceLeftY > this.centralized.differenceNoseYThreshold && this.centralized.differenceRightY > this.centralized.differenceNoseYThreshold) {
                this.acessoWebFramePopup.showMessage('Rosto inclinado');
            } else if (this.centralized.differenceLeftY < -this.centralized.differenceNoseYThreshold && this.centralized.differenceRightY < -this.centralized.differenceNoseYThreshold) {
                this.acessoWebFramePopup.showMessage('Rosto inclinado');
            } else if (this.centralized.distanceLeftByNose > this.centralized.distanceRightByNose) {
                this.acessoWebFramePopup.showMessage('Rosto de lado');
            } else if (this.centralized.distanceLeftByNose < this.centralized.distanceRightByNose) {
                this.acessoWebFramePopup.showMessage('Rosto de lado');
            }

            this.isCentralized = false;
            this.isTimerTaking = false;
            clearTimeout(this.timerTake);

            return false;
        }
    };

    addEventPlay = () => {
        this.cameraVideo.addEventListener('play', () => {
            this.cameraOpen = true;
            this.onPlay();
        });
    };

    loadMask = async(color) => {
        let mBoxWidth = this.cameraVideo.offsetWidth;
        let mBoxHeight = this.cameraVideo.offsetHeight;
        let borderColor = color;
        let borderWidth = 5;
        let backgroundOpacity = '0.7';


        let currentAspectRatio = 0;

        if (mBoxWidth > mBoxHeight) {
            this.videoOrientation = this.Orientation.LANDSCAPE;
        }


        if (this.acessoWebFrameSupport._isMobile) {
            this.videoWidth = this.cameraVideo.offsetWidth;
            this.videoHeight = this.cameraVideo.offsetHeight;
        } else {
            currentAspectRatio = this.cameraVideo.offsetWidth / this.cameraVideo.offsetHeight;


            if (this.aspectRatioVideo > currentAspectRatio) {
                this.videoHeight = this.cameraVideo.offsetWidth / this.aspectRatioVideo;
                this.videoWidth = this.cameraVideo.offsetWidth;
            } else {
                this.videoHeight = this.cameraVideo.offsetHeight;
                this.videoWidth = this.cameraVideo.offsetHeight * this.aspectRatioVideo;
            }
        }

        if (this.acessoWebFrameSupport._isMobile) {
            if (this.resolutionHeight > this.resolutionWidth) {
                let vResolutionHeight = this.resolutionHeight;
                let vResolutionWidth = this.resolutionWidth;
                this.resolutionHeight = vResolutionWidth;
                this.resolutionWidth = vResolutionHeight;
            }
        }

        let factorWidth = (this.videoWidth / this.resolutionWidth) * this.SILHOUETTE_CONFIGURATIONS.CLOSE.WIDTH;
        let factorHeight = (this.videoHeight / this.resolutionHeight) * this.SILHOUETTE_CONFIGURATIONS.CLOSE.HEIGHT;

        if (this.acessoWebFrameSupport._isMobile) {

            if (this.videoOrientation === this.Orientation.PORTRAIT) {
                this.mWidth = factorHeight / (this.SILHOUETTE_CONFIGURATIONS.CLOSE.HEIGHT / this.SILHOUETTE_CONFIGURATIONS.CLOSE.WIDTH);

                this.mHeight = factorHeight;
            } else {
                this.mWidth = factorWidth;
                this.mHeight = factorHeight;
            }
        } else {
            this.mWidth = factorWidth;
            this.mHeight = factorHeight;
        }

        let exists = this.boxCamera.querySelector('#svgMask') !== null;
        let mBoxXCenter = mBoxWidth / 2;
        let mBoxYCenter = mBoxHeight / 2;

        let halfMWidth = this.mWidth / 2;
        let halfHeight = this.mHeight / 2;
        let half14Height = this.mHeight / 4;
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


        if (!this.svgMask) {
            this.svgMask = document.createElementNS(xmlns, 'svg');
        }

        this.svgMask.setAttributeNS(
            null,
            'viewBox',
            '0 0 ' + mBoxWidth + ' ' + mBoxHeight
        );
        this.svgMask.setAttributeNS(null, 'width', mBoxWidth);
        this.svgMask.style.display = 'block';
        this.svgMask.setAttributeNS(null, 'id', `svgMask`);


        if (!this.defs) {
            this.defs = document.createElementNS(xmlns, 'defs');
        }

        if (!this.style) {
            this.style = document.createElementNS(xmlns, 'style');
        }
        this.style.textContent = `.cls-background{opacity:${backgroundOpacity};}.cls-focus{fill:none;stroke:${borderColor};stroke-miterlimit:10;stroke-width:${borderWidth}px;}`;

        if (!this.groupMain) {
            this.groupMain = document.createElementNS(xmlns, 'g');
        }


        this.groupMain.setAttributeNS(null, 'id', `main`);
        this.groupMain.setAttributeNS(null, 'data-name', `main`);


        if (!this.groupMask) {
            this.groupMask = document.createElementNS(xmlns, 'g');
        }

        this.groupMask.setAttributeNS(null, 'id', `mask`);


        if (!this.pathBackground) {
            this.pathBackground = document.createElementNS(xmlns, 'path');
        }

        this.pathBackground.setAttributeNS(null, 'id', `background`);
        this.pathBackground.setAttributeNS(null, 'class', `cls-background`);
        this.pathBackground.setAttributeNS(null, 'd', d);

        if (!this.pathFocus) {
            this.pathFocus = document.createElementNS(xmlns, 'rect');
        }


        this.pathFocus.setAttributeNS(null, 'id', `focus-silhouette`);
        this.pathFocus.setAttributeNS(null, 'class', `cls-focus`);
        this.pathFocus.setAttributeNS(null, 'x', point4X);
        this.pathFocus.setAttributeNS(null, 'y', point6Y);
        this.pathFocus.setAttributeNS(null, 'width', this.mWidth);
        this.pathFocus.setAttributeNS(null, 'height', this.mHeight);
        this.pathFocus.setAttributeNS(null, 'rx', arcXY);
        this.pathFocus.setAttributeNS(null, 'style', `stroke: ${borderColor};`);

        if (!exists) {
            this.groupMask.appendChild(this.pathBackground);
            this.groupMask.appendChild(this.pathFocus);
            this.groupMain.appendChild(this.groupMask);
            this.defs.appendChild(this.style);
            this.svgMask.appendChild(this.defs);
            this.svgMask.appendChild(this.groupMain);
            this.boxCamera.appendChild(this.svgMask);
        }
    };

    setTypeSilhouette = () => {
        if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_NORMAL || this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
            this.loadMask(this.COLOR_SILHOUETTE.SECONDARY);
        } else if (
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK) {
            this.loadMaskDocument(this.COLOR_SILHOUETTE.SECONDARY);
        }
    };

    loadMaskDocument = async(color) => {
        // parameters -----------------------------------
        let mBoxWidth = this.cameraVideo.offsetWidth;
        let mBoxHeight = this.cameraVideo.offsetHeight;
        let borderColor = color;
        let borderWidth = 3;
        let backgroundOpacity = '0.7';
        // parameters -----------------------------------

        let currentAspectRatio = 0;

        if (mBoxWidth > mBoxHeight) {
            this.videoOrientation = this.Orientation.LANDSCAPE;
        }

        // video proportion
        if (this.acessoWebFrameSupport._isMobile) {
            this.videoWidth = this.cameraVideo.offsetWidth;
            this.videoHeight = this.cameraVideo.offsetHeight;
        } else {
            currentAspectRatio = this.cameraVideo.offsetWidth / this.cameraVideo.offsetHeight;

            // faixa preta emcima e embaixo
            if (this.aspectRatioVideo > currentAspectRatio) {
                this.videoHeight = this.cameraVideo.offsetWidth / this.aspectRatioVideo;
                this.videoWidth = this.cameraVideo.offsetWidth;
            }
            // faixa preta nas laterais
            else {
                this.videoHeight = this.cameraVideo.offsetHeight;
                this.videoWidth = this.cameraVideo.offsetHeight * this.aspectRatioVideo;
            }
        }

        if (this.acessoWebFrameSupport._isMobile && this.acessoWebFrameSupport.isIOS()) {
            if (this.resolutionHeight > this.resolutionWidth) {
                let vResolutionHeight = this.resolutionHeight;
                let vResolutionWidth = this.resolutionWidth;
                this.resolutionHeight = vResolutionWidth;
                this.resolutionWidth = vResolutionHeight;
            }
        }

        // ajusta o tamanho da máscara com base no video
        // 300px referente a largura, usamos esse valor pois bate com a distância ocular ideal para biometria
        // 480px referente a altura padrão de um rosto
        let factorWidth;
        let factorHeight;

        if (this.acessoWebFrameSupport._isMobile) {
            factorWidth = this.videoWidth * 0.95;
            factorHeight = this.videoHeight * 0.75;
        } else {
            factorWidth = (this.videoWidth / this.resolutionWidth) * ((this.videoWidth * 0.70) > 400 ? 400 : this.videoWidth * 0.70);
            factorHeight = this.videoHeight * 0.70;
        }

        if (this.acessoWebFrameSupport._isMobile) {

            if (this.videoOrientation === this.Orientation.PORTRAIT) {
                this.mWidth = factorHeight / ((this.videoHeight * 0.75) / (this.videoWidth * 0.95));

                this.mHeight = factorHeight;
            } else {
                this.mWidth = factorWidth;
                this.mHeight = factorHeight;
            }
        } else {
            this.mWidth = factorWidth;
            this.mHeight = factorHeight;
        }

        if (this.acessoWebFrameSupport._isMobile) {
            // no modo portrait levamos em conta a altura e calculamos a largura da máscara
            // quando estamos simulando um dispositivo móvel no navegador a abertura da câmera sempre é landscape
            // porém os lados são cortados no vídeo para dar a impressão de portrait
            // por isso usamos a alttura como referência, por ser o valor real do video (sem cortes)

            this.mWidth = factorWidth;
            this.mHeight = factorHeight;
        } else {
            this.mWidth = factorWidth;
            this.mHeight = factorHeight;
        }

        let exists = this.boxCamera.querySelector('#svgMask') !== null;
        let mBoxXCenter = mBoxWidth / 2;
        let mBoxYCenter = mBoxHeight / 2 - Math.round(9 / 100 * mBoxHeight);

        let halfMWidth = this.mWidth / 2;
        let halfHeight = this.mHeight / 2;
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

        if (this.acessoWebFrameSupport._isMobile) {
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

        this.bottomSilhouetteDocument = point6Y + this.mHeight;

        // svg
        if (!this.svgMask) {
            this.svgMask = document.createElementNS(xmlns, 'svg');
        }

        // svg attributes
        this.svgMask.setAttributeNS(
            null,
            'viewBox',
            '0 0 ' + mBoxWidth + ' ' + mBoxHeight
        );
        this.svgMask.setAttributeNS(null, 'width', mBoxWidth);
        this.svgMask.setAttributeNS(null, 'height', mBoxHeight);
        this.svgMask.style.display = 'block';
        this.svgMask.setAttributeNS(null, 'id', `svgMask`);

        // definitions
        if (!this.defs) {
            this.defs = document.createElementNS(xmlns, 'defs');
        }

        // style
        if (!this.style) {
            this.style = document.createElementNS(xmlns, 'style');
        }
        this.style.textContent = `.cls-background{opacity:${backgroundOpacity};}.cls-focus{fill:none;stroke:${borderColor};stroke-miterlimit:10;stroke-width:${borderWidth}px;}`;

        if (!this.groupMain) {
            this.groupMain = document.createElementNS(xmlns, 'g');
        }

        // main group
        this.groupMain.setAttributeNS(null, 'id', `main`);
        this.groupMain.setAttributeNS(null, 'data-name', `main`);

        // maks group
        if (!this.groupMask) {
            this.groupMask = document.createElementNS(xmlns, 'g');
        }

        this.groupMask.setAttributeNS(null, 'id', `mask`);

        // background
        if (!this.pathBackground) {
            this.pathBackground = document.createElementNS(xmlns, 'path');
        }

        this.pathBackground.setAttributeNS(null, 'id', `background`);
        this.pathBackground.setAttributeNS(null, 'class', `cls-background`);
        this.pathBackground.setAttributeNS(null, 'd', d);

        if (!this.pathFocus) {
            this.pathFocus = document.createElementNS(xmlns, 'rect');
        }

        // focus
        this.pathFocus.setAttributeNS(null, 'id', `focus-silhouette`);
        this.pathFocus.setAttributeNS(null, 'class', `cls-focus`);
        this.pathFocus.setAttributeNS(null, 'x', point4X);
        this.pathFocus.setAttributeNS(null, 'y', point6Y);
        this.pathFocus.setAttributeNS(null, 'width', this.mWidth);
        this.pathFocus.setAttributeNS(null, 'height', this.mHeight);
        this.pathFocus.setAttributeNS(null, 'rx', arcXY);

        if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH) {
            if (!this.pathLine) {
                this.pathLine = document.createElementNS(xmlns, 'path');
            }
            this.pathLine.setAttributeNS(null, 'id', `line`);
            this.pathLine.setAttributeNS(null, 'd', `M ${point4X} ${this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter} l ${point1X - point4X} 0`);
            this.pathLine.setAttributeNS(null, 'fill', 'none');
            this.pathLine.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.pathLine.setAttributeNS(null, 'stroke-width', '3');

            if (!this.react1) {
                this.react1 = document.createElementNS(xmlns, 'rect');
            }
            this.react1.setAttributeNS(null, 'id', `rect-top-cnh`);
            this.react1.setAttributeNS(null, 'class', `cls-focus`);
            this.react1.setAttributeNS(null, 'x', point4X + this.mWidth * 0.19);
            this.react1.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (halfHeight * 0.13 + halfHeight * 0.57));
            this.react1.setAttributeNS(null, 'width', this.mWidth * 0.30);
            this.react1.setAttributeNS(null, 'height', halfHeight * 0.57);
            this.react1.setAttributeNS(null, 'stroke-width', 3);
            this.react1.setAttributeNS(null, 'fill', 'none');
            this.react1.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.react2) {
                this.react2 = document.createElementNS(xmlns, 'rect');
            }
            this.react2.setAttributeNS(null, 'id', `rect-bottom-cnh`);
            this.react2.setAttributeNS(null, 'class', `cls-focus`);
            this.react2.setAttributeNS(null, 'x', point4X + (this.mWidth * 0.16));
            this.react2.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) + (halfHeight * 0.05));
            this.react2.setAttributeNS(null, 'width', this.mWidth * 0.77);
            this.react2.setAttributeNS(null, 'height', halfHeight * 0.4);
            this.react2.setAttributeNS(null, 'stroke-width', 3);
            this.react2.setAttributeNS(null, 'fill', 'none');
            this.react2.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }

            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text`);
            this.svgText.setAttributeNS(null, 'x', point4X + this.mWidth * 0.19);
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (halfHeight * 0.13 + halfHeight * 0.57) - 10);
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("FOTO");
            this.svgText.appendChild(textNode);
        } else if (
            (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG && this.FLOW === this.FLOW_TYPE.FRONT) ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT
        ) {
            if (!this.react1) {
                this.react1 = document.createElementNS(xmlns, 'rect');
            }
            this.react1.setAttributeNS(null, 'id', `rect1`);
            this.react1.setAttributeNS(null, 'class', `cls-focus`);
            this.react1.setAttributeNS(null, 'x', point4X + ((this.mWidth - this.mWidth * 0.45) / 2));
            this.react1.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.40));
            this.react1.setAttributeNS(null, 'width', this.mWidth * 0.45);
            this.react1.setAttributeNS(null, 'height', this.mHeight * 0.40);
            this.react1.setAttributeNS(null, 'stroke-width', 3);
            this.react1.setAttributeNS(null, 'fill', 'none');
            this.react1.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.react2) {
                this.react2 = document.createElementNS(xmlns, 'rect');
            }
            this.react2.setAttributeNS(null, 'id', `rect2`);
            this.react2.setAttributeNS(null, 'class', `cls-focus`);
            this.react2.setAttributeNS(null, 'x', point4X + ((this.mWidth - this.mWidth * 0.45) / 2));
            this.react2.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) + (this.mHeight * 0.05));
            this.react2.setAttributeNS(null, 'width', this.mWidth * 0.45);
            this.react2.setAttributeNS(null, 'height', this.mHeight * 0.38);
            this.react2.setAttributeNS(null, 'stroke-width', 3);
            this.react2.setAttributeNS(null, 'fill', 'none');
            this.react2.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }
            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text`);
            this.svgText.setAttributeNS(null, 'x', mBoxXCenter - 25);
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.42));
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("FOTO");
            this.svgText.appendChild(textNode);
        } else if (
            (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG && this.FLOW === this.FLOW_TYPE.BACK) ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK
        ) {
            if (!this.react1) {
                this.react1 = document.createElementNS(xmlns, 'rect');
            }
            this.react1.setAttributeNS(null, 'id', `rect1`);
            this.react1.setAttributeNS(null, 'class', `cls-focus`);
            this.react1.setAttributeNS(null, 'x', point4X + (this.mWidth - this.mWidth * 0.15));
            this.react1.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.28));
            this.react1.setAttributeNS(null, 'width', this.mWidth * 0.0735);
            this.react1.setAttributeNS(null, 'height', this.mHeight * 0.198);
            this.react1.setAttributeNS(null, 'stroke-width', 3);
            this.react1.setAttributeNS(null, 'fill', 'none');
            this.react1.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.react2) {
                this.react2 = document.createElementNS(xmlns, 'rect');
            }
            this.react2.setAttributeNS(null, 'id', `rect2`);
            this.react2.setAttributeNS(null, 'class', `cls-focus`);
            this.react2.setAttributeNS(null, 'x', point4X + (this.mWidth - this.mWidth * 0.30));
            this.react2.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.28));
            this.react2.setAttributeNS(null, 'width', this.mWidth * 0.0735);
            this.react2.setAttributeNS(null, 'height', this.mHeight * 0.49);
            this.react2.setAttributeNS(null, 'stroke-width', 3);
            this.react2.setAttributeNS(null, 'fill', 'none');
            this.react2.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }
            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text`);
            this.svgText.setAttributeNS(null, 'x', point4X + (this.mWidth - (this.mWidth * 0.30 - (this.mWidth * 0.0735) / 2)));
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.45));
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'style', 'writing-mode: tb;');

            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("NOME");
            this.svgText.appendChild(textNode);
        } else if (
            (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG && this.FLOW === this.FLOW_TYPE.FRONT) ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT
        ) {
            if (!this.react1) {
                this.react1 = document.createElementNS(xmlns, 'rect');
            }
            this.react1.setAttributeNS(null, 'id', `rect1`);
            this.react1.setAttributeNS(null, 'class', `cls-focus`);
            this.react1.setAttributeNS(null, 'x', point4X + (this.mWidth - (this.mWidth * 0.58) - (this.mWidth * 0.09)));
            this.react1.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.40));
            this.react1.setAttributeNS(null, 'width', this.mWidth * 0.58);
            this.react1.setAttributeNS(null, 'height', this.mHeight * 0.30);
            this.react1.setAttributeNS(null, 'stroke-width', 3);
            this.react1.setAttributeNS(null, 'fill', 'none');
            this.react1.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }
            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text`);
            this.svgText.setAttributeNS(null, 'x', point4X + (this.mWidth - (this.mWidth * 0.58) - (this.mWidth * 0.09)));
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.42));
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("FOTO");
            this.svgText.appendChild(textNode);
        } else if (
            (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG && this.FLOW === this.FLOW_TYPE.BACK) ||
            this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK
        ) {
            if (!this.react1) {
                this.react1 = document.createElementNS(xmlns, 'rect');
            }
            this.react1.setAttributeNS(null, 'id', `rect1`);
            this.react1.setAttributeNS(null, 'class', `cls-focus`);
            this.react1.setAttributeNS(null, 'x', point4X + this.mWidth * 0.09);
            this.react1.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) + ((this.mHeight * 0.25) / 2));
            this.react1.setAttributeNS(null, 'width', this.mWidth * 0.62);
            this.react1.setAttributeNS(null, 'height', this.mHeight * 0.30);
            this.react1.setAttributeNS(null, 'stroke-width', 3);
            this.react1.setAttributeNS(null, 'fill', 'none');
            this.react1.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);

            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }
            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text`);
            this.svgText.setAttributeNS(null, 'x', point4X + this.mWidth * 0.09);
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) + ((this.mHeight * 0.25) / 2) - 10);
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("DIGITAL");
            this.svgText.appendChild(textNode);
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF) {
            if (!this.svgText) {
                this.svgText = document.createElementNS(xmlns, 'text');
            }
            this.svgText.setAttributeNS(null, 'id', `text1`);
            this.svgText.setAttributeNS(null, 'class', `cls-text-medium`);
            this.svgText.setAttributeNS(null, 'x', point4X + (this.mWidth * 0.40));
            this.svgText.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.45));
            this.svgText.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText.setAttributeNS(null, 'style', 'writing-mode: tb;');
            this.svgText.innerHTML = '';
            let textNode = document.createTextNode("000.000.000-00");
            this.svgText.appendChild(textNode);

            if (!this.svgText2) {
                this.svgText2 = document.createElementNS(xmlns, 'text');
            }
            this.svgText2.setAttributeNS(null, 'id', `text2`);
            this.svgText2.setAttributeNS(null, 'class', `cls-text-big`);
            this.svgText2.setAttributeNS(null, 'x', point4X + (this.mWidth - (this.mWidth * 0.30 - (this.mWidth * 0.09) / 2)));
            this.svgText2.setAttributeNS(null, 'y', (this.acessoWebFrameSupport._isMobile ? mBoxYCenter - point6Y : mBoxYCenter) - (this.mHeight * 0.30));
            this.svgText2.setAttributeNS(null, 'stroke', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText2.setAttributeNS(null, 'fill', this.COLOR_SILHOUETTE.SECONDARY);
            this.svgText2.setAttributeNS(null, 'style', 'writing-mode: tb;');

            this.svgText2.innerHTML = '';
            let textNode2 = document.createTextNode("CPF");
            this.svgText2.appendChild(textNode2);
        }

        // structure
        if (!exists) {
            this.groupMask.appendChild(this.pathBackground);
            this.groupMask.appendChild(this.pathFocus);

            if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH) {
                this.groupMask.appendChild(this.pathLine);
            }

            if (
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK
            ) {
                this.groupMask.appendChild(this.react1);
            }

            if (
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK) {
                this.groupMask.appendChild(this.react2);
            }

            if (
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK ||
                this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF) {
                this.groupMask.appendChild(this.svgText);
            }

            if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF) {
                this.groupMask.appendChild(this.svgText2);
            }

            this.groupMain.appendChild(this.groupMask);
            this.defs.appendChild(this.style);
            this.svgMask.appendChild(this.defs);
            this.svgMask.appendChild(this.groupMain);
            this.boxCamera.appendChild(this.svgMask);
        }
    };

    setTopLabelMessage = () => {
        this.acessoWebFramePopup.Message.style.top = `${this.cameraVideo.offsetHeight / 2 - this.mHeight / 2 - 25}px`;
    };

    browserNotSupportCallback = () => {
        return this.onBrowserNotSupportJS(this.acessoWebFrameSupport.browserNotSupport());
    };

    resetProcessVariables = () => {
        this.TYPE_PROCESS = null;
        this.TYPE_PROCESS_INITIAL = null;
        this.TYPE_PROCESS_DOCUMENT = null;
        this.TYPE_PROCESS_DOCUMENT_INITIAL = null;
    };

    resetVariables = () => {

        this.constraints = {};
        this.constraintsBase = {
            video: {
                facingMode: 'user',
            },
            audio: false
        };
        this.aspectRatioVideo = 1280 / 720;
        this.resolutionWidth = 1280;
        this.resolutionHeight = 720;
        this.isResolutionRead = false;
        this.forwardTimes = [];
        this.avgTimeInMs = null;
        this.isCaptureReady = false;

        this.isFaceApiIsRunning = false;
        this.counterIsRunning = 0;

        this.FLOW = null;

        this.base64Front = null;

        this.isCentralized = false;
        this.isTimerTaking = false;
        this.timerTake = null;

        this.totalSeconds = 0;
        this.isTimerSessionContinueRunning = false;
        this.timerSession = null;

        this.videoOrientation;
        this.track = null;
        this.cameraOpen = null;
        this.svgMask = null;
        this.defs = null;
        this.style = null;
        this.groupMain = null;
        this.groupMask = null;
        this.pathBackground = null;
        this.pathLine = null;
        this.pathFocus = null;
        this.bottomSilhouetteDocument = null;
        this.react1 = null;
        this.react2 = null;
        this.react3 = null;
        this.svgText = null;
        this.svgText2 = null;
        this.stream = null;
        this.aspectRatioVideo = 1280 / 720;
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.mWidth = 0;
        this.mHeight = 0;
        this.resolutionWidth = 1280;
        this.resolutionHeight = 720;
        this.isResolutionRead = false;
        this.subPath = window.location.pathname + '/';
        this.forwardTimes = [];
        this.avgTimeInMs = null;

        this.FocusSilhouette = null;

        this.isCaptureReady = false;
        this.videoSourceInfoId = null;

        this.isFaceApiIsRunning = false;
        this.counterIsRunning = 0;

        if (this.boxCamera.querySelector('#svgMask')) {
            this.boxCamera.querySelector('#svgMask').remove();
        }

        if (this.boxCamera.querySelector('#box--document-info')) {
            this.boxCamera.querySelector('#box--document-info').remove();
        }
    };

    createElements = () => {

        if (this.boxCamera.querySelector('#camera--video')) {
            this.boxCamera.querySelector('#camera--video').remove();
        }
        if (this.boxCamera.querySelector('#camera--canvas')) {
            this.boxCamera.querySelector('#camera--canvas').remove();
        }
        if (this.boxCamera.querySelector('#camera--overlay')) {
            this.boxCamera.querySelector('#camera--overlay').remove();
        }

        let camera_canvas = document.createElement('canvas');
        camera_canvas.id = 'camera--canvas';
        let camera_overlay = document.createElement('canvas');
        camera_overlay.id = 'camera--overlay';
        let camera_video = document.createElement('video');
        camera_video.id = 'camera--video';
        camera_video.autoplay = true;
        camera_video.setAttribute('playsinline', '');
        camera_video.setAttribute('webkit-playsinline', '');

        this.boxCamera.appendChild(camera_canvas);
        this.boxCamera.appendChild(camera_video);
        this.boxCamera.appendChild(camera_overlay);
    };

    createBoxDocumentInfo = () => {
        let boxDocumentInfo = this.boxCamera.querySelector('#box--document-info');
        if (!boxDocumentInfo) {
            let boxInfo = document.createElement('div');
            boxInfo.id = 'box--document-info';
            boxInfo.style.width = '100%';
            let _height = (this.cameraVideo.offsetHeight - parseFloat(this.buttonCapture.style.top.replace('px', ''))) - this.buttonCapture.offsetHeight / 2;
            boxInfo.style.height = _height + 'px';
            boxInfo.innerHTML = `<span id="label--document" style="top: ${_height / 2}px;">${this.getLabelDocument()}</span>`;
            this.boxCamera.appendChild(boxInfo);
        } else {
            let _height = (this.cameraVideo.offsetHeight - parseFloat(this.buttonCapture.style.top.replace('px', ''))) - this.buttonCapture.offsetHeight / 2;
            boxDocumentInfo.style.height = _height + 'px';
            boxDocumentInfo.innerHTML = `<span id="label--document">${this.getLabelDocument()}</span>`;
            this.boxCamera.querySelector('#label--document').style.top = (_height / 2) + 'px';
        }
    };

    hideBoxDocumentInfo = () => {
        let _box = this.boxCamera.querySelector('#box--document-info');
        if (_box) {
            _box.style.display = 'none';
        }
    };

    setLabelDocumentInfo = () => {
        this.boxCamera.querySelector('#label--document').innerHTML = this.getLabelDocument();
    };

    setControls = () => {
        this.boxCamera = document.querySelector('#box-camera');

        this.createElements();

        this.cameraVideo = this.boxCamera.querySelector('#camera--video');
        this.cameraCanvas = this.boxCamera.querySelector('#camera--canvas');
        this.cameraOverlay = this.boxCamera.querySelector('#camera--overlay');
        this.buttonCapture = this.boxCamera.querySelector('#camera--trigger');

        this.acessoWebFramePopup.boxLoading = this.boxCamera.querySelector('#box--loading');
        this.acessoWebFramePopup.Message = this.boxCamera.querySelector("#message");
        this.acessoWebFramePopup.boxOrientation = this.boxCamera.querySelector("#box--orientation");
    };

    callAllMethodsInit = () => {
        this.addEventsGlobal();
        this.addClickEvent();
        this.setOrientation();
        this.addEventPlay();
        this.addEventResize();
        this.startCamera();
        this.setConfiguration();
    };

    setConfiguration = () => {
        if (this.TYPE_PROCESS === this.TYPE_CAMERA.CAMERA_INTELIGENCE) {
            this.setTopLabelMessage();
        }
    };

    getLabelDocument = () => {
        if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CNH) {
            return 'CNH Aberta';
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.CPF) {
            return 'CPF';
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG || this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG) {
            return this.FLOW === this.FLOW_TYPE.FRONT ? 'RG Frente' : 'RG Verso';
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_FRONT || this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_FRONT) {
            return 'RG Frente';
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.RG_BACK || this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.NEW_RG_BACK) {
            return 'RG Verso';
        } else if (this.TYPE_PROCESS_DOCUMENT === this.TYPE_DOCUMENT.OTHERS) {
            return this.LABEL_DOCUMENT_OTHERS;
        }
    };

    setOrientation = () => {
        let orientation =
            (screen.orientation || {}).type ||
            screen.mozOrientation ||
            screen.msOrientation;

        if (orientation) {
            if (
                orientation == 'landscape-primary' ||
                orientation == 'landscape-secondary'
            ) {
                this.videoOrientation = this.Orientation.LANDSCAPE;
            } else {
                this.videoOrientation = this.Orientation.PORTRAIT;
            }
        } else {

            if (this.boxCamera.offsetWidth > this.boxCamera.offsetHeight) {
                this.videoOrientation = this.Orientation.LANDSCAPE;
            } else {
                this.videoOrientation = this.Orientation.PORTRAIT;
            }
        }

        if (this.acessoWebFrameSupport._isMobile) {
            if (this.videoOrientation === this.Orientation.LANDSCAPE) {
                this.acessoWebFramePopup.showBoxLockOrientation();
            } else {
                this.acessoWebFramePopup.hideBoxLockOrientation();
            }
        }
    };

    getConstraints = () => {
        return this.constraints;
    };

    visibilityChange = () => {
        if (document.hidden) {
            this.isTimerSessionContinueRunning = false;
            this.cameraVideo.pause();
        } else {
            if (!this.isCaptureReady) {
                this.cameraVideo.play();
                this.isTimerSessionContinueRunning = true;
                this.startTimerSession();
            }
        }
    };

    addEventsGlobal = () => {
        navigator.mediaDevices.enumerateDevices().catch(this.handleError);
        window.addEventListener('orientationchange', this.orientationChange);
        navigator.mediaDevices.ondevicechange = this.orientationChange;
        document.addEventListener('visibilitychange', this.visibilityChange, false);
    }

    initCameraNormal = (COLOR_SILHOUETTE_PRIMARY, FACE_MODE) => {
        if (!this.acessoWebFrameSupport.isSupportBrowser) {
            this.browserNotSupportCallback();
            return;
        }

        this.resetProcessVariables();

        this.TYPE_PROCESS = this.TYPE_CAMERA.CAMERA_NORMAL;
        this.TYPE_PROCESS_INITIAL = this.TYPE_CAMERA.CAMERA_NORMAL;

        if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
            this.COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_PRIMARY;
        }

        let _FACE_MODE = parseInt(FACE_MODE);
        if (_FACE_MODE === this.FACE_MODE_TYPE.FRONT || _FACE_MODE === this.FACE_MODE_TYPE.BACK) {
            this.FACE_MODE = _FACE_MODE;
        } else {
            this.FACE_MODE = this.FACE_MODE_TYPE.FRONT;
        }

        this.setControls();

        this.isLoading = true;
        this.acessoWebFramePopup.showBoxLoading();

        this.resetVariables();

        this.callAllMethodsInit();
    };

    initCameraInteligence = (COLOR_SILHOUETTE_PRIMARY, COLOR_SILHOUETTE_SECONDARY, COLOR_SILHOUETTE_NEUTRAL) => {
        if (!this.acessoWebFrameSupport.isSupportBrowser) {
            this.browserNotSupportCallback();
            return;
        }

        this.resetProcessVariables();

        this.TYPE_PROCESS = this.TYPE_CAMERA.CAMERA_INTELIGENCE;
        this.TYPE_PROCESS_INITIAL = this.TYPE_CAMERA.CAMERA_INTELIGENCE;

        if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
            this.COLOR_SILHOUETTE.PRIMARY = COLOR_SILHOUETTE_PRIMARY;
        }
        if (COLOR_SILHOUETTE_SECONDARY !== "" && COLOR_SILHOUETTE_SECONDARY !== undefined && COLOR_SILHOUETTE_SECONDARY !== null) {
            this.COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_SECONDARY;
        }
        if (COLOR_SILHOUETTE_NEUTRAL !== "" && COLOR_SILHOUETTE_NEUTRAL !== undefined && COLOR_SILHOUETTE_NEUTRAL !== null) {
            this.COLOR_SILHOUETTE.NEUTRAL = COLOR_SILHOUETTE_NEUTRAL;
        }

        this.setControls();

        this.isLoading = true;
        this.acessoWebFramePopup.showBoxLoading();

        this.resetVariables();

        this.acessoWebFrameModel.loadModelsCameraInteligence()
            .then(() => {
                this.callAllMethodsInit();
            })
            .catch((e) => {
                this.onFailedCaptureJS(e);
            });
    };

    initDocument = (TYPE, COLOR_SILHOUETTE_PRIMARY, LABEL_DOCUMENT_OTHERS) => {
        if (!this.acessoWebFrameSupport.isSupportBrowser) {
            this.browserNotSupportCallback();
            return;
        }

        this.resetProcessVariables();

        this.setControls();

        this.isLoading = true;
        this.acessoWebFramePopup.showBoxLoading();

        this.resetVariables();

        let _TYPE = parseInt(TYPE);
        if (
            _TYPE === this.TYPE_DOCUMENT.CNH ||
            _TYPE === this.TYPE_DOCUMENT.CPF ||
            _TYPE === this.TYPE_DOCUMENT.RG ||
            _TYPE === this.TYPE_DOCUMENT.NEW_RG ||
            _TYPE === this.TYPE_DOCUMENT.RG_FRONT ||
            _TYPE === this.TYPE_DOCUMENT.RG_BACK ||
            _TYPE === this.TYPE_DOCUMENT.NEW_RG_FRONT ||
            _TYPE === this.TYPE_DOCUMENT.NEW_RG_BACK ||
            _TYPE === this.TYPE_DOCUMENT.OTHERS
        ) {
            this.TYPE_PROCESS_DOCUMENT = _TYPE;
            this.TYPE_PROCESS_DOCUMENT_INITIAL = _TYPE;
            this.FLOW = this.FLOW_TYPE.FRONT;

            if (COLOR_SILHOUETTE_PRIMARY !== "" && COLOR_SILHOUETTE_PRIMARY !== undefined && COLOR_SILHOUETTE_PRIMARY !== null) {
                this.COLOR_SILHOUETTE.SECONDARY = COLOR_SILHOUETTE_PRIMARY;
            }

            if (_TYPE === this.TYPE_DOCUMENT.OTHERS) {
                if (LABEL_DOCUMENT_OTHERS !== "" && LABEL_DOCUMENT_OTHERS !== undefined && LABEL_DOCUMENT_OTHERS !== null) {
                    this.LABEL_DOCUMENT_OTHERS = LABEL_DOCUMENT_OTHERS;
                } else {
                    this.LABEL_DOCUMENT_OTHERS = 'Outros';
                }
            }

            this.callAllMethodsInit();
        } else {
            this.onFailedCaptureJS('Tipo de documento inválido!');
        }
    };
}