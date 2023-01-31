const params = new URLSearchParams(window.location.search)

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

// Términos y Condiciones Footer
let terms = document.querySelector('.terms1')
terms.addEventListener('click', ()=>{
    Toast.fire({
        icon: 'error',
        title: 'No existen por cuestiones cuestionables, pero somos buena gente :)'
    })
})

let terms2 = document.querySelector('.terms2')
terms2.addEventListener('click', ()=>{
    Toast.fire({
        icon: 'error',
        title: 'No existen por cuestiones cuestionables, pero somos buena gente :)'
    })
})