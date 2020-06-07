new Vue({
    el: '#app',
    data: {
        cameraList: [],
        myCanvas: null,
        myContext: null
    },
    methods: {
        main () {
            this.myCanvas = document.getElementById('canvas')
            this.myContext = this.myCanvas.getContext('2d')
            this.cameraList.forEach((camera, index) => {
                let domId = `video${index}`
                let video = document.getElementById(domId)
                this.enableCamera(camera.id, video)
            })
        },

        /** @desc 摄像头使能封装 */
        enableCamera (deviceId, video) {
            this.getUserMedia(this.setConstraints(deviceId), (stream) => {
                video.srcObject = stream;
                video.onloadedmetadata = (e) => {
                    video.play()
                }
            }, error => {
                console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
            })
        },

        /** @desc 获取计算机外设列表 储存摄像头数据 */
        getDevices () {
            return new Promise((resolve, reject) => {
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                    console.log("不支持 enumerateDevices() .")
                }
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    this.cameraList = []
                    devices.forEach((device, index) => {
                        if (device.kind && device.kind === 'videoinput') {
                            this.cameraList.push({
                                id: device.deviceId,
                                label: device.label
                            })
                        }
                    })
                    resolve()
                }).catch((err) => {
                    console.log(err.name + ": " + err.message)
                    reject()
                })
            })
        },

        takePhoto (idx) {
            let videoId = `video${idx}`
            let videoDom = document.getElementById(videoId)
            this.myContext.drawImage(videoDom, 0, 0, 480, 320)
        },

        // tools
        /** @desc API getUserMedia  兼容封装 */
        getUserMedia (constraints, success, error) {
            if (navigator.mediaDevices.getUserMedia) {
                //最新的标准API
                navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
            } else if (navigator.webkitGetUserMedia) {
                //webkit核心浏览器
                navigator.webkitGetUserMedia(constraints, success, error)
            } else if (navigator.mozGetUserMedia) {
                //firfox浏览器
                navigator.mozGetUserMedia(constraints, success, error)
            } else if (navigator.getUserMedia) {
                //旧版API
                navigator.getUserMedia(constraints, success, error)
            }
        },
        /** @desc 摄像头配置项通用配置 */
        setConstraints (deviceId) {
            return {
                audio: false,
                video: {
                    width: 480,
                    height: 320,
                    deviceId: deviceId
                }
            }
        }
    },
    mounted () {
        this.getDevices().then(() => {
            this.main()
        })
    }
})
