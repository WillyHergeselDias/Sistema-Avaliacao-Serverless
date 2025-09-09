document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-btn');
    const reviewInput = document.getElementById('review-input');
    const message = document.getElementById('message');
    const latestReviewContainer = document.getElementById('latest-review-container');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            rating = parseInt(star.dataset.value);
            updateStars(rating);
            submitBtn.disabled = false;
        });
    });

    function updateStars(rate) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rate) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function renderReviewCard(data) {
        const card = document.createElement('div');
        card.classList.add('review-card');

        const starsDiv = document.createElement('div');
        starsDiv.classList.add('card-stars');
        starsDiv.innerHTML = '★'.repeat(data.rating);

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('card-comment');
        commentDiv.textContent = data.review || 'Sem comentário.';

        card.appendChild(starsDiv);
        card.appendChild(commentDiv);

        if (latestReviewContainer.firstChild) {
            latestReviewContainer.insertBefore(card, latestReviewContainer.firstChild);
        } else {
            latestReviewContainer.appendChild(card);
        }
    }

    submitBtn.addEventListener('click', async () => {
        const review = reviewInput.value;
        submitBtn.disabled = true;
        message.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, review })
            });

            const result = await response.json();
            if (response.ok) {
                message.textContent = 'Obrigado por sua avaliação!';
                reviewInput.value = '';
                rating = 0;
                updateStars(0);
                renderReviewCard(result.data); // ⬅️ Chamada aqui
                setTimeout(() => {
                    message.textContent = '';
                }, 3000);
            } else {
                throw new Error(result.error || 'Erro ao enviar avaliação.');
            }
        } catch (error) {
            message.textContent = `Erro: ${error.message}`;
            submitBtn.disabled = false;
        }
    });
});
