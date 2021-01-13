window.validateName = (name) => {
    if(name === null || name === undefined) return false

    let zh = /^[\S\s]{1,50}$/

    return name.toString().match(zh)
}

window.validateUserName = (name) => {
    if(name === null || name === undefined) return false

    let user = /^[a-zA-Z0-9_]{1,100}$/

    return name.toString().match(user)
}

window.validateIP = (ip) => {

    if(ip === null || ip === undefined) return false

    let IpV4 = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/

    let IpV6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

    return ip.toString().match(IpV4) || ip.toString().match(IpV6)

}

window.validateMac = (mac) => {
    if(mac === null || mac === undefined) return false

    let max = /^((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))([a-f0-9]{2})$/gi

    return mac.toString().match(max)
}

window.isEmpty = (value) => {
    return value !== '' && value !== undefined && value !== null
}

window.dateToTimestamp = (dateString)=>{
    if(!dateString)
        return 0

    if (dateString.indexOf('-')) {
        let arr = dateString.split('-')
        return new Date(arr[0], Number.parseInt(arr[1])-1, arr[2]).getTime()
    }
    return 0
}

window.replaceRegString = (string)=>{ // 搜索匹配正则
    return string.replace(/[-[\]{}()*+?.,\:\\^$|#\s]/g, '\\$&')
}

window.statisticsSongTime = (second)=>{ //统计歌曲时间
    let h = Math.floor(second / 3600) < 10 ? '0'+Math.floor(second / 3600) : Math.floor(second / 3600)
    let m = Math.floor((second / 60 % 60)) < 10 ? '0' + Math.floor((second / 60 % 60)) : Math.floor((second / 60 % 60))
    let s = Math.floor((second % 60)) < 10 ? '0' + Math.floor((second % 60)) : Math.floor((second % 60))
    if (h > 23)
        return '23:59:59'
    if (m > 59)
        m = 59
    if (s > 59)
        s = 59
    return h + ":" + m + ":" + s
}

window.getQueryString = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2])
    }
    return null
}