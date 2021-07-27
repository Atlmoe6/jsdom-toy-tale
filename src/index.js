let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchToys()
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.querySelector("form.add-toy-form")
  toyForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const nameInput = event.target[0].value
    const imageInput = event.target[1].value

    const toyObject = {
      name: nameInput,
      image: imageInput,
      likes: 0
    }
    
    toyForm.reset()
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toyObject)
    })
    .then(r => r.json())
    .then(toy => createOneCard(toy))
  })
  const toyCollectionDiv = document.querySelector("div#toy-collection")
  toyCollectionDiv.addEventListener('click', (event) => {
    if (event.target.matches('button.like-btn')) {
        let card = event.target.closest('div.card')
        let likesNumSpan = card.querySelector('p')
        const currLikes = parseInt(likesNumSpan.textContent)
        const newLikes = currLikes + 1
  
        likesNumSpan.textContent = newLikes
        fetch(`http://localhost:3000/toys/${card.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ likes: newLikes })
        })
    }
})
});


function fetchToys() {
  fetch('http://localhost:3000/toys')
      .then(r => r.json())
      .then(toysArray => {
          toysArray.forEach(toyObject => {
              createOneCard(toyObject)
          })
      })
}

function createOneCard(toyObject) {
  const div = document.querySelector("div#toy-collection")
  const card = document.createElement("div")
  card.dataset.id = toyObject.id
  card.classList.add("card")

  card.innerHTML = `
  <h2> ${toyObject.name} </h2>
  <img src=${toyObject.image} class="toy-avatar">
  <p>  ${toyObject.likes} </p>
  <button class="like-btn">Like <3</button>
  `
  div.appendChild(card)
}