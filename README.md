# M Gallery

## Gallery navigation in single page


I created M Gallery to user on my website [moemartinez.com](https://moemartinez.com) and im re-writing it so that it can be dropped in anywhere.

## Instructions

you need an element with class gallery and inside have an anchor tag with image.

the anchor tag needs to have a hash url wich is the image filename and data-location is the folder/url where the file is located.

the img is the thumbnail to be used.

```html
<div class="gallery">
<a href="/#photo-1.jpg" data-location="https://via.placeholder.com/595x496?text=">
    <img src="https://via.placeholder.com/295x196.jpg?text=photo-1-thumb" />
</a>
</div>    
```