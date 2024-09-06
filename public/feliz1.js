document.addEventListener('DOMContentLoaded', function() {
  const socket = io();  // Inicializa o socket.io

  const messageInput = document.getElementById('message-input');
  const conversationBoard = document.getElementById('conversation-board');
  const userModal = document.getElementById('user-modal');
  const closeButton = document.querySelector('.close-button');
  const saveUserInfoButton = document.getElementById('save-user-info');
  const userNameInput = document.getElementById('user-name');
  const userPhotoInput = document.getElementById('user-photo');
  const configButton = document.getElementById('config-button');
  const errorMsg = document.createElement('p');

  let userName = localStorage.getItem('userName') || '';
  let userPhoto = localStorage.getItem('userPhoto') || '';

  const defaultPhoto = 'url_para_imagem_padrao'; // Adicione a URL da imagem padrão aqui

  // Função para abrir o modal
  function openModal() {
    userModal.style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    userModal.style.display = 'none';
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }

  // Função para salvar as informações do usuário
  function saveUserInfo() {
    userName = userNameInput.value.trim();
    if (!userName) {
      alert('Por favor, insira seu nome.');
      return;
    }
    const file = userPhotoInput.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/jpg'];
      if (!validImageTypes.includes(file.type)) {
        errorMsg.textContent = 'Imagem não suportada. Por favor, escolha uma imagem JPEG ou JPG.';
        errorMsg.style.color = 'red';
        userModal.appendChild(errorMsg);
        return;
      }
      const reader = new FileReader();
      reader.onload = function(event) {
        userPhoto = event.target.result;
        localStorage.setItem('userPhoto', userPhoto);
        console.log('Imagem carregada com sucesso:', userPhoto); // Log da imagem carregada
        closeModal();
      };
      reader.onerror = function(error) {
        console.error('Erro ao carregar a imagem:', error); // Log de erro
      };
      reader.readAsDataURL(file);
    } else {
      userPhoto = defaultPhoto;
      localStorage.setItem('userPhoto', userPhoto);
      closeModal();
    }
    localStorage.setItem('userName', userName);
  }

  // Função para ajustar a altura do input
  function adjustInputHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
  }

  // Função para adicionar a mensagem ao quadro de conversação
  function addMessageToBoard(message, name, photo) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const img = document.createElement('img');
    img.src = photo || defaultPhoto;
    messageElement.appendChild(img);

    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';

    const nameElement = document.createElement('div');
    nameElement.className = 'name';
    nameElement.innerText = name || userName;

    const textElement = document.createElement('span');
    textElement.innerText = message;

    contentElement.appendChild(nameElement);
    contentElement.appendChild(textElement);
    messageElement.appendChild(contentElement);

    conversationBoard.appendChild(messageElement);
    conversationBoard.scrollTop = conversationBoard.scrollHeight; // Auto-scroll para a última mensagem
  }

  // Função para enviar mensagem
  function sendMessage(message) {
    const msg = {
      name: userName,
      photo: userPhoto,
      text: message
    };
    socket.emit('chat message', msg); // Envia a mensagem para o servidor
  }

  // Função para adicionar mensagens antigas ao quadro de conversação
  function addPreviousMessages(messages) {
    messages.forEach(msg => addMessageToBoard(msg.text, msg.name, msg.photo));
  }

  // Recebe mensagens anteriores do servidor
  socket.on('previous messages', function(messages) {
    addPreviousMessages(messages);
  });

  // Recebe mensagens do servidor
  socket.on('chat message', function(msg) {
    addMessageToBoard(msg.text, msg.name, msg.photo);
  });

  // Função para ler o arquivo Excel e filtrar aniversariantes
  async function fetchBirthdays() {
    try {
      const response = await fetch('/feliz1/ANIVERSARIANTE.xlsx'); // Certifique-se de que o caminho está correto
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Dados lidos do Excel:', jsonData); // Log para verificar os dados lidos

      const currentMonth = new Date().getMonth() + 1; // Janeiro é 0, então somamos 1

      const birthdays = jsonData.filter(row => {
        console.log(`Verificando ${row.Nome}: Mês - ${row['Mês']} | Dia - ${row['Dia']}`);
        return parseInt(row['Mês']) === currentMonth;
      });

      console.log('Aniversariantes do mês:', birthdays); // Log para verificar os aniversariantes filtrados

      displayBirthdays(birthdays);
    } catch (error) {
      console.error('Error fetching or processing the Excel file:', error);
    }
  }

  function displayBirthdays(birthdays) {
    const birthdaysDiv = document.getElementById('birthdays');
    if (birthdays.length > 0) {
      birthdaysDiv.innerHTML = birthdays.map(b => `${b.Nome} - ${b.Dia}/${b.Mês}`).join('<br>');
    } else {
      birthdaysDiv.innerHTML = 'Nenhum aniversariante este mês.';
    }
  }

  fetchBirthdays();

  // Eventos
  messageInput.addEventListener('focus', function() {
    if (!userName || !userPhoto) {
      openModal();
    }
  });

  messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const message = messageInput.value.trim();
      if (message && userName && userPhoto) {
        sendMessage(message); // Envia a mensagem para o servidor
        messageInput.value = '';
        adjustInputHeight();
      } else {
        openModal();
      }
    }
  });

  messageInput.addEventListener('input', function() {
    adjustInputHeight();
  });

  closeButton.addEventListener('click', closeModal);
  saveUserInfoButton.addEventListener('click', function() {
    saveUserInfo();
    if (userName) {
      messageInput.focus();
    }
  });

  configButton.addEventListener('click', openModal);

  // Função para criar a animação de fogos de artifício
  function createFirework(x, y) {
    const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const burst = new mojs.Burst({
      left: x,
      top: y,
      radius: { 4: 32 },
      count: 14,
      children: {
        shape: 'circle',
        radius: { 4: 0 },
        fill: [chosenColor],
        strokeWidth: 1,
        duration: 2000,
        easing: 'cubic.out',
      },
    });

    burst.play();
  }

  // Função para gerar fogos de artifício aleatórios
  function randomFireworks() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createFirework(x, y);
  }

  // Adiciona a animação de fogos de artifício ao clicar com o mouse
  document.addEventListener('click', function(e) {
    createFirework(e.pageX, e.pageY);
  });

  // Gera fogos de artifício aleatórios a cada 2 segundos
  setInterval(randomFireworks, 2000);
});
