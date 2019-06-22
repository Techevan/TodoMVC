let all=[];
let items=[];
const colorArr=['rgba(240,240,240,1)','rgba(220,159,180,0.3)','rgba(239,187,36,0.3)','rgba(93,172,129,0.3)'];

function $(id){
    "use strict";
    return document.getElementById(id);
}

function updateData(){
    "use strict";
    localStorage.setItem('todosData',JSON.stringify(all));
    
}

// element: 对DOM节点进行操作
let element={
    add:function(element){
        "use strict";
        $('list').appendChild(element);
    },
    delete:function(element){
        "use strict";
        element.classList='item fadeOutUp';
        setTimeout(()=>{
            $('list').removeChild(element);
        },300);
    },
    modify:function(item){
        "use strict";
        let tempClassList=$(item.timeStp).childNodes[0].childNodes[0].classList;
        if(item.done&&!tempClassList.contains('complete')){
            tempClassList.add('complete');
        }else if(!item.done&&tempClassList.contains('complete')){
            tempClassList.remove('complete');
        }
    },
    create:function(item){
        "use strict";
        let content=document.createElement('div');
        content.innerHTML=item.content;
        content.className='content'+(item.done?' complete':'');
        

        let deleteBtn=document.createElement('button');
        deleteBtn.innerHTML='×';
        deleteBtn.className='deleteBtn';
        deleteBtn.type='button';
        
        let itemInner=document.createElement('div');
        itemInner.classList='itemInner';
        itemInner.appendChild(content);
        itemInner.appendChild(deleteBtn);

        let listItem=document.createElement('div');
        listItem.classList='item fadeInUp';
        listItem.appendChild(itemInner);
        listItem.id=item.timeStp;

        deleteBtn.addEventListener('touchstart',(e)=>{
            itemOp.delete(e.srcElement.parentNode.parentNode.id);
            setTimeout(() => {
                clearTimeout(longTapTime);
            }, 100);
        });

        listItem.addEventListener("touchstart",touchHandeler.start);
        listItem.addEventListener("touchmove",touchHandeler.move);
        listItem.addEventListener("touchcancel",touchHandeler.cancel);
        listItem.addEventListener("touchend",touchHandeler.end);

        return listItem;
    
    },
    getId:function(element){
        "use strict";
        let tempNode=element;
        while(true){
            if(!tempNode.parentNode){
                return null;
            }else if(tempNode.parentNode.id){
                return tempNode.parentNode.id;
            }else{
                tempNode=tempNode.parentNode;
            }
        }
    },
    activeShowAll:function(){
        "use strict";
        $('showAll').classList.add('selectButtonActive');
        $('showDone').classList.remove('selectButtonActive');
        $('showProcess').classList.remove('selectButtonActive');
        $('showSearchResult').classList.add('hiddenTotal');
        $('showDone').classList.remove('hiddenTotal');
        $('showProcess').classList.remove('hiddenTotal');
    },
    activeShowProcess:function(){
        "use strict";
        $('showProcess').classList.add('selectButtonActive');
        $('showDone').classList.remove('selectButtonActive');
        $('showAll').classList.remove('selectButtonActive');
    },
    activeShowDone:function(){
        "use strict";
        $('showDone').classList.add('selectButtonActive');
        $('showProcess').classList.remove('selectButtonActive');
        $('showAll').classList.remove('selectButtonActive');
    },
    activeSearchResult:function(){
        "use strict";
        $('showSearchResult').classList.add('selectButtonActive');
        $('showAll').classList.remove('selectButtonActive');
        $('showDone').classList.remove('selectButtonActive');
        $('showProcess').classList.remove('selectButtonActive');
        $('showSearchResult').classList.remove('hiddenTotal');
        $('showDone').classList.add('hiddenTotal');
        $('showProcess').classList.add('hiddenTotal');
    }
};

// itemOp: 对items数组中的值进行操作
let itemOp={
    add:function(content){
        "use strict";
        items.push({
            content:content,
            timeStp: new Date().getTime().toString(),
            done:false
        });
        all.push({
            content:content,
            timeStp: new Date().getTime().toString(),
            done:false
        });
        diff(items);
        updateData();
        return;
    },
    delete:function(id){
        "use strict";
        for(let i=0;i<items.length;i++){
            if(items[i].timeStp===id){
                items.splice(i,1);
                diff(items);
                updateData(items);
                break;
            }
        }
        for(let i=0;i<all.length;i++){
            if(all[i].timeStp===id){
                all.splice(i,1);
                break;
            }
        }
        updateData();
    },
    modify:function(id){
        "use strict";
        for(let i=0;i<items.length;i++){
            if(items[i].timeStp===id){
                items[i].done=!items[i].done;
                break;
            }
        }
        for(let i=0;i<all.length;i++){
            if(all[i].timeStp===id){
                all[i].done=!all[i].done;
                break;
            }
        }
        diff(items);
        updateData();
    },
    deleteAllComplete:function(){
        "use strict";
        for(let i=0; i<items.length; i++){
            if(items[i].done){
                items.splice(i,1);
                i--;
            }
        }
        diff(items);
        for(let i=0; i<all.length; i++){
            if(all[i].done){
                all.splice(i,1);
                i--;
            }
        }
        updateData();
        controlPanel.hidden();
    },
    makeAllComplete:function(){
        "use strict";
        for(let i=0; i<items.length; i++){
            items[i].done=true;
        }
        diff(items);
        for(let i=0; i<all.length; i++){
            all[i].done=true;
        }
        updateData();
        controlPanel.hidden();
    },
    makeAllNotComplete:function(){
        "use strict";
        for(let i=0; i<items.length; i++){
            items[i].done=false;
        }
        diff(items);
        for(let i=0; i<all.length; i++){
            all[i].done=false;
        }
        updateData();
        controlPanel.hidden();
    },
    showAll:function(){
        "use strict";
        element.activeShowAll();
        refresh();
        items.splice(0,items.length);
        for(let i=0;i<all.length;i++){
            items.push({
                content:all[i].content,
                timeStp:all[i].timeStp,
                done:all[i].done
            });
        }
    },
    showComplete:function(){
        "use strict";
        element.activeShowDone();
        items.splice(0,items.length);
        for(let i=0;i<all.length;i++){
            if(all[i].done){
                items.push({
                    content:all[i].content,
                    done:all[i].done,
                    timeStp:all[i].timeStp
                });
            }
        }
        diff(items);
    },
    showNotComplete:function(){
        "use strict";
        element.activeShowProcess();
        items.splice(0,items.length);
        for(let i=0;i<all.length;i++){
            if(!all[i].done){
                items.push({
                    content:all[i].content,
                    done:all[i].done,
                    timeStp:all[i].timeStp
                });
            }
        }
        diff(items);
    },
    search:function(keyword){
        "use strict";
        element.activeSearchResult();
        items.splice(0,items.length);
        for(let i=0;i<all.length;i++){
            if(all[i].content.indexOf(keyword)>-1){
                items.push({
                    content:all[i].content,
                    done:all[i].done,
                    timeStp:all[i].timeStp
                });
            }
        }
        diff(items);
        controlPanel.hidden();
    },
    getItem:function(id){
        "use strict";
        for(let i=0;i<all.length;i++){
            if(all[i].timeStp===id){
                return {
                    content:all[i].content,
                    timeStp:all[i].timeStp,
                    done:all[i].done
                }
            }
        }
    }
};

function refresh(){
    "use strict";
    $('list').innerHTML='';
    for(let i=0; i<all.length; i++){
        let tempNode=element.create({
            content:all[i].content,
            timeStp:all[i].timeStp,
            done:all[i].done
        });
        element.add(tempNode);
    }
    
}

// diff: 比较DOM和items的差异，通过数据驱动方式刷新页面
function diff(items){
    "use strict";
    let DomChildList=$('list').childNodes;
    let toBeAdded=[];
    let toBeModified=[];

    let idInList=[];
    for(let i=0;i<DomChildList.length;i++){
        idInList.push(DomChildList[i].id);
    }

    for(let item of items){
       if(idInList.indexOf(item.timeStp)===-1){
            toBeAdded.push(item);
       }else{
            // 已经渲染在DOM里的元素，从数组中去掉，并检查Done字段
            idInList.splice(idInList.indexOf(item.timeStp),1);
            if(item.done!==$(item.timeStp).childNodes[0].childNodes[0].classList.contains('complete')){
                toBeModified.push(item);
            }
       }
    }
    // 此时idInList中剩下的元素就是应该删掉的元素
    // 1. 添加要添加的元素
    for(let i=0;i<toBeAdded.length;i++){
        let tempEl=element.create({
            content:toBeAdded[i].content,
            done:toBeAdded[i].done,
            timeStp:toBeAdded[i].timeStp
        });
        element.add(tempEl);
    }

    // 2. 修改需要修改状态的
    for(let i=0;i<toBeModified.length;i++){
        element.modify({
            content:toBeModified[i].content,
            timeStp:toBeModified[i].timeStp,
            done:toBeModified[i].done
        });
    }
    // 3. 删除需要删除的
    for(let i=0;i<idInList.length;i++){
        element.delete($(idInList[i]));
    }
}

// 有关Touch事件的变量
var lastTouch;
var currentTouch;
var lastTargetId;
var currentTargetId;
var longTapTime;

// touchHandler: 处理左滑、右滑和长按
let touchHandeler={
    start:function(e){
        "use strict";
        lastTouch=e.touches[0];
        if(!lastTouch){return;}
        lastTargetId=element.getId(lastTouch.target);
        longTapTime=setTimeout(() => {
            editPanel.show(lastTargetId);
        }, 500);
    },
    move:function(e){
        "use strict";
        currentTouch=e.touches[0];
        if (Math.abs(currentTouch.clientX-lastTouch.clientX)>10||Math.abs(currentTouch.clientY-lastTouch.clientY)>10){
            clearTimeout(longTapTime);
        } 
    },
    cancel:function(e){
        "use strict";
        clearTimeout(longTapTime);
    },
    end:function(e){
        "use strict";
        var clearAll=function(){
            lastTouch=null;
            currentTouch=null;
            lastTargetId=null;
            currentTargetId=null;
        };
        clearTimeout(longTapTime);
        if(!lastTouch||!currentTouch){
            clearAll();
            return;
        }

        currentTargetId=element.getId(currentTouch.target);

        if(currentTargetId===lastTargetId&&
            currentTouch.clientX-lastTouch.clientX>=60&&
            Math.abs(currentTouch.clientY-lastTouch.clientY)<=60)
            {
                itemOp.delete(lastTargetId);
                clearAll();
                return;
            }
        else if(currentTargetId===lastTargetId&&
            currentTouch.clientX-lastTouch.clientX<=-60&&
            Math.abs(currentTouch.clientY-lastTouch.clientY)<=60)
            {
                itemOp.modify(lastTargetId);
                clearAll();
                return;
            }
    }
};

let controlPanel={
    show: function(){
        "use strict";
        $('controlPanel').classList.remove('hiddenTotal','slideOutDown');
        $('controlPanel').classList.add('slideInUp');

    },
    hidden:function(){
        "use strict";
        $('controlPanel').classList.remove('slideInUp');
        $('controlPanel').classList.add('slideOutDown');
    }
};

let editPanel={
    id:null,
    show:function(id){
        "use strict";
        let tempItem=itemOp.getItem(id);
        $('editPanel').classList.remove('hiddenTotal','slideOutUp');
        $('editPanel').classList.add('slideInDown');
        $('editPanel').dataset.itemId=id;
        $('deleteItem').addEventListener('touchstart',editPanel.deleteItem);
        $('completeItem').addEventListener('touchstart',editPanel.completeItem);

        let tempNode=document.createElement('span');
        tempNode.innerHTML=tempItem.done?'Undo':'Complete';
        $('completeItem').removeChild($('completeItem').lastChild);
        $('completeItem').firstChild.classList.remove('icon-quxiao','icon-check');
        $('completeItem').firstChild.classList.add(tempItem.done?'icon-quxiao':'icon-check');
        $('completeItem').appendChild(tempNode);
        
        $('editTextarea').classList.remove('inputInvalid');
        $('editTextarea').value=tempItem.content;
        $('editTextarea').addEventListener('keyup',editPanel.keyUp);
        $('editTextarea').addEventListener('focus',editPanel.focus);
        let tempDate=new Date(parseInt(tempItem.timeStp));
        $('editPanelTime').innerHTML=`${tempDate.getFullYear()}-${tempDate.getMonth()+1}-${tempDate.getDate()} ${tempDate.getHours()}:${tempDate.getMinutes()}`;
    },
    hidden:function(){
        "use strict";
        $('editPanel').classList.remove('slideInDown');
        $('editPanel').classList.add('slideOutUp');
        $('editPanel').dataset.itemId=null;
        $('deleteItem').removeEventListener('touchstart',editPanel.deleteItem);
        $('completeItem').removeEventListener('touchstart',editPanel.completeItem);
        $('editTextarea').addEventListener('keyup',editPanel.keyUp);
        $('editTextarea').removeEventListener('focus',editPanel.focus);
    },
    deleteItem:function(){
        "use strict";
        console.log(this.parentNode.dataset.itemId);
        itemOp.delete(this.parentNode.dataset.itemId);
        editPanel.hidden();
    },
    completeItem:function(){
        "use strict";
        itemOp.modify(this.parentNode.dataset.itemId);
        editPanel.hidden();
    },
    keyUp:function(e){
        "use strict";
        console.log(e.keyCode)
        if (e.keyCode !== 13) {
            return;
        }else{
            $('editTextarea').value=$('editTextarea').value.substr(0,$('editTextarea').value.length-1)
        } 
        if($('editTextarea').value===''){
            $('editTextarea').classList.add('inputInvalid');
            $('editTextarea').value='Empty is Invalid';
            $('editTextarea').blur();
            return;
        }
        $('editTextarea').blur();
        console.log($('editTextarea').value);
        editPanel.modifyContent(this.parentNode.parentNode.dataset.itemId,$('editTextarea').value);
        editPanel.hidden();
    },
    focus:function(){
        "use strict";
        $('editTextarea').classList.remove('inputInvalid');
        if($('editTextarea').value==='Empty is Invalid'){$('editTextarea').value='';}
    },
    modifyContent:function(id,newContent){
        "use strict";
        for(let i=0;i<items.length;i++){
            if(items[i].timeStp===id){
                items[i].content=newContent;
                break;
            }
        }
        for(let i=0;i<all.length;i++){
            if(all[i].timeStp===id){
                all[i].content=newContent;
                break;
            }
        }
        updateData();
        $(id).childNodes[0].childNodes[0].innerHTML=newContent;
    }
};

// 初始化：为输入框等绑定事件
function init(){
    "use strict";
    // 标题动画
    $('title').classList.add('flipInY');
    setTimeout(() => {
        $('title').classList.remove('flipInY');
    }, 800);
    // 输入框绑定事件
    $('inputBlock').addEventListener('keyup',(e)=>{
        if (e.keyCode !== 13) {
            return;
        }else if($('inputBlock').value===''){
            $('inputBlock').classList.add('inputInvalid');
            $('title').classList.add('shake');
            setTimeout(() => {
                $('title').classList.remove('shake');
            }, 500);
            $('inputBlock').value='Empty is Invalid';
            $('inputBlock').blur();
            return;
        }
        itemOp.add($('inputBlock').value);
        $('inputBlock').value='';
    });
    $('inputBlock').addEventListener('focus',()=>{
        controlPanel.hidden();
        $('inputBlock').classList.remove('inputInvalid');
        if($('inputBlock').value==='Empty is Invalid'){$('inputBlock').value='';}
    })
    $('inputBlock').focus();
    // 筛选器绑定事件
    $('showProcess').addEventListener('touchstart',itemOp.showNotComplete);
    $('showAll').addEventListener('touchstart',itemOp.showAll);
    $('showDone').addEventListener('touchstart',itemOp.showComplete);
    // 控制面板绑定事件
    $('menu').addEventListener('touchstart',controlPanel.show);
    $('closeControlPanel').addEventListener('touchstart',controlPanel.hidden);
    for(let item of colorArr){
        let el=document.createElement('div');
        el.classList.add('colorSelector');
        let subel=document.createElement('span');
        subel.classList.add('iconfont','icon-round-copy');
        subel.style.color=item;
        subel.style.fontSize='28px';
        el.appendChild(subel);
        el.addEventListener('touchstart',(e)=>{
            document.getElementsByTagName('body')[0].style.backgroundColor=e.target.style.color;
            controlPanel.hidden();
        })
        $('colorSeletor').appendChild(el);
    }
    $('completeAll').addEventListener('touchstart',itemOp.makeAllComplete);
    $('undoAll').addEventListener('touchstart',itemOp.makeAllNotComplete);
    $('deleteCompleted').addEventListener('touchstart',itemOp.deleteAllComplete);
    $('searchBlock').addEventListener('keyup',(e)=>{
        if (e.keyCode !== 13) {
            return;
        }else if($('searchBlock').value===''){
            $('searchBlock').classList.add('inputInvalid');
            $('searchBlock').value='Empty is Invalid';
            $('title').classList.add('shake');
            setTimeout(() => {
                $('title').classList.remove('shake');
            }, 500);
            $('searchBlock').blur();
            return;
        }
        $('searchBlock').blur();
        itemOp.search($('searchBlock').value);
        $('searchBlock').value='';
    });
    $('searchBlock').addEventListener('focus',()=>{
        $('searchBlock').classList.remove('inputInvalid');
        if($('searchBlock').value==='Empty is Invalid'){$('searchBlock').value='';}
    });
    // 编辑面板绑定事件
    $('closeEditPanel').addEventListener('touchstart',editPanel.hidden);

    itemOp.showAll();
}


if(localStorage.todos){
    // 有值：非新用户
    init();
    let tempArr=JSON.parse(localStorage.todosData);
    for(let i=0;i<tempArr.length;i++){
        all.push({
            content:tempArr[i].content,
            timeStp:tempArr[i].timeStp,
            done:tempArr[i].done
        });
        items.push({
            content:tempArr[i].content,
            timeStp:tempArr[i].timeStp,
            done:tempArr[i].done
        });
    }
    diff(items);
}else{
    // 无值：新用户
    localStorage.setItem('todos',true);
    init();
    all=[
        {
            content:'欢迎使用Todos',
            timeStp:new Date().getTime().toString(),
            done:false
        },
        {
            content:'左滑切换完成/取消',
            timeStp:(new Date().getTime()+parseInt(Math.random()*10+1)).toString(),
            done:false
        },
        {
            content:'右滑删除项目',
            timeStp:(new Date().getTime()+parseInt(Math.random()*100+1)).toString(),
            done:false
        },
    ];
    items=[
        {
            content:'欢迎使用Todos',
            timeStp:new Date().getTime().toString(),
            done:false
        },
        {
            content:'左滑切换完成/取消',
            timeStp:(new Date().getTime()+parseInt(Math.random()*10+1)).toString(),
            done:false
        },
        {
            content:'右滑删除项目',
            timeStp:(new Date().getTime()+parseInt(Math.random()*100+1)).toString(),
            done:false
        },
    ];
    updateData();
    diff(items);
}