const MGallery = (gallery, galleryName="MG")=>{
    
    //exit if gallery is not found
    if(typeof gallery == 'undefined'){return false;}
    
    const closeGallery = ()=>{
        toggleOverlay(galleryOverlay, "hide");
        history.pushState("", originalPageTitle, window.location.pathname + window.location.search);
        document.title = originalPageTitle;
        hashChange();
    };

    const hashChange = () => {
        if(window.location.hash != ""){
            let loadGallery = gallery;
            findImageByHREF( loadGallery.querySelectorAll("a"), window.location.hash );
          }else{
              if(window.location.hash == '' && galleryOverlay.style.display=='block'){
            toggleOverlay(galleryOverlay, "hide");
              }
            }
    };

    const findImageByHREF = (elements, hash) => {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("href").substr(1) == hash){
                showImage(elements[i]);
            }
        }
    };

    const changeImage = (direction, current) => {
        let  currentImageNumber = parseInt(current.dataset.imageCount);
        let updatedImageNumber;
        if(direction == "next"){
            updatedImageNumber = currentImageNumber+1;
        }else if (direction == "prev"){
            updatedImageNumber = currentImageNumber-1;
        }

        let nextImage = gallery.querySelector("a[data-image-count='"+updatedImageNumber+"']");
        document.body.querySelector(".full-image").remove();
        history.pushState("", originalPageTitle, window.location.pathname + nextImage.hash);
        hashChange();
    
        
    };



    const showImage =  (selectedImage) => {
        let folder = selectedImage.dataset.location;
        let currentImage = selectedImage.dataset.imageCount;

        if(currentImage == 0){
            document.getElementsByClassName("prev")[0].style.display = "none";
        }else{
            document.getElementsByClassName("prev")[0].style.display = "block";
        }
        if(currentImage == lastimage){
            document.getElementsByClassName("next")[0].style.display = "none";
        }else{
            document.getElementsByClassName("next")[0].style.display = "block";
        }
        
        let image = folder+selectedImage.hash.substr(1);
        let fullHash = selectedImage.hash;
        
        toggleOverlay(galleryOverlay, "show");
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
        document.body.appendChild(fullImage);
        document.title = fullHash.substr(1) + " | " + originalPageTitle; 
        
        
    };


    const toggleOverlay = (elem, status) => {

        
        const show = ()=>{
            elem.style.display = 'block';
            document.documentElement.style.overflow ="hidden"; 
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

    const createOverlay = () => {
        /*currently not being used*/
        let overlayDiv = document.createElement("div");
            overlayDiv.classList.add("gallery-overlay");
        let closeButton = document.createElement("span");
            closeButton.classList.add("close");
        let prevButton = document.createElement("span");
            prevButton.classList.add("prev");
        let nextButton = document.createElement("span");
            nextButton.classList.add("next");
        overlayDiv.appendChild(closeButton);
        overlayDiv.appendChild(prevButton);
        overlayDiv.appendChild(nextButton);

        document.getElementsByTagName("body")[0].appendChild(overlayDiv);
    }

    const swipe = (start, end)=>{
        if(window.location.hash !== '' && galleryOverlay.style.display=='block'){
        (start > end)? changeImage("next", document.getElementById("fullImage")): changeImage("prev", document.getElementById("fullImage"));  
        }  
    };
    const swipeInit = ()=>{
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

    const galleryItems = gallery.querySelectorAll("a");
    createOverlay();
    const galleryOverlay = document.getElementsByClassName("gallery-overlay")[0];
    
    let originalPageTitle = document.title;
    let lastImage;

        //event listeners for gallery overlay
        galleryOverlay.querySelector(".close").addEventListener("click", function(){
            closeGallery()
        });

        galleryOverlay.addEventListener("click",function(event){
            closeGallery();
        });
    
        galleryOverlay.querySelector(".next").addEventListener("click",function(event){
            event.stopPropagation();
            changeImage("next", document.getElementById("fullImage"));
        });
    
        galleryOverlay.querySelector(".prev").addEventListener("click",function(event){
            event.stopPropagation();
            changeImage("prev", document.getElementById("fullImage"));
        });

        window.addEventListener("hashchange", function(){
            hashChange();
        });


    /* enumerate the gallery items and add click event */
    galleryItems.forEach(function(ge, gindex){
        ge.dataset.imageCount = gindex;

        ge.addEventListener("click", function(event){
            event.preventDefault();
            //this.hash is the #url in href of the link 
            history.pushState("", originalPageTitle, window.location.pathname + this.hash);
            hashChange();
        
         
        });
        //set the lastimage index
        lastimage = gindex;
    });


    hashChange();
    swipeInit();

};

window.onload = ()=>{
   MGallery(document.getElementsByClassName("gallery")[0]);
};