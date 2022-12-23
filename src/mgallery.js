export class MGallery {

    constructor(options = {}) { 
        // error if gallery is not found
        if (typeof options.gallery == 'undefined') {
            throw Error("missing gallery object")
        }
        this.originalPageTitle = document.title;
        this.lastimage = 0;
        options.gallery = (options.gallery.current) ? options.gallery.current : options.gallery; // fix for react ref

        this.galleryItems = (Array.isArray(options.gallery)) ? this.convert(options.gallery) : Array.from(options.gallery.querySelectorAll("a"));
        this.build = (options.build) ? true : false;

        this.gallery = (options.container) ? document.querySelector(options.container) : options.gallery;

        if(options.build === true) { 
            this.galleryItems.map( e=>this.gallery.append(e) ); 
        };

        this.galleryOverlay = this.createOverlay();

        this.init();
        this.hashChange();
        this.swipeInit();
    }


    convert = (images) => {
        return images.map(e => {
            let parse = new DOMParser();
            let string = `<a href="${e.src}"><img src="${e.thumb}" /></a>`;
            return parse.parseFromString(string, 'text/html').querySelector("a");
        })
    }

    hashChange = () => {
        if (window.location.hash != "") {
            this.findImageByHREF(this.gallery.querySelectorAll("a"), window.location.hash);
        } else {
            if (window.location.hash == '' && this.galleryOverlay.style.display == 'block') {
                this.toggleOverlay(this.galleryOverlay, "hide");
            }
        }
    };

    findImageByHREF = (elements, hash) => {
        for (let i = 0; i < elements.length; i++) {
            if (`#${elements[i].getAttribute("href")}` == hash) {
                this.showImage(elements[i]);
            }
        }
    };

    showImage = (selectedImage) => {

        let currentImage = this.gallery.querySelector(`[href='${
            selectedImage.getAttribute("href")
        }']`).getAttribute("data-image-count");

        if (currentImage == 0) {
            document.getElementsByClassName("prev")[0].style.display = "none";
        } else {
            document.getElementsByClassName("prev")[0].style.display = "block";
        }
        if (currentImage == this.lastimage) {
            document.getElementsByClassName("next")[0].style.display = "none";
        } else {
            document.getElementsByClassName("next")[0].style.display = "block";
        }

        let image = selectedImage.href;

        this.toggleOverlay(this.galleryOverlay, "show");
        let fullImage;
        if (document.body.querySelector(".full-image")) {
            fullImage = document.body.querySelector(".full-image");
        } else {
            fullImage = document.createElement("img");
            fullImage.className = "full-image";
            fullImage.id = "fullImage";
        } fullImage.src = image;
        fullImage.dataset.imageCount = currentImage;
        // disable right click
        fullImage.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);
        this.galleryOverlay.appendChild(fullImage);


    };
   
    changeImage = (direction) => {
        let _mgallery = this;
        let current = document.querySelector("#fullImage");
        let currentImageNumber = Number(current.getAttribute("data-image-count"));
        let updatedImageNumber;
        let allowChange = true;

        if (direction == "next") {
            updatedImageNumber = currentImageNumber + 1;
        } else if (direction == "prev") {
            updatedImageNumber = currentImageNumber - 1;
        }
        console.log(this.lastimage)
        if (updatedImageNumber > this.lastimage || updatedImageNumber < 0) {
            allowChange = false;
        }

        if (allowChange) {
            let nextImage = this.gallery.querySelector(`a[data-image-count='${updatedImageNumber}']`);

            let newURI = `#${nextImage.href}`;

            if (window.location.hash != newURI) {
                history.pushState("", this.originalPageTitle, newURI);
                this.hashChange()
            }
        }
    };
    createOverlay = () => {
        let _mgallery = this;
        let overlayName = `gallery-overlay-${Math.floor(Math.random() * 100)}`
        if (!document.querySelector("#"+overlayName)) { // if modal overlay exists ( or it has been created already dont make another)
            let overlayDiv = document.createElement("div");
            overlayDiv.setAttribute("id", overlayName);
            overlayDiv.classList.add("gallery-overlay");
            let closeButton = document.createElement("div");
            closeButton.classList.add("close");
            let prevButton = document.createElement("div");
            prevButton.classList.add("prev");
            let nextButton = document.createElement("div");
            nextButton.classList.add("next");

            // event listeners for gallery overlay
            closeButton.addEventListener("click", function () {
                _mgallery.closeOverlay()
            });

            overlayDiv.addEventListener("click", function (event) {
                _mgallery.closeOverlay();
            });

            nextButton.addEventListener("click", function (event) {
                event.stopPropagation();
                _mgallery.changeImage("next");
            });

            prevButton.addEventListener("click", function (event) {
                event.stopPropagation();
                _mgallery.changeImage("prev");
            });

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
                color: #000;
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
            }`;
            
            overlayDiv.appendChild(closeButton);
            overlayDiv.appendChild(prevButton);
            overlayDiv.appendChild(nextButton);
            overlayDiv.appendChild(style);
            document.getElementsByTagName("body")[0].appendChild(overlayDiv);
        }
        return document.querySelector("#"+overlayName);
 
    }

    toggleOverlay = (elem, status) => {

        let _mgallery = this;
        const show = () => {
            elem.style.display = 'block';
            document.documentElement.style.overflow = "hidden";
        };

        const hide = () => {
            if (window.getComputedStyle(elem).display === 'block') {
                elem.style.display = 'none';
                document.body.querySelector(".full-image").remove();
                document.documentElement.style.overflow = "scroll";
            }
        };

        (status == "show") ? show() : hide();

    };


    closeOverlay = ()=>{
        this.toggleOverlay(this.galleryOverlay, "hide");
        history.pushState("", this.originalPageTitle, window.location.pathname + window.location.search);
        this.hashChange();
    };

    swipe = (start, end) => {
        if (window.location.hash !== '' && this.galleryOverlay.style.display == 'block') {
            (start > end) ? this.changeImage("next") : this.changeImage("prev");
        }
    };

    swipeInit = () => {
        let touchStartX = 0;
        let touchEndX = 0;

        document.body.addEventListener('touchstart', function (event) {
            touchStartX = event.touches[0].clientX;
        }, false);

        document.body.addEventListener('touchmove', function (event) {
            touchEndX = event.touches[0].clientX;
        });

        document.body.addEventListener('touchend', function (event) {
            swipe(touchStartX, touchEndX);
        }, false);

    };


    init = function () {
        this.lastimage = this.galleryItems.length-1;
        let _mgallery = this;

        this.galleryItems.forEach((ge, gindex) => {
            ge.dataset.imageCount = gindex;

            ge.addEventListener("click", function (event) {
                event.preventDefault();
                //create hash in newURI
                const newURI = `#${ge.href}`;
                if (window.location.hash != newURI) {
                    history.pushState("", this.originalPageTitle, newURI);
                    _mgallery.hashChange();
                }


            });
        });

            window.addEventListener("hashchange", ()=>_mgallery.hashChange())

    }

};

export default MGallery;

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        MGallery
    }
}
