//Constant declaration
const fileInput = document.querySelector(".file-input"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .percent"),
    filterSlider = document.querySelector(".filter-info input"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    chooseImage = document.querySelector(".choose-img"),
    previewImage = document.querySelector(".preview-img img"),
    resetFilters = document.querySelector(".reset-filters"),
    saveImg = document.querySelector(".save-img");


//Filters initial value
let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0;

let rotate = 0,
    flipHor = 1,
    flipVer = 1;

//Applying the filters to the image
const applyFilters = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHor} , ${flipVer})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

//Load the image and remove disable from elements
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImage.src = URL.createObjectURL(file);
  previewImage.addEventListener("load", () => {
    resetFilters.click();
    document.querySelector(".wrapper").classList.remove("pointer-events-none");
    document.querySelector(".reset-filters").classList.remove("pointer-events-none");
    document.querySelector(".save-img").classList.remove("pointer-events-none");
    document.querySelector(".wrapper").classList.remove("opacity-50");
    document.querySelector(".reset-filters").classList.remove("opacity-50");
    document.querySelector(".save-img").classList.remove("opacity-50");
  });
};

//Evaluate each button and filter to see which element is active and its current value
filterOptions.forEach((option) => {
  if (option.classList.contains("active")) {
    option.classList.add("bg-green-700");
    option.classList.add("text-white");
  } 

  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("bg-green-700");
    document.querySelector(".filter .active").classList.remove("text-white");
    document.querySelector(".filter .active").classList.add("border");
    document.querySelector(".filter .active").classList.add("border-gray-600");
    document.querySelector(".filter .active").classList.remove("active");

    option.classList.add("active");
    option.classList.add("bg-green-700");
    option.classList.add("text-white");
    option.classList.remove("border");
    option.classList.remove("border-gray-600");
    filterName.innerText = option.innerText;

    if(option.id === 'brightness') {
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
    } else if(option.id === 'saturation') {
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
    } else if(option.id === 'inversion') {
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
    } else {
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
    }
  });
});

//when input range change the value of the current filter is change and applied to the image
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');

    if(selectedFilter.id === 'brightness') {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === 'saturation') {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === 'inversion') {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    applyFilters();
}


rotateOptions.forEach(option => {
    option.addEventListener('click', () => {
        if(option.id === 'left') {
            rotate -= 90;
        } else if(option.id === 'right') {
            rotate += 90;
        } else if(option.id === 'horizontal'){
            flipHor = flipHor === 1 ? -1 : 1;
        } else{
            flipVer = flipVer === 1 ? -1 : 1;
        }

        applyFilters();
    });
})

const resetFilter = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    flipHor = 1;
    flipVer = 1;
    filterOptions[0].click();
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate( canvas.width/2, canvas.height/2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHor, flipVer);
    ctx.drawImage( previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

//Events for each section of the application
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilters.addEventListener("click", resetFilter);
saveImg.addEventListener("click", saveImage);
chooseImage.addEventListener("click", () => fileInput.click());
