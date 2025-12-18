/// script.js - ADAPTAÇÃO COMPLETA
// Mantendo nossa funcionalidade + adaptando características da monitora

// ===== DADOS DAS CONSULTAS (Mesclado) =====
const consultationsData = [
    {
        id: 1,
        patientName: "Luciana Dias",
        age: 34,
        gender: "Feminino",
        type: "remote",
        date: "Hoje",
        time: "14:00 - 15:00",
        duration: "1 hora",
        reason: "Acompanhamento cardíaco",
        additionalInfo: "Consulta remota",
        urgent: false,
        completed: false,
        hasAudioOption: true
    },
    {
        id: 2,
        patientName: "Larissa Santana",
        age: 28,
        gender: "Feminino",
        type: "in-person",
        date: "Hoje",
        time: "16:00 - 17:00",
        duration: "1 hora",
        reason: "Check-up anual",
        additionalInfo: "Sala 201 • Consultório 3",
        urgent: true,
        completed: false,
        hasAudioOption: false
    },
    {
        id: 3,
        patientName: "Marcos Correia",
        age: 45,
        gender: "Masculino",
        type: "remote",
        date: "Hoje",
        time: "17:20 - 18:00",
        duration: "40 minutos",
        reason: "Retorno • Pressão arterial",
        additionalInfo: "Consulta remota",
        urgent: false,
        completed: false,
        hasAudioOption: true
    },
    {
        id: 4,
        patientName: "Clara Lemos",
        age: 52,
        gender: "Feminino",
        type: "remote",
        date: "Amanhã",
        time: "18:00 - 19:00",
        duration: "1 hora",
        reason: "Avaliação de exames",
        additionalInfo: "Unimed • Nacional",
        urgent: false,
        completed: false,
        hasAudioOption: true
    },
    {
        id: 5,
        patientName: "Carlos Santos",
        age: 62,
        gender: "Masculino",
        type: "in-person",
        date: "Amanhã",
        time: "09:00 - 10:00",
        duration: "1 hora",
        reason: "Exames de rotina",
        additionalInfo: "Sala 105 • Consultório 1",
        urgent: false,
        completed: false,
        hasAudioOption: false
    }
];

// ===== ESTADO DA APLICAÇÃO =====
let currentFilter = 'all';
let searchTerm = '';
let currentDateFilter = 'all';
let currentPage = 'consultas';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar consultas iniciais
    renderConsultations();
    
    // Configurar todos os event listeners
    setupEventListeners();
    setupFloatingButton();
    setupFooterNavigation();
    
    // Inicializar filtro "Hoje" como ativo
    document.querySelector('.tab-btn[data-filter="today"]')?.classList.add('ativo');
    
    console.log('MedControl inicializado com sucesso!');
});

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function setupEventListeners() {
    // Filtros por tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativo de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('ativo'));
            
            // Adicionar classe ativo ao botão clicado
            this.classList.add('ativo');
            
            // Obter o filtro diretamente do atributo data-filter
            currentFilter = this.dataset.filter;
            renderConsultations();
        });
    });
    
    // Campo de busca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase().trim();
            renderConsultations();
        });
    }
    
    // Botões de chat nas consultas
    document.addEventListener('click', function(e) {
        if (e.target.closest('.consulta__card-chat')) {
            const chatBtn = e.target.closest('.consulta__card-chat');
            const card = chatBtn.closest('.consulta__card');
            const patientName = card.querySelector('.consulta__card-paciente strong').textContent;
            openChat(patientName);
        }
    });

    // Links do índice na página de Menu
    const menuLinks = document.querySelectorAll('.menu-index-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                // Encontra o botão do rodapé correspondente e simula o clique
                const footerButton = document.querySelector(`.rodape__acao[data-page="${page}"]`);
                footerButton?.click();
            } else if (this.id === 'menu-profile-settings') {
                // Ação para um link que não é uma página principal
                showNotification('Página de Configurações (em desenvolvimento)', 'info');
            }
        });
    });
}

// ===== BOTÃO FLUTUANTE (Adaptado) =====
function setupFloatingButton() {
    const floatingBtn = document.querySelector('.botao__flutuante-cadastro');
    const floatingOverlay = document.getElementById('floating-overlay');
    const floatingMenu = document.getElementById('floating-menu');
    const homeConsultationBtn = document.getElementById('home-consultation-btn');
    const videoConsultationBtn = document.getElementById('video-consultation-btn');
    
    if (!floatingBtn) return;
    
    let isMenuOpen = false;
    
    // Alternar menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Abrir menu
            floatingOverlay.classList.add('show');
            floatingMenu.classList.add('show');
            floatingBtn.classList.add('ativo');
            document.body.style.overflow = 'hidden';
            
            // Adicionar sombra mais forte ao botão
            floatingBtn.style.boxShadow = '0px 6px 20px rgba(72, 148, 255, 0.7)';
        } else {
            closeMenu();
        }
    }
    
    // Fechar menu
    function closeMenu() {
        floatingOverlay.classList.remove('show');
        floatingMenu.classList.remove('show');
        floatingBtn.classList.remove('ativo');
        document.body.style.overflow = '';
        floatingBtn.style.boxShadow = '';
        isMenuOpen = false;
    }
    
    // Evento do botão principal
    floatingBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Evento do overlay
    floatingOverlay.addEventListener('click', closeMenu);
    
    // Evento do botão "Consulta domiciliar"
    if (homeConsultationBtn) {
        homeConsultationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
            showNewConsultationForm('home');
        });
    }
    
    // Evento do botão "Consulta por vídeo"
    if (videoConsultationBtn) {
        videoConsultationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
            showNewConsultationForm('video');
        });
    }
    
    // Fechar menu com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Prevenir fechamento ao clicar dentro do menu
    floatingMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ===== NAVEGAÇÃO DO RODAPÉ (Adaptado) =====
function setupFooterNavigation() {
    const footerButtons = document.querySelectorAll('.rodape__acao');
    
    footerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativo de todos os botões
            footerButtons.forEach(btn => btn.classList.remove('ativo'));
            
            // Adicionar classe ativo ao botão clicado
            this.classList.add('ativo');
            
            // Obter a página selecionada
            currentPage = this.dataset.page;
            
            // Simular navegação (em app real, isso mudaria o conteúdo)
            handlePageNavigation(currentPage);
        });
    });
}

// ===== RENDERIZAÇÃO DE CONSULTAS (Adaptado) =====
function renderConsultations() {
    const container = document.querySelector('.consultations-list');
    const noResults = document.getElementById('no-results');
    const hojeSection = document.querySelector('.consultas__data:first-of-type');
    const amanhaSection = document.querySelector('.consultas__data:last-of-type');
    
    if (!container) return;
    
    // Limpar apenas os cards dinâmicos, mantendo a estrutura
    const existingCards = container.querySelectorAll('.consulta__card');
    existingCards.forEach(card => card.remove());
    
    // Filtrar consultas
    const filteredConsultations = consultationsData.filter(consultation => {
        // Aplicar filtro de tipo
        if (currentFilter === 'in-person' && consultation.type !== 'in-person') return false;
        if (currentFilter === 'remote' && consultation.type !== 'remote') return false;
        if (currentFilter === 'today' && consultation.date !== 'Hoje') return false;
        if (currentFilter === 'tomorrow' && consultation.date !== 'Amanhã') return false;
        
        // Aplicar filtro de busca
        if (searchTerm) {
            const searchInName = consultation.patientName.toLowerCase().includes(searchTerm);
            const searchInReason = consultation.reason.toLowerCase().includes(searchTerm);
            const searchInInfo = consultation.additionalInfo.toLowerCase().includes(searchTerm);
            
            if (!searchInName && !searchInReason && !searchInInfo) return false;
        }
        
        return true;
    });
    
    // Verificar se há resultados
    if (filteredConsultations.length === 0) {
        if (noResults) noResults.style.display = 'block';
        // Ocultar seções sem consultas
        if (hojeSection) hojeSection.style.display = 'none';
        if (amanhaSection) amanhaSection.style.display = 'none';
        return;
    }
    
    // Esconder mensagem de nenhum resultado
    if (noResults) noResults.style.display = 'none';
    
    // Mostrar seções
    if (hojeSection) hojeSection.style.display = 'flex';
    if (amanhaSection) amanhaSection.style.display = 'flex';
    
    // Agrupar consultas por data
    const consultasHoje = filteredConsultations.filter(c => c.date === 'Hoje');
    const consultasAmanha = filteredConsultations.filter(c => c.date === 'Amanhã');
    
    // Renderizar consultas de hoje
    if (consultasHoje.length > 0 && hojeSection) {
        renderConsultationGroup(consultasHoje, container, 'first');
    }
    
    // Renderizar consultas de amanhã
    if (consultasAmanha.length > 0 && amanhaSection) {
        renderConsultationGroup(consultasAmanha, container, 'last');
    }
    
    // Adicionar event listeners aos botões das consultas
    addConsultationEventListeners();
}

// ===== RENDERIZAR GRUPO DE CONSULTAS =====
function renderConsultationGroup(consultations, container, position = 'append') {
    consultations.forEach(consultation => {
        const consultationCard = createConsultationCard(consultation);
        
        if (position === 'first' && container.firstChild) {
            container.insertBefore(consultationCard, container.firstChild.nextSibling);
        } else {
            container.appendChild(consultationCard);
        }
    });
}

// ===== CRIAR CARD DE CONSULTA (Adaptado) =====
function createConsultationCard(consultation) {
    const li = document.createElement('li');
    
    // Determinar ícone e classe baseado no tipo
    const typeIcon = consultation.type === 'remote' ? 
        '<i class="fas fa-video camera"></i>' : 
        '<i class="fas fa-map-marker-alt mapa"></i>';
    
    const typeText = consultation.type === 'remote' ? 'Consulta remota' : 'Consulta no local';
    
    // Badge urgente
    const urgentBadge = consultation.urgent ? 
        '<span class="badge badge-urgente">Urgente</span>' : '';
    
    // Determinar botões de ação
    let actionButtons = '';
    
    if (consultation.type === 'remote') {
        actionButtons = `
            <button class="btn-secundario" data-action="video-call">
                <i class="fas fa-video"></i> Ligar por vídeo
            </button>
            ${consultation.hasAudioOption ? 
                `<button class="btn-terciario" data-action="audio-call">
                    <i class="fas fa-phone"></i> Ligar por áudio
                </button>` : ''
            }
        `;
    } else {
        actionButtons = `
            <button class="btn-primario" data-action="view-address">
                <i class="fas fa-map-marker-alt"></i> Ver endereço
            </button>
            <button class="btn-terciario" data-action="details">
                <i class="fas fa-edit"></i> Detalhes
            </button>
        `;
    }
    
    li.innerHTML = `
        <div class="consulta__card" data-id="${consultation.id}">
            <div class="consulta__card-titulo">
                <div class="consulta__card-paciente">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${consultation.patientName}</strong>
                        <span>
                            <span aria-hidden="true" class="consulta-tipo">
                                ${typeIcon} ${typeText}
                            </span>
                        </span>
                        ${urgentBadge}
                    </div>
                </div>
                <button class="consulta__card-chat" data-action="chat" aria-label="Abrir chat">
                    <i class="fas fa-comment"></i>
                </button>
            </div>
            <div class="consulta__card-conteudo">
                <div class="detail-row">
                    <span class="detail-label">Horário</span>
                    <span class="detail-value">${consultation.time} (${consultation.duration})</span>
                </div>
                ${consultation.type === 'remote' ? 
                    `<div class="detail-row">
                        <span class="detail-label">Motivo</span>
                        <span class="detail-value">${consultation.reason}</span>
                    </div>` : 
                    `<div class="detail-row">
                        <span class="detail-label">Local</span>
                        <span class="detail-value">${consultation.additionalInfo}</span>
                    </div>`
                }
                <div class="consulta__card-acoes">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
    
    return li;
}

// ===== ADICIONAR EVENT LISTENERS AOS CARDS =====
function addConsultationEventListeners() {
    // Botão de chamada de vídeo
    document.querySelectorAll('[data-action="video-call"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.consulta__card');
            const patientName = card.querySelector('.consulta__card-paciente strong').textContent;
            startVideoCall(patientName);
        });
    });
    
    // Botão de chamada de áudio
    document.querySelectorAll('[data-action="audio-call"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.consulta__card');
            const patientName = card.querySelector('.consulta__card-paciente strong').textContent;
            startAudioCall(patientName);
        });
    });
    
    // Botão de ver endereço
    document.querySelectorAll('[data-action="view-address"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.consulta__card');
            const patientName = card.querySelector('.consulta__card-paciente strong').textContent;
            const address = card.querySelector('.detail-value').textContent;
            showAddress(patientName, address);
        });
    });
    
    // Botão de detalhes
    document.querySelectorAll('[data-action="details"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.consulta__card');
            const consultationId = parseInt(card.dataset.id);
            const consultation = consultationsData.find(c => c.id === consultationId);
            if (consultation) {
                showConsultationDetails(consultation);
            }
        });
    });
}

// ===== FUNÇÕES DE AÇÃO =====
function startVideoCall(patientName) {
    showNotification(`Iniciando chamada de vídeo com ${patientName}...`, 'info');
    // Em uma aplicação real, aqui integraria com WebRTC
    setTimeout(() => {
        showNotification(`Chamada de vídeo com ${patientName} em andamento`, 'success');
    }, 1000);
}

function startAudioCall(patientName) {
    showNotification(`Iniciando chamada de áudio com ${patientName}...`, 'info');
    // Em uma aplicação real, aqui integraria com WebRTC
    setTimeout(() => {
        showNotification(`Chamada de áudio com ${patientName} em andamento`, 'success');
    }, 1000);
}

function showAddress(patientName, address) {
    showNotification(`Mostrando endereço da consulta de ${patientName}: ${address}`, 'info');
    // Em uma aplicação real, aqui abriria um mapa
}

function openChat(patientName) {
    showNotification(`Abrindo chat com ${patientName}...`, 'info');
    // Em uma aplicação real, aqui abriria um sistema de chat
}

function showConsultationDetails(consultation) {
    const detailsHtml = `
        <div class="consultation-details-modal">
            <h3>Detalhes da Consulta</h3>
            <p><strong>Paciente:</strong> ${consultation.patientName}</p>
            <p><strong>Idade:</strong> ${consultation.age} anos</p>
            <p><strong>Gênero:</strong> ${consultation.gender}</p>
            <p><strong>Data:</strong> ${consultation.date}</p>
            <p><strong>Horário:</strong> ${consultation.time}</p>
            <p><strong>Duração:</strong> ${consultation.duration}</p>
            <p><strong>Motivo:</strong> ${consultation.reason}</p>
            <p><strong>Tipo:</strong> ${consultation.type === 'remote' ? 'Consulta Remota' : 'Consulta Presencial'}</p>
            <p><strong>Informações:</strong> ${consultation.additionalInfo}</p>
            ${consultation.urgent ? '<p class="urgent-notice">⚠️ Consulta Urgente</p>' : ''}
        </div>
    `;
    
    showModal('Detalhes da Consulta', detailsHtml);
}

// ===== FORMULÁRIO DE NOVA CONSULTA =====
function showNewConsultationForm(type) {
    const formTitle = type === 'home' ? 'Nova Consulta Domiciliar' : 'Nova Consulta por Vídeo';
    const typeText = type === 'home' ? 'domiciliar' : 'por vídeo';
    
    const formHtml = `
        <form id="new-consultation-form" class="consultation-form">
            <div class="form-group">
                <label for="patient-name">Nome do Paciente *</label>
                <input type="text" id="patient-name" required placeholder="Digite o nome completo">
            </div>
            
            <div class="form-group">
                <label for="patient-age">Idade *</label>
                <input type="number" id="patient-age" required min="0" max="120" placeholder="Idade">
            </div>
            
            <div class="form-group">
                <label for="consultation-date">Data da Consulta *</label>
                <input type="date" id="consultation-date" required>
            </div>
            
            <div class="form-group">
                <label for="consultation-time">Horário *</label>
                <input type="time" id="consultation-time" required>
            </div>
            
            <div class="form-group">
                <label for="consultation-reason">Motivo da Consulta *</label>
                <textarea id="consultation-reason" required placeholder="Descreva o motivo da consulta"></textarea>
            </div>
            
            <input type="hidden" id="consultation-type" value="${type}">
            
            <div class="form-actions">
                <button type="button" class="btn-terciario" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primario">Agendar Consulta</button>
            </div>
        </form>
    `;
    
    showModal(formTitle, formHtml);
    
    // Preencher data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('consultation-date').value = today;
    
    // Configurar envio do formulário
    const form = document.getElementById('new-consultation-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitNewConsultation(type);
        });
    }
}

function submitNewConsultation(type) {
    const patientName = document.getElementById('patient-name').value;
    const consultationDate = document.getElementById('consultation-date').value;
    const consultationTime = document.getElementById('consultation-time').value;
    
    if (!patientName || !consultationDate || !consultationTime) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Formatar data
    const dateObj = new Date(consultationDate);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    
    // Criar nova consulta
    const newConsultation = {
        id: consultationsData.length + 1,
        patientName: patientName,
        age: parseInt(document.getElementById('patient-age').value) || 30,
        gender: "Não informado",
        type: type === 'home' ? 'in-person' : 'remote',
        date: "Amanhã", // Para demonstração
        time: `${consultationTime} - ${addHour(consultationTime)}`,
        duration: "1 hora",
        reason: document.getElementById('consultation-reason').value || "Consulta agendada",
        additionalInfo: type === 'home' ? "Endereço a confirmar" : "Consulta remota",
        urgent: false,
        completed: false,
        hasAudioOption: type !== 'home'
    };
    
    // Adicionar à lista
    consultationsData.push(newConsultation);
    
    // Fechar modal
    closeModal();
    
    // Mostrar notificação
    showNotification(`Consulta ${type === 'home' ? 'domiciliar' : 'por vídeo'} agendada para ${patientName}!`, 'success');
    
    // Atualizar lista
    setTimeout(() => {
        renderConsultations();
    }, 500);
}

// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
function handlePageNavigation(page) {
    const mainContent = document.querySelector('main');
    const filtersContainer = document.querySelector('.filters-container');
    const consultasSection = document.querySelector('.consultas');
    const clientesPage = document.getElementById('clientes-page');
    const relatoriosPage = document.getElementById('relatorios-page');
    const menuPage = document.getElementById('menu-page');
    const desktopForm = document.getElementById('desktop-form-section');

    // Esconde todas as seções principais e os filtros
    [consultasSection, clientesPage, relatoriosPage, menuPage].forEach(section => {
        if (section) section.classList.add('hidden');
    });
    if (filtersContainer) filtersContainer.style.display = 'none';
    if (desktopForm) desktopForm.classList.add('hidden'); // Esconde o form por padrão

    // Adiciona classe ao main para ajustar o grid no desktop
    mainContent.classList.add('show-page');
    
    // Mostra a seção correta
    switch(page) {
        case 'consultas':
            if (consultasSection) consultasSection.classList.remove('hidden');
            if (filtersContainer) filtersContainer.style.display = 'flex';
            if (desktopForm) desktopForm.classList.remove('hidden'); // Mostra o form na pág de consultas
            // Remove a classe do main para reexibir o formulário no desktop
            mainContent.classList.remove('show-page');
            break;
            
        case 'clientes':
            if (clientesPage) clientesPage.classList.remove('hidden');
            break;
            
        case 'relatorios':
            if (relatoriosPage) relatoriosPage.classList.remove('hidden');
            break;
            
        case 'menu':
            if (menuPage) menuPage.classList.remove('hidden');
            break;
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====
function addHour(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    let newHours = hours + 1;
    if (newHours >= 24) newHours -= 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'error' ? '#FF6B6B' : type === 'success' ? '#00C851' : '#4894FF'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Adicionar estilos de animação
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showModal(title, content) {
    // Remover modal anterior se existir
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();
    
    // Criar modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Estilos do modal
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = modalOverlay.querySelector('.modal');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        animation: slideUp 0.3s ease;
    `;
    
    const modalHeader = modalOverlay.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #ECECEC;
    `;
    
    modalHeader.querySelector('h3').style.cssText = `
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #464646;
    `;
    
    const closeBtn = modalOverlay.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #A3A3A3;
        line-height: 1;
        padding: 0;
    `;
    
    const modalContent = modalOverlay.querySelector('.modal-content');
    modalContent.style.cssText = `
        padding: 20px;
    `;
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    document.body.appendChild(modalOverlay);
    
    // Adicionar estilos de animação
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .consultation-form .form-group {
                margin-bottom: 16px;
            }
            
            .consultation-form label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                color: #464646;
                margin-bottom: 6px;
            }
            
            .consultation-form input,
            .consultation-form textarea,
            .consultation-form select {
                width: 100%;
                padding: 12px;
                border: 1px solid #ECECEC;
                border-radius: 8px;
                font-size: 14px;
                font-family: 'Montserrat', sans-serif;
            }
            
            .consultation-form textarea {
                min-height: 100px;
                resize: vertical;
            }
            
            .form-actions {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            
            .form-actions button {
                flex: 1;
                padding: 12px;
            }
            
            .urgent-notice {
                color: #FF6B6B;
                font-weight: 600;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== INICIALIZAR ANIMAÇÕES =====
if (!document.querySelector('#app-animations')) {
    const style = document.createElement('style');
    style.id = 'app-animations';
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .consulta__card {
            animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== FUNÇÕES DE DEBUG (remover em produção) =====
window.debug = {
    showAllConsultations: function() {
        console.log('Consultas disponíveis:', consultationsData);
        currentFilter = 'all';
        renderConsultations();
    },
    
    addTestConsultation: function() {
        const testConsultation = {
            id: consultationsData.length + 1,
            patientName: "Paciente Teste",
            age: 30,
            gender: "Masculino",
            type: "remote",
            date: "Hoje",
            time: "19:00 - 20:00",
            duration: "1 hora",
            reason: "Consulta de teste",
            additionalInfo: "Teste do sistema",
            urgent: false,
            completed: false,
            hasAudioOption: true
        };
        
        consultationsData.push(testConsultation);
        renderConsultations();
        showNotification('Consulta teste adicionada!', 'success');
    },
    
    clearFilters: function() {
        currentFilter = 'all';
        searchTerm = '';
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('ativo'));
        
        renderConsultations();
        showNotification('Filtros limpos', 'info');
    }
};

console.log('Script.js carregado com sucesso!');