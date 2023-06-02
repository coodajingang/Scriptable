// 创建Widget 布局====
const widget = new ListWidget()
widget.setPadding(14, 5, 14, 5)

var refreshDate = Date.now() + 1000*60*5 // 5 minutes
widget.refreshAfterDate = new Date(refreshDate)
const flag = widget.addText('🇺🇸 Elections')
flag.font = Font.systemFont(16)

widget.addSpacer(10)

const h1 = widget.addStack()
h1.setPadding(5, 5, 5, 5)
h1.cornerRadius = 5
h1.layoutHorizontally()
h1.backgroundColor = colors[i]

// name
const n1 = h1.addText(name(rec.candidate, config.widgetFamily))
h1.addSpacer()
// electoral votes
h1.addText(rec.electoral)

// subs
widget.addSpacer(2)
const sh1 = widget.addStack()
sh1.layoutHorizontally()
sh1.centerAlignContent()
// percentage
const p1 = sh1.addText(rec.percentage)
p1.font = Font.systemFont(8)

sh1.addSpacer()
// count
const c1 = sh1.addText(`${rec.count}`)
c1.font = Font.systemFont(8)
c1.rightAlignText()


//---[ main ]------选择显示为widget还是预览 -------------------------------
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