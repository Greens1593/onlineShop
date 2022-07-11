
const renderCard = card => {
        if(card.courses.length){
            const html = card.courses.map(c => {
                return `
<tr>

<td>${c.title}</td>
<td>
<a class="waves-effect waves-teal btn-flat material-icons" data-id="${c.id}">arrow_drop_up</a>
<br>
<a class="counter"> ${c.count} </a>
<br>
<a class="waves-effect waves-teal btn-flat material-icons" data-id="${c.id}">arrow_drop_down</a>
</td>
<td>
    <form action="/card/delete" method="post">
    <input type="hidden" name="id" value="${c.id}">
    <button class="btn btn-small">Удалить</button>
    </form>
</td>
</tr>`
            }).join('')
            $card.querySelector('tbody').innerHTML = html
            $card.querySelector('.price').textContent = toCurrensy(card.price)
        } else{
            $card.innerHTML = '<p> Корзина пуста </p>'
        }
}

const toCurrensy = price =>{
    return new Intl.NumberFormat('uk', {
        style: 'currency',
        currency: 'UAH',
    }).format(price)
}
document.querySelectorAll('.price').forEach(node =>{
    node.textContent = toCurrensy(node.textContent)
})

const $card = document.querySelector('#card')
if ($card){
    $card.addEventListener('click', event =>{
        if(event.target.classList.contains('material-icons')){
            const id = event.target.dataset.id;
            const plusOrMinus = event.target.textContent;
            if(plusOrMinus === 'arrow_drop_down'){
                fetch('/card/remove/' + id, {
                    method: 'delete'
                }).then(res => res.json())
                .then(card => renderCard(card))
            } 
            else if (plusOrMinus === 'arrow_drop_up') {
                fetch('card/counter-plus', {
                    method: 'POST',
                    headers: new Headers({
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    }),
                    mode: 'same-origin',
                    body: JSON.stringify({ id: id })
                })
                .then(res => res.json())
                .then(card => renderCard(card))
            }}})
            }