
var DARK_MODE_BGCOLOR     = '#262335'
var LIGHT_MODE_BGCOLOR    = '#4f6a8f'
var PREFER_TRANSPARENT_BG = false
var nobg = !PREFER_TRANSPARENT_BG ? null 
    : await importModuleOptional('no-background')

const bz = await importModuleOptional('bundleprod')
log('Import bazi bundleprod.js')

const yearGZ = '丙寅'
const monthGZ = '戊戌'
const dayGZ = '丙戌'
const hourGZ = '辛卯'
const yunGZ = '辛丑'


async function createWidget(widgetFamily='large') {  
  
  const widget = new ListWidget()
  widget.setPadding(10,10,10,10)
  widget.spacing(10)

  widget.backgroundColor = Color.dynamic(
    new Color(LIGHT_MODE_BGCOLOR), 
    new Color(DARK_MODE_BGCOLOR))

  const foreColor = Color.white()

  const now = new Date();
  const bazi = bz.calendarDayInfo(now.getFullYear(), now.getMonth()+1, now.getDate(), 3);
  const hour = now.getHours();
  const hGZ = bazi.bazi.hs[Math.floor((hour+1)/2)]

  const headStack = widget.addStack()
  headStack.centerAlignContent()
  headStack.layoutHorizontally()
  headStack.setPadding(0,0,0,0)
  headStack.addDate(now)
  headStack.addSpacer()
  headStack.addText(bazi.nontli)
  const mainStack = widget.addStack()
  const tailStack = widget.addStack()
  tailStack.setPadding(0,0,0,0)
  tailStack.centerAlignContent()
  tailStack.layoutHorizontally()
  tailStack.addText(genJieQi(bazi, 0))
  tailStack.addSpacer()
  tailStack.addText(genJieQi(bazi, 0))

  mainStack.setPadding(0,0,0,0)
  mainStack.centerAlignContent()
  mainStack.layoutHorizontally()

  mainStack.addSpacer()
  addDZ(mainStack, yearGZ[0], yearGZ[1])
  mainStack.addSpacer()
  addDZ(mainStack, monthGZ[0], monthGZ[1])
  mainStack.addSpacer()
  addDZ(mainStack, dayGZ[0], dayGZ[1])
  mainStack.addSpacer()
  addDZ(mainStack, hourGZ[0], hourGZ[1])
  mainStack.addSpacer()
  addDZ(mainStack, yunGZ[0], yunGZ[1])
  mainStack.addSpacer()
  addDZ(mainStack, bazi.bazi.year[0], bazi.bazi.year[1])
  mainStack.addSpacer()
  addDZ(mainStack, bazi.bazi.month[0], bazi.bazi.month[1])
  mainStack.addSpacer()
  addDZ(mainStack, bazi.bazi.day[0], bazi.bazi.day[1])
  mainStack.addSpacer()
  addDZ(mainStack, hGZ[0], hGZ[1])
  mainStack.addSpacer()
  return widget
}

function addDZ(mainStack, first, second) {
    const subStack = mainStack.addStack()
    subStack.borderWidth = 2
    subStack.layoutVertically()
    const ft = subStack.addText(first)
    ft.centerAlignText()
    ft.font = Font.title1()
    subStack.addSpacer(1.5)
    const st = subStack.addText(second)
    st.centerAlignText()
    st.font = Font.title1()
}


//---[ main ]-------------------------------------
if (config.runsInWidget) {
    let widget = await createWidget(config.widgetFamily)
    Script.setWidget(widget)
    Script.complete()
  } else {
    // show options
    const options = ['Preview Widget']
    if (nobg) {
      options.push('Set Background')
    }
    options.push('Cancel')
    let response = await presentAlert(
      'Options', options)
    let sel = options[response]
    switch(sel) {
      case 'Preview Widget':
        await previewWidget()
        break;
      case 'Set Background':
        await nobg.chooseBackgroundSlice(widgetID)
        break;
      default:   
    }
}

function genJieQi(bazi, i) {
    if (!bazi || !bazi.solar || !bazi.solar.length || bazi.solar.length <= i) {
        log('No solar info ' + i)
        return ''
    }
    const d = bazi.solar[i]
    return d.name + ":" + d.day  + '日' + d.time
}
//--公共方法库-------------------
function sfIcon(name, font) {
    const sf = SFSymbol.named(name)
    sf.applyFont(font)
    return sf.image
  }
  function formatNumber(n) {
    return new Intl.NumberFormat().format(n)
  }
async function previewWidget() {
    let widget;
    let resp = await presentAlert('Preview Widget',
      ['Small','Medium','Large','Cancel'])
    switch (resp) {
      case 0:
        widget = await createWidget('small')
        await widget.presentSmall()
        break;
      case 1:
        widget = await createWidget('medium')
        await widget.presentMedium()
        break;
      case 2:
        widget = await createWidget('large')
        await widget.presentLarge()
        break;
      default:
    }
  }
async function presentAlert(prompt,items,asSheet) 
{
  let alert = new Alert()
  alert.message = prompt
  
  for (const item of items) {
    alert.addAction(item)
  }
  let resp = asSheet ? 
    await alert.presentSheet() : 
    await alert.presentAlert()
  return resp
}

async function downloadImage(url) {
  const req = new Request(url) 
  const img = await req.loadImage()
  return img
}

async function importModuleOptional(module_name) {
    const ICLOUD =  module.filename
                      .includes('Documents/iCloud~')
    const fm = FileManager()
    if (!/\.js$/.test(module_name)) {
      module_name = module_name + '.js'
    }
    const module_path = fm.joinPath
                          (fm.documentsDirectory(), 
                          module_name)
    if (!fm.fileExists(module_path)) {
      log(`module ${module_name} does not exist`)
      return null
    }
    if (ICLOUD) {
      await fm.downloadFileFromiCloud(module_path)
    }
    const mod = importModule(module_name)
    return mod
}

// ----------------