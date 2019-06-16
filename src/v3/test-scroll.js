// 滚动测试
!(() => {
    var count = 0;
    var container = document.querySelector('.virtual-tree-container');

    var timer = setInterval(() => {
        container.scrollTop += Math.floor(Math.random() * 10) + 1;
        count ++;
        if(count > 1000) {
            clearInterval(timer);
        }
    }, 30);
})();