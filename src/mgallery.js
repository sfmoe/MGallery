export class MGallery{
    
   constructor(options = {}){
         //error if gallery is not found
         if( typeof options.gallery == 'undefined'){
            throw Error("missing gallery object")
         }
         this.lastimage = 0;
         this.originalPageTitle = document.title;
         options.gallery =  (options.gallery.current)? options.gallery.current : options.gallery; //fix for react ref
         this.galleryItems = (typeof options.gallery == "object")? Array.from(options.gallery.querySelectorAll("a")) : this.convert(options.gallery);
         this.build = (options.gallery)? false: true;
         this.gallery = (options.container)? document.querySelector(options.container) : options.gallery;
            (this.build)? this.gallery.append(this.galleryItems) : ()=>{};
        this.galleryOverlay = this.createOverlay();

        this.hashChange();
        this.init();
        // this.swipeInit();

   }
   

   convert = (images)=>{
    let html =  images.map(e=>{
        let parse = new DOMParser();
        let string =  `<a href="${e.src}"><img src="${e.thumb}" /></a>`;
        return parse.parseFromString(string, 'text/html').querySelector("a");
    })

    return html;
    }


   closeGallery = ()=>{
       this.toggleOverlay(this.galleryOverlay, "hide");
       history.pushState("", this.originalPageTitle, window.location.pathname + window.location.search);
       this.hashChange();
   };

   hashChange = () => {
       if(window.location.hash != ""){
           let loadGallery = this.gallery;
           this.findImageByHREF( loadGallery.querySelectorAll("a"), window.location.hash );
         }else{
             if(window.location.hash == '' && this.galleryOverlay.style.display=='block'){
           this.toggleOverlay(this.galleryOverlay, "hide");
             }
           }
   };

   findImageByHREF = (elements, hash) => {
       for (let i = 0; i < elements.length; i++) {
           if (`#${elements[i].getAttribute("href")}` == hash){
               this.showImage(elements[i]);
           }
       }
   };

   changeImage = (direction, current) => {
       let  currentImageNumber = parseInt(current.dataset.imageCount);
       let updatedImageNumber;
       let allowChange = true;
       if(direction == "next"){
           updatedImageNumber = currentImageNumber+1;
        }else if (direction == "prev"){
            updatedImageNumber = currentImageNumber-1;
        }
        
        if(updatedImageNumber > this.lastimage|| updatedImageNumber < 0) { 
            allowChange = false; 
        }
     
       
       if(allowChange){
       let nextImage = this.gallery.querySelector("a[data-image-count='"+updatedImageNumber+"']");
       

       let newURI = `#${nextImage.href}`;
       if(window.location.hash != newURI){
        history.pushState("", this.originalPageTitle, newURI );
        console.log(updatedImageNumber)
        this.hashChange()
       }

        
       }
   };



   showImage =  (selectedImage) => {

       let currentImage = selectedImage.dataset.imageCount;

       if(currentImage == 0){
           document.getElementsByClassName("prev")[0].style.display = "none";
       }else{
           document.getElementsByClassName("prev")[0].style.display = "block";
       }
       if(currentImage == this.lastimage){
           document.getElementsByClassName("next")[0].style.display = "none";
       }else{
           document.getElementsByClassName("next")[0].style.display = "block";
       }
       
       let image = selectedImage.href;
    //    let imageTitle = selectedImage.querySelector("img").getAttribute("alt");
       console.log("asdasd", selectedImage)
       this.toggleOverlay(this.galleryOverlay, "show");
       let fullImage;
       if(document.body.querySelector(".full-image")){
           fullImage = document.body.querySelector(".full-image");
       }else{
           fullImage = document.createElement("img");
           fullImage.className = "full-image";
           fullImage.id = "fullImage";
       }

       fullImage.src = image;
       fullImage.dataset.imageCount = currentImage;
       //disable right click
       fullImage.addEventListener("contextmenu", (e)=>{e.preventDefault();}, false);
       this.galleryOverlay.appendChild(fullImage);

       
       
   };


   toggleOverlay = (elem, status) => {

       let _mgallery = this;
       const show = ()=>{
           elem.style.display = 'block';
           document.documentElement.style.overflow ="hidden"; 

               //event listeners for gallery overlay
            _mgallery.galleryOverlay.querySelector(".close").addEventListener("click", function(){
                _mgallery.closeGallery()
            });

            _mgallery.galleryOverlay.addEventListener("click",function(event){
                _mgallery.closeGallery();
            });
        
            _mgallery.galleryOverlay.querySelector(".next").addEventListener("click",function(event){
                event.stopPropagation();
                _mgallery.changeImage("next", document.getElementById("fullImage"));
            });
        
            _mgallery.galleryOverlay.querySelector(".prev").addEventListener("click",function(event){
                event.stopPropagation();
                _mgallery.changeImage("prev", document.getElementById("fullImage"));
            });



       };

       const hide = ()=>{
           if (window.getComputedStyle(elem).display === 'block') {
               elem.style.display = 'none';
               document.body.querySelector(".full-image").remove();
               document.documentElement.style.overflow ="scroll";
           }
       };

       (status == "show")? show() : hide();    
 
   };

   createOverlay = () => {
    if(!document.querySelector(".gallery-overlay")){ //if user created modal overlay exists ( or it has been created already dont make another)
    let overlayDiv = document.createElement("div");
    overlayDiv.classList.add("gallery-overlay");
    let closeButton = document.createElement("div");
    closeButton.classList.add("close");
    let prevButton = document.createElement("div");
    prevButton.classList.add("prev");
    let nextButton = document.createElement("div");
    nextButton.classList.add("next");

    let style = document.createElement("style");
    style.innerHTML = `
        .gallery-overlay {
            display: none;
            width: 100%;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99999;
            background: rgba(255,255,255,.75);
        }
         .gallery-overlay .full-image{
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            max-width: 80%;
            max-height: 75%;
            z-index: 9999999;
            }

        .gallery-overlay .close{
            position: absolute;
            right: 20px;
            top: 20px;
            cursor: pointer;
            display:block;
        }
        
        .gallery-overlay .close:before{
            display: block;
            content: 'x';
            height: 20px;
            width: 20px;
            font-size: 3rem;
            font-weight: 900;
        }

        .gallery-overlay .next{
            position: fixed;
            right: 1%;
            top: 50%;
            font-size: 2em;
            cursor: pointer;
        }

        .gallery-overlay .next:before{
            display: block;
            content: '\\003e';
        }

        .gallery-overlay .prev{
            position: fixed;
            left: 1%;
            top: 50%;
            font-size: 2em;
            cursor: pointer;
        }
        .gallery-overlay .prev:before{
            display: block;
            content: '\\003c';
        }
    `;
    overlayDiv.appendChild(closeButton);
    overlayDiv.appendChild(prevButton);
    overlayDiv.appendChild(nextButton);
    overlayDiv.appendChild(style);
        document.getElementsByTagName("body")[0].appendChild(overlayDiv);
       }

       return document.querySelector(".gallery-overlay");
   }

   swipe = (start, end)=>{
       if(window.location.hash !== '' && this.galleryOverlay.style.display=='block'){
       (start > end)? this.changeImage("next", document.getElementById("fullImage")): this.changeImage("prev", document.getElementById("fullImage"));  
       }  
   };

   swipeInit = ()=>{
       let touchStartX = 0;
       let touchEndX = 0;
   
       document.body.addEventListener('touchstart', function(event) {
           touchStartX = event.touches[0].clientX;
       }, false);
       
       document.body.addEventListener('touchmove', function(event) {
           touchEndX = event.touches[0].clientX;        
         });
   
       document.body.addEventListener('touchend', function(event) {
           swipe(touchStartX, touchEndX);
       }, false); 
   
   };








init = function(){
    let _mgallery = this;

    this.galleryItems.forEach((ge, gindex)=>{
        ge.dataset.imageCount = gindex;
 
        ge.addEventListener("click", function(event){
            event.preventDefault();
            //this.hash is the #url in href of the link 
            const newURI = `#${ge.href}`;
            if(window.location.hash != newURI){
                history.pushState("", this.originalPageTitle, newURI );
                _mgallery.hashChange();
            }
            
           
        
         
        });
        //set the lastimage index
        _mgallery.lastimage = gindex;
    });


}

};

export default MGallery;

if (typeof module !== "undefined" && module.exports) {
    module.exports = {MGallery}
}

