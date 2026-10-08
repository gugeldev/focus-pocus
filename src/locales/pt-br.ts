import type { Messages } from './en';

export const ptBR: Messages = {
  popup: {
    settings: 'Configurações',
    streakTitle: 'Copiar sua sequência',
    streakLabel: 'sessões seguidas, copiar para compartilhar',
    timer: 'Cronômetro',
    customSession: 'Sessão personalizada',
    customTimeTitle: 'Definir um tempo personalizado',
    customTimeLabel: 'Tempo personalizado, como hh:mm:ss, mm:ss ou segundos',
    customTimeHint: 'Clique para personalizar',
    customTimeEditingHint: 'Enter para salvar · Esc para cancelar',
    sessionSettings: 'Configurações da sessão',
    modes: { blocklist: 'Bloqueio', allowlist: 'Permitidos' },
    start: 'Começar a focar',
    giveUp: 'Desistir',
    encouragements: [
      'Continue assim!',
      'Nunca desista!',
      'Mantenha o foco!',
      'Você consegue!',
      'Não desista!',
      'Alcance seus objetivos!',
      'Mantenha-se motivado!',
      'Você dá conta!',
    ],
  },
  options: {
    pageTitle: 'FocusPocus · Configurações',
    sections: 'Seções das configurações',
    streakTitle: 'Copie sua sequência para compartilhar',
    inARow: 'seguidas',
    support: 'Apoie o FocusPocus',
    general: {
      title: 'Geral',
      description: 'Escolha o idioma, os sons, as notificações e o bloqueio enquanto você foca.',
      locked:
        'Uma sessão de foco está em andamento. As configurações de bloqueio liberam quando ela terminar.',
      language: {
        title: 'Idioma',
        description: 'Automático segue o idioma do seu navegador.',
        auto: 'Automático',
      },
      sounds: {
        title: 'Sons',
        button: {
          label: 'Começar e desistir',
          description: 'Um clique suave ao começar ou parar uma sessão.',
        },
        victory: {
          label: 'Vitória',
          description: 'Toca quando uma sessão termina com o popup aberto.',
        },
        giveUp: {
          label: 'Desistência',
          description: 'Um lembrete de que desistir custa sua sequência.',
        },
      },
      notifications: {
        title: 'Notificações',
        finished: {
          label: 'Sessão concluída',
          description: 'Uma notificação do sistema avisando que é hora de uma pausa.',
        },
      },
      blocking: {
        title: 'Bloqueio',
        allowlistMode: {
          label: 'Modo de sites permitidos',
          description:
            'Bloqueia todos os sites, exceto os da lista de permitidos, em vez de só os da lista de bloqueio.',
        },
      },
    },
    siteList: {
      activeMode: 'Modo ativo',
      locked: 'Uma sessão de foco está em andamento. Esta lista libera quando ela terminar.',
      emptyEntry: 'Digite um site primeiro.',
      remove: (url: string) => `Remover ${url}`,
    },
    siteLists: {
      blocklist: {
        title: 'Sites bloqueados',
        description:
          'Enquanto você foca, toda página cujo endereço contém um destes é coberta pela tela de foco.',
        inputLabel: 'Site para bloquear',
        placeholder: 'youtube.com',
        addLabel: 'Bloquear',
        listLabel: 'Sites bloqueados',
        emptyTitle: 'Nada bloqueado ainda',
        emptyText:
          'Adicione os sites que roubam sua atenção, como redes sociais ou plataformas de vídeo.',
        duplicate: 'Este site já está na sua lista de bloqueio.',
      },
      allowlist: {
        title: 'Sites permitidos',
        description:
          'No modo de sites permitidos, só as páginas cujo endereço contém um destes continuam acessíveis enquanto você foca.',
        inputLabel: 'Site para permitir',
        placeholder: 'docs.google.com',
        addLabel: 'Permitir',
        listLabel: 'Sites permitidos',
        emptyTitle: 'Nada permitido ainda',
        emptyText:
          'Adicione as ferramentas de que você precisa para trabalhar, como seus documentos, editor ou plataforma de cursos.',
        duplicate: 'Este site já está na sua lista de permitidos.',
      },
    },
  },
  share: {
    starting:
      'Estou começando minha sequência na extensão FocusPocus agora! 🚀\n\nExperimente na Chrome Web Store ou na loja do Firefox',
    current: (streak: number) =>
      `Minha sequência atual na extensão FocusPocus é ${streak}! 🎯\n\nExperimente na Chrome Web Store ou na loja do Firefox`,
    copied: 'Sequência copiada para a área de transferência',
    copyFailed: 'Não foi possível copiar sua sequência.',
  },
  overlay: {
    eyebrow: 'Modo foco',
    title: 'Este site está sob um feitiço de foco',
    lead: 'Ele volta quando sua sessão terminar. Até lá, o trabalho à sua frente merece sua atenção.',
    timeLabel: 'restantes nesta sessão',
    warning: 'Desistir zera sua sequência.',
  },
  notification: {
    title: 'Sessão concluída!',
    message: 'Agora você pode fazer uma pausa!',
  },
};
