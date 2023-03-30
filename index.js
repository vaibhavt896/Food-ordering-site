import { menuArray } from './data.js'

const payModal = document.querySelector('#modal')
const bodyEl = document.querySelector('body')
let isModalOpen = false
const openModalEl = document.getElementsByClassName('open-modal')[0];
const orderMenuEl = document.getElementById('order-menu')
let menuList = ''
let orderCount = 0
let orderEl = document.querySelector('#complete-order .container')
let totalPrice = 0
let orderItemEl = ''
let orderedItems = ''
let orderForm = ''
const emptyOrderEl = `
  <div class="order-condition order-empty">
    <p>Please add your meal for removing your fits of hunger.</p>
  </div>
`

function renderMenu() {
  menuArray.forEach(menu => {
    menuList += `
      <div class="container">
        <div class="order">
          <div class="order-item">
            <p class="item-emoji">${menu.emoji}</p>
          </div>
          <div class="order-details">
            <h2>${menu.name}</h2>
            <p>${menu.ingredients.toString().split(',').join(', ')}</p>
            <p class="order-price">$${menu.price}</p>
          </div>
          <div class="order-add">
            <button class="btn-add">
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.83949 13.8068V0.011363H8.16903V13.8068H6.83949ZM0.612216 7.57955V6.23864H14.3963V7.57955H0.612216Z" fill="#3C3C3C"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `
  })
  
  orderMenuEl.innerHTML = menuList
  orderEl.innerHTML = emptyOrderEl
}

renderMenu()

document.querySelectorAll('.btn-add').forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    
    orderCount++
    let clickedEl = menuArray[index]
    totalPrice += clickedEl.price

    orderItemEl += `
      <div class="order-item ordered-item">
        <h2>${clickedEl.name} <button class="remove-order">-</button></h2>
        <p>$${clickedEl.price}</p>
      </div>
    `
    orderEl.innerHTML = `
      <h2>Your order</h2>
      <div class="order-items">
        ${orderItemEl}
        <div class="order-item total-price">
          <h2>Total price:</h2>
           <p>$ ${ totalPrice }</p>
        </div>
      </div>
      <button class="btn btn-normal" id="order-btn">Order</button>
    `
    removeOrderItem()
    checkOrderBtnClick()
  })
})

function removeOrderItem() {
  const removeBtns = document.querySelectorAll('.remove-order')
  orderedItems = document.querySelectorAll('.ordered-item')

  removeBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {

      orderCount--

      let removedItem = orderedItems[index]
      let removedItemPrice = removedItem.querySelector('p').innerText.substring(1)
      removedItemPrice = Number(removedItemPrice)

      totalPrice -= removedItemPrice
      orderedItems[index].remove()
      
      const totalPriceEl = document.querySelector('.total-price p')
      totalPriceEl.innerHTML = `$${totalPrice}`

      orderItemEl = ''
      const items = document.querySelectorAll('.ordered-item')
      for (let i = 0; i < items.length; i++) {
        orderItemEl += `
          <div class="order-item ordered-item">
            ${items[i].innerHTML}
          </div>
        `
      }

      if (!orderCount) {
        orderItemEl = ''
        totalPrice = 0
        orderEl.innerHTML = emptyOrderEl
      }

    })
  })
}

// MODAL OPEN CLOSE
function checkOrderBtnClick() {
  const orderBtn = document.getElementById('order-btn')
  if (!isModalOpen && orderBtn) {
    orderBtn.addEventListener('click', () => {
      payModal.classList.remove('d-none')
      bodyEl.classList.add('modal-open')
      isModalOpen = true
      setTimeout(() => {
        checkOpenModal()
      }, 100);
    })
  }
}

function checkOpenModal() {
  if (isModalOpen) {
    document.addEventListener('click', closeModal)
    orderForm = document.getElementById('order-form')
    orderForm.addEventListener('submit', submitForm)
  }
}
function submitForm(e) {
  e.preventDefault()

  const orderFormData = new FormData(orderForm)
  const fullName = orderFormData.get('fullName')
setTimeout(()=>{orderEl.innerHTML = `
  
    <div class="order-condition order-success">
    
      <p>Thanks, ${fullName}! Your order is on its way!........</p>
    </div>
  `},2000)
  
  orderItemEl = ''
  orderCount = 0
  totalPrice = 0
  resetModalInputs()
  orderForm.removeEventListener('submit', submitForm)
}

function closeModal (event) {
  const self = event.target.closest('.modal-container');
  if (!self) {
    resetModalInputs()
    document.removeEventListener('click', closeModal)
    setTimeout(() => {
      checkOrderBtnClick()
    }, 100);
  }
}

function resetModalInputs() {
  openModalEl.classList.add('d-none')
  bodyEl.classList.remove('modal-open')
  isModalOpen = false
  orderForm.reset()
}
