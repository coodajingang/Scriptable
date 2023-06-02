
var DARK_MODE_BGCOLOR     = '#262335'
var LIGHT_MODE_BGCOLOR    = '#4f6a8f'
var PREFER_TRANSPARENT_BG = false
var nobg = !PREFER_TRANSPARENT_BG ? null 
    : await importModuleOptional('no-background')

async function createWidget(widgetFamily='large') {  
  
  const widget = new ListWidget()
  widget.setPadding(0,0,0,0)

  widget.backgroundColor = Color.dynamic(
    new Color(LIGHT_MODE_BGCOLOR), 
    new Color(DARK_MODE_BGCOLOR))

  const foreColor = Color.white()

  // setup main container
  const mainStack = widget.addStack()
  mainStack.setPadding(0,0,0,0)
  mainStack.centerAlignContent()
  mainStack.layoutHorizontally()

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

  return widget
}

function addDZ(mainStack, first, second) {
    const subStack = mainStack.addStack()
    const ft = subStack.addText(first)
    ft.centerAlignText()
    const st = subStack.addText(second)
    st.centerAlignText()
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
// ----------------