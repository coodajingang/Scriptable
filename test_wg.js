
var DARK_MODE_BGCOLOR     = '#262335'
var LIGHT_MODE_BGCOLOR    = '#4f6a8f'
var PREFER_TRANSPARENT_BG = false
var nobg = !PREFER_TRANSPARENT_BG ? null 
    : await importModuleOptional('no-background')

async function createWidget(widgetFamily='large') {  
  
  const widget = new ListWidget()
  widget.setPadding(10,10,10,10)
  widget.spacing(10)

  widget.backgroundColor = Color.dynamic(
    new Color(LIGHT_MODE_BGCOLOR), 
    new Color(DARK_MODE_BGCOLOR))

  const foreColor = Color.white()

  const headStack = widget.addStack()
  headStack.centerAlignContent()
  headStack.layoutHorizontally()
  headStack.setPadding(0,0,0,0)
  headStack.addDate(new Date())
  headStack.addSpacer()
  headStack.addText("nongtli")
  const mainStack = widget.addStack()
  const tailStack = widget.addStack()
  tailStack.setPadding(0,0,0,0)
  tailStack.centerAlignContent()
  tailStack.layoutHorizontally()
  tailStack.addText("节气。。。。")
  tailStack.addSpacer()
  tailStack.addText("nongtli")

  mainStack.setPadding(0,0,0,0)
  mainStack.centerAlignContent()
  mainStack.layoutHorizontally()

  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
  mainStack.addSpacer()
  addDZ(mainStack, '甲', '寅')
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
    const fm = FileManager[ICLOUD 
                            ? 'iCloud' 
                            : 'local']()
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