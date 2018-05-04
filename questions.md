# 学习疑问纪录

## ES6或TS中还需要用`self = this`吗？
The new fat arrow (=>) feature provides a lexically scoped this rather than a dynamically scoped this. So if you're using that, then you don't need to make a copy of this any more. Otherwise nothing has changed.
## Angular Component中既然有了`ngOnInit`，那`constructor`还有什么用？
即使Angular定义了ngOnInit，constructor也有其用武之地，其主要作用是注入依赖.
ngOnInit纯粹是通知开发者组件/指令已经被初始化完成了，此时组件/指令上的属性绑定操作以及输入操作已经完成，也就是说在ngOnInit函数中我们已经能够操作组件/指令中被传入的数据了
