# MGallery

## Gallery Lightbox with SPA navigation


A simple lightbox gallery with 0 external dependencies. It can be used in a react project or a vanilla html page


## Instructions for a simple Vanilla

Create a gallery and style how you want. the elements need to be as follow:

```html
    <div class="gallery1">
      <a href="https://via.placeholder.com/595x496?text=1">
      <img src="https://via.placeholder.com/295x196.jpg?text=photo-1-thumb" />
      </a>
      <a href="https://via.placeholder.com/595x496?text=2">
      <img src="https://via.placeholder.com/295x196.jpg?text=photo-1-thumb" />
      </a>
      <a href="https://via.placeholder.com/595x496?text=3">
      <img src="https://via.placeholder.com/295x196.jpg?text=photo-1-thumb" />
      </a>
    </div>
```
import MGallery from mgallery.js into your module

Create a new instance of MGallery with an object key of "gallery" that has the html element reference
```html
 <script type="module">
    import { MGallery} from "./src/mgallery.js";
    window.addEventListener("load",()=>{
        const g = new MGallery({gallery: document.querySelector(".gallery1")});
    })
 </script> 
```

## Instructions for React

```
npm install mgallery
```

```jsx

//sample of an component
import { useEffect, useRef } from 'react'
import './App.css'
import MGallery from "mgallery";

function App() {
  const gallery = useRef();
  //pretend you get images from an api
  const images = [
    { src: "https://via.placeholder.com/595x496?text=file1", thumb: "https://via.placeholder.com/595x496?text=file1", alt: "file1"},
    { src: "https://via.placeholder.com/595x496?text=file2", thumb: "https://via.placeholder.com/595x496?text=file2", alt: "file2"},
    { src: "https://via.placeholder.com/595x496?text=file3", thumb: "https://via.placeholder.com/595x496?text=file3", alt: "file3"},
    { src: "https://via.placeholder.com/595x496?text=file4", thumb: "https://via.placeholder.com/595x496?text=file4", alt: "file4"},
    { src: "https://via.placeholder.com/595x496?text=file5", thumb: "https://via.placeholder.com/595x496?text=file5", alt: "file5"},
    { src: "https://via.placeholder.com/595x496?text=file6", thumb: "https://via.placeholder.com/595x496?text=file6", alt: "file6"},
    { src: "https://via.placeholder.com/595x496?text=file7", thumb: "https://via.placeholder.com/595x496?text=file7", alt: "file7"},
    { src: "https://via.placeholder.com/595x496?text=file8", thumb: "https://via.placeholder.com/595x496?text=file8", alt: "file8"},
    { src: "https://via.placeholder.com/595x496?text=file9", thumb: "https://via.placeholder.com/595x496?text=file9", alt: "file9"},
  ]

  useEffect(()=>{
    const mgallery = new MGallery({gallery})
  },[])

  return (
    <div className="App">
      <h1>React</h1>
      <div className='gallery' ref={gallery}>
        {images.map((e, i)=>{
          //build your image gallery
          return(
            <a href={e.src} key={i}><img src={e.src} alt={e.alt} /></a>
          )
        })}
      </div>

    </div>
  )
}

export default App



```
