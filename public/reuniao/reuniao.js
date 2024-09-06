document.addEventListener('DOMContentLoaded', function() {
    // Obtendo os elementos do DOM
    const meetingForm = document.getElementById('meeting-form');
    const cancelFormButton = document.getElementById('cancel-form');
    const consultFormButton = document.getElementById('consult-form');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const messageInput = document.getElementById('message-input');

    // Verificação para garantir que o formulário de reunião existe antes de adicionar o event listener
    if (meetingForm) {
        meetingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const date = document.getElementById('data').value;
            const time = document.getElementById('horario').value;
            const duration = document.getElementById('duracao').value;
            const sector = document.getElementById('setor').value;
            const speaker = document.getElementById('nome-orador').value;
            const room = document.getElementById('sala').value;
            const client = document.getElementById('cliente').value;

            if (isPastTime(date, time)) {
                alert("Não é possível agendar uma reunião para um horário que já passou.");
                return;
            }

            if (!validateInput(date, time, duration, sector, speaker, room, client)) {
                alert("Por favor, preencha todos os campos corretamente.");
                return;
            }

            fetch('/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, time, duration, sector, speaker, room, client })
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocorreu um erro ao agendar a reunião. Por favor, tente novamente.');
            });
        });
    }

    // Verificando se o botão de cancelar existe antes de adicionar o event listener
    if (cancelFormButton) {
        cancelFormButton.addEventListener('click', function() {
            toggleCancelForm();
        });
    }

    // Verificando se o botão de consulta existe antes de adicionar o event listener
    if (consultFormButton) {
        consultFormButton.addEventListener('click', function() {
            toggleConsultForm();
        });
    }

    // Verificando se o input de mensagem existe antes de adicionar o event listener
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            adjustInputHeight();
        });
    }

    // Verifica se o botão de logout existe e, se sim, adiciona o event listener
    if (confirmLogoutButton) {
        document.getElementById('logout-button').addEventListener('click', function(event) {
            event.preventDefault();
            confirmLogoutButton.classList.add('open');
        });
    }

    // Funções auxiliares

    function isPastTime(date, time) {
        const now = new Date();
        const meetingTime = new Date(`${date}T${time}`);
        return meetingTime < now;
    }

    function validateInput(date, time, duration, sector, speaker, room, client) {
        return date && time && duration && sector && speaker && room && client;
    }

    function toggleCancelForm() {
        const cancelForm = document.getElementById('cancel-form');
        if (cancelForm) {
            cancelForm.style.display = cancelForm.style.display === 'block' ? 'none' : 'block';
            if (cancelForm.style.display === 'block') {
                loadMeetings();
            }
        }
    }

    function toggleConsultForm() {
        const consultForm = document.getElementById('consult-form');
        if (consultForm) {
            consultForm.style.display = consultForm.style.display === 'block' ? 'none' : 'block';
        }
    }

    function loadMeetings() {
        const filterDate = document.getElementById('filtro-data').value;
        const filterClient = document.getElementById('filtro-cliente').value;

        const params = new URLSearchParams({ date: filterDate, client: filterClient });

        fetch(`/consultar?${params.toString()}`)
        .then(response => response.json())
        .then(meetings => {
            const meetingList = document.getElementById('meeting-list');
            meetingList.innerHTML = '';
            meetings.forEach(meeting => {
                const li = document.createElement('li');
                li.textContent = `${meeting.date} - ${meeting.time} - ${meeting.speaker} - ${meeting.room}`;
                li.setAttribute('data-id', meeting.id);
                li.addEventListener('click', function() {
                    if (confirm('Você tem certeza que deseja cancelar esta reunião?')) {
                        cancelMeeting(meeting.id);
                    }
                });
                meetingList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocorreu um erro ao carregar as reuniões. Por favor, tente novamente.');
        });
    }

    function cancelMeeting(id) {
        fetch('/cancelar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            loadMeetings();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocorreu um erro ao cancelar a reunião. Por favor, tente novamente.');
        });
    }

    function adjustInputHeight() {
        if (messageInput) {
            messageInput.style.height = 'auto';
            messageInput.style.height = (messageInput.scrollHeight) + 'px';
        }
    }
});
