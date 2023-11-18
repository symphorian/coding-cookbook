let lightboxContainer = 
    document.getElementById("lightboxContainer");
let lightboxBackground =
    document.getElementById("lightboxBackground");
let lightbox = document.getElementById("lightbox");
let lightboxCloser = document.getElementById("lightboxCloser");

function openLightbox() {
    lightboxContainer.classList.add("display");
    lightbox.src = this.src;
}

let images = document.getElementsByTagName("img");
for (let i = 0; i < images.length; i++) {
    let image = images[i];
    image.onclick = openLightbox;
}


function closeLightbox() {
    lightboxContainer.classList.remove("display");
    lightbox.src = "";
}

lightboxCloser.onclick = closeLightbox;
lightboxBackground.onclick = closeLightbox;