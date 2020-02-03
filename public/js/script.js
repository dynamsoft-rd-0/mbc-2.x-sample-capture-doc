/*global $, KPainter, TaskQueue, Tiff, pdfjsLib, kUtil*/
/*eslint-disable no-console*/
var isMobileSafari = (/iPhone/i.test(navigator.platform) || /iPod/i.test(navigator.platform) || /iPad/i.test(navigator.userAgent)) && !!navigator.appVersion.match(/(?:Version\/)([\w\._]+)/); 
if(isMobileSafari){
    /* In safari at ios, 
     * when open this page by '_blank' mode,
     * and run the script in every pages which this page can link to, 
     * can disable ios safari swipe back and forward.
     */
    window.history.replaceState(null, null, "#");
}

$("#imgShowMdl").on("touchmove", function(ev){
    ev.preventDefault();
    ev.stopPropagation();
});

var painter = new KPainter(/*put key here*/);
painter.onStartLoading = function(){ $("#grayFog").show(); };
painter.onFinishLoading = function(){ $("#grayFog").hide(); };
var painterDOM = painter.getHtmlElement();
painterDOM.style.width = '100%';
painterDOM.style.height = '100%';
try{painterDOM.style.backgroundColor = 'rgba(0,0,0,0.3)';}catch(ex){/**/}
$("#imgShowMdl").prepend(painterDOM);
$(window).resize(function(){
    painter.updateUIOnResize(true);
});

painter.defaultFileInput.removeAttribute('multiple');
painter.defaultFileInput.setAttribute('capture',"");
document.getElementById('areaClickAddImg').addEventListener('click', ()=>{
    painter.defaultFileInput.click();
});

painter.afterAddImgFromFileChooseWindow = painter.afterAddImgFromDropFile = async()=>{
    document.getElementById('areaClickAddImg').style.display = "none"; //hide upload area
    await painter.enterEdit();
    await painter.enterFreeTransformMode();
    await painter.documentDetect();
    document.getElementById('areaBtns').style.display=""; //show btns
};

document.getElementById('btn-capture').addEventListener('click',async()=>{
    await painter.freeTransform();
});
document.getElementById('btn-save').addEventListener('click',async()=>{
    document.getElementById('areaBtns').style.display="none"; //hide btns
    await painter.exitFreeTransformMode();
    await painter.saveEdit(true);
    let blob = painter.getBlob();
    painter.del();
    document.getElementById('areaClickAddImg').style.display = ""; //show upload area
    let fd = new FormData();
    fd.append('img',blob);
    console.log('uploading...');
    await fetch('./collect',{method:"POST",body:fd});
    console.log('uploaded');
});

MBC.loadCvScript().then(()=>{
    $("#grayFog").hide();
});
