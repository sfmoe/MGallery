const MGallery = (gallery)=>{

    const closeGallery = ()=>{
        toggleOverlay(galleryOverlay);
        document.body.querySelector(".full-image").remove();
        history.pushState("", document.title, window.location.pathname + window.location.search);
        document.title = originalPageTitle; 
    };

    const hashChange = () => {
        if(window.location.hash != "" && gallery){
            let loadGallery = gallery;
            findImageByHREF( loadGallery.querySelectorAll("a"), window.location.hash );
          }else{
              if(window.location.hash == '' && galleryOverlay.style.display=='block'){
            toggleOverlay(galleryOverlay);
            document.body.querySelector(".full-image").remove();
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
        closeGallery();
        if(direction == "next"){
            updatedImageNumber = currentImageNumber+1;
        }else{
            updatedImageNumber = currentImageNumber-1;
        }


    galleryItems.forEach((ge, gindex) =>{
        let ImageCountAttribute = ge.dataset.imageCount;

        if(ImageCountAttribute == updatedImageNumber){
           
        window.location = window.location.pathname + ge.hash;
       }
    });
    
        
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
       
        toggleOverlay(galleryOverlay);
      
        let fullImage = document.createElement("img");
        fullImage.className = "full-image";
        fullImage.id = "fullImage";
        fullImage.src = image;
        fullImage.dataset.imageCount = currentImage;
        //disable right click
        fullImage.addEventListener("contextmenu", function(e){
            e.preventDefault();
        }, false);
        document.body.appendChild(fullImage);
        document.title = fullHash.substr(1) + " | " + originalPageTitle; 
        
    };


    const toggleOverlay = (elem) => {
        //hide it
        if (window.getComputedStyle(elem).display === 'block') {
            elem.style.display = 'none';
            document.documentElement.style.overflow ="scroll";
            return;
        }
    
        //show it
        elem.style.display = 'block';
        document.documentElement.style.overflow ="hidden";   
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


    window.addEventListener("hashchange", function(){
        hashChange();
    });


    const galleryItems = gallery.querySelectorAll("a");
    createOverlay();
    const galleryOverlay = document.getElementsByClassName("gallery-overlay")[0];
    
    let originalPageTitle = document.title;
    let lastImage;

        //event listeners for gallery overlay
        galleryOverlay.querySelector(".close").addEventListener("click", function(){
            event.stopPropagation()
            closeGallery()
        });

        galleryOverlay.addEventListener("click",function(){
            closeGallery();
        });
    
        galleryOverlay.querySelector(".next").addEventListener("click",function(){
            event.stopPropagation();
            changeImage("next", document.getElementById("fullImage"));
        });
    
        galleryOverlay.querySelector(".prev").addEventListener("click",function(){
            event.stopPropagation();
            changeImage("prev", document.getElementById("fullImage"));
    
        });

    /* enumerate the gallery items and add click event */
    galleryItems.forEach(function(ge, gindex){
        ge.dataset.imageCount = gindex;

        ge.addEventListener("click", function(event){
            event.preventDefault();
            //this.hash is the #url in href of the link
            window.location = window.location.pathname + this.hash;    
        });
        //set the lastimage index
        lastimage = gindex;
    });


    hashChange();


};

window.onload = ()=>{
    MGallery(document.getElementsByClassName("gallery")[0]);
};