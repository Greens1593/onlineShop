
const renderCard = (card) => {
        if(card.courses.length){
            const csrf = card.csrf
            const html = card.courses.map(c => {
                return `
<tr>

<td>${c.title}</td>
<td>
<a class="waves-effect waves-teal btn-flat material-icons" data-id="${c.id}" data-csrf="${csrf}">arrow_drop_up</a>
<br>
<a class="counter"> ${c.count} </a>
<br>
<a class="waves-effect waves-teal btn-flat material-icons" data-id="${c.id}" data-csrf="${csrf}">arrow_drop_down</a>
</td>
<td>
    <form action="/card/delete" method="post">
    <input type="hidden" name="id" value="${c.id}">
    <input type="hidden" name="_csrf" value="${csrf}">
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

const toDate = date => {
    return new Intl.DateTimeFormat('uk', {
        day: '2-digit',
        month: 'long',
        year: "numeric",
        hour: "2-digit",
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node =>{
    node.textContent = toCurrensy(node.textContent)
})

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card')
if ($card){
    $card.addEventListener('click', event =>{
        if(event.target.classList.contains('material-icons')){
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            const plusOrMinus = event.target.textContent;
            if(plusOrMinus === 'arrow_drop_down'){
                fetch('/card/remove/' + id, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csrf,
                    }
                }).then(res => res.json())
                .then(card => renderCard(card))
            } 
            else if (plusOrMinus === 'arrow_drop_up') {
                fetch('card/counter-plus', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      'X-XSRF-TOKEN': csrf,
                    },
                    mode: 'same-origin',
                    body: JSON.stringify({ id: id })
                })
                .then(res => res.json())
                .then(card => renderCard(card))
            }}})
            }

M.Tabs.init(document.querySelectorAll('.tabs'))