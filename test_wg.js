

const widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
//====================================
let stack = widget.addStack();
let tipsTextSpan = stack.addText(`暂不提供组件`);
tipsTextSpan.textColor = Color.black();
let fontSize = 12;

tipsTextSpan.font = Font.semiboldSystemFont(16);
tipsTextSpan.shadowColor = new Color('#333');
tipsTextSpan.shadowRadius = 2;
tipsTextSpan.shadowOffset = new Point(1, 1);
stack.centerAlignContent();

Script.setWidget(widget);
Script.complete();