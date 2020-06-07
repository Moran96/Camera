//访问用户媒体设备的兼容方法
const video0 = document.getElementById('video0');
const video1 = document.getElementById('video1');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let cameraList = []

// API getUserMedia  兼容封装
function getUserMedia (constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}

/** @desc 获取计算机外设列表 储存摄像头数据 */
function getDevices (cb) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("不支持 enumerateDevices() .")
    }
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        cameraList = []
        devices.forEach((device, index) => {
            if (device.kind && device.kind === 'videoinput') {
                cameraList.push({
                    id: device.deviceId,
                    index: index,
                    label: device.label
                })
            }
        })
        console.table(cameraList)
        cb()
    }).catch((err) => {
        console.log(err.name + ": " + err.message);
    })
}

/** @desc 摄像头配置项 */
function setConstraints (deviceId) {
    return {
        audio: false,
        video: {
            width: 480,
            height: 320,
            deviceId: deviceId
        }
    }
}

function enableCamera (deviceId, videoDom) {
    if (!videoDom) {
        return false
    }
    getUserMedia(setConstraints(deviceId), (stream) => {
        console.log(stream);
        // let CompatibleURL = window.URL || window.webkitURL; //兼容webkit核心浏览器
        //将视频流设置为video元素的源 //video.src = CompatibleURL.createObjectURL(stream);
        videoDom.srcObject = stream;
        videoDom.play()
    }, error => {
        console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
    })
}

function setCameraName () {
    cameraList.forEach((cmr, index) => {
        let domId = 'name' + index
        let text = cameraList[index].label
        setTimeout(() => {
            document.getElementById(domId).innerText = text
            console.log(domId)
        }, 1000)
    })
}

function takePhoto(idx) {
    let videoId = `video${idx}`
    let videoDom = document.getElementById(videoId)
    context.drawImage(videoDom, 0, 0, 480, 320)
}

async function main () {
    await getDevices(() => {
        setCameraName(0)
    })
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        //调用用户媒体设备, 访问摄像头
        // 106366f99b13e8f23a0597064461e44e0625f9ec4d0dc63289b4065aa2430e3b LRCP  USB2.0 (0c45:6366)
        // 57f06210f298342c956ceb53b3fe04c0a1dd58ef1f21479662c88ec56da2dfb2 FaceTime HD Camera
        let id1 = '57f06210f298342c956ceb53b3fe04c0a1dd58ef1f21479662c88ec56da2dfb2'
        let id2 = '106366f99b13e8f23a0597064461e44e0625f9ec4d0dc63289b4065aa2430e3b'

        enableCamera(id1, video0)
        enableCamera(id2, video1)

    } else {
        alert('不支持访问用户媒体');
    }
}

main()
