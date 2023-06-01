// download script from github 
// input script name 
// download and  write local 

const download_url = 'https://raw.githubusercontent.com/coodajingang/Scriptable/v2/'
const fm = FileManager.iCloud();

let alert = new Alert();
alert.title = "Please input script name";
alert.message = "输入script名称，带后缀";
alert.addTextField("",'');
alert.addAction("确定");
alert.addCancelAction("退出");
let response = await alert.presentAlert();
let input_name = ''
if (response == 0) {
    input_name = alert.textFieldValue(0)
}

log('Input: ' + input_name)

if (!input_name || input_name == '') {
    log('No input script name!')
    Script.complete()
    return
}

let url = download_url + input_name
log("Download from: " + url)

const req = new Request(url)
code = await req.loadString()

if (!code || code == '' || code.startsWith("404: Not Found")) {
    log('Downlad result empty')
    Script.complete()
    return
}
let filename = input_name
log(`saving ${filename}`)
const path = fm.joinPath(fm.documentsDirectory(), filename)
fm.writeString(path, code)

Script.complete()
