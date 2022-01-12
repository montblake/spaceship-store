alert('JS is alive!!!!')

const back=document.querySelector('#back')
const forward=document.querySelector('#forward');


const filmContainer=document.querySelector('#film-container');

const filmSquare=document.querySelector('#film1');




const deltaX = filmSquare.clientWidth + 10;

filmContainer.addEventListener('scroll', ()=>{
    if (filmContainer.scrollLeft < deltaX){
        back.style.opacity = '0';
    }
})

back.addEventListener('click', moveBack);

forward.addEventListener('click', moveForward);

function moveForward(){
    filmContainer.scrollLeft += deltaX ;

}

function moveBack(){
    console.log(filmContainer.scrollLeft);
    filmContainer.scrollLeft -= deltaX;
}






