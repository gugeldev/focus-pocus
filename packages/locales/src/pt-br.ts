import type { Messages } from './en';

export const ptBR: Messages = {
  popup: {
    settings: 'Configurações',
    streakTitle: 'Copiar sua sequência',
    streakLabel: 'sessões seguidas, copiar para compartilhar',
    timer: 'Temporizador',
    customSession: 'Sessão personalizada',
    customTimeTitle: 'Definir um tempo personalizado',
    customTimeLabel: 'Tempo personalizado, como hh:mm:ss, mm:ss ou segundos',
    customTimeHint: 'Clique para personalizar',
    customTimeEditingHint: 'Enter salva · Esc cancela',
    sessionSettings: 'Configurações da sessão',
    modes: { blocklist: 'Bloqueados', allowlist: 'Permitidos' },
    start: 'Começar a focar',
    /** Start focusing while it waits for the confirming click (No giving up is on). */
    confirmStart: 'Clique de novo para começar',
    giveUp: 'Desistir',
    /** The Give up button while it waits for the confirming click. */
    confirmGiveUp: 'Clique de novo para desistir',
    /** Shown instead of Give up during a session when No giving up is on. */
    noGiveUp: 'Sem desistir. Vá até o fim!',
    encouragements: [
      'Continue assim!',
      'Nunca desista!',
      'Mantenha o foco!',
      'Você consegue!',
      'Não desista!',
      'Foco nos objetivos!',
      'Mantenha-se motivado!',
      'Você dá conta!',
    ],
  },
  options: {
    pageTitle: 'FocusPocus · Configurações',
    sections: 'Seções das configurações',
    streakTitle: 'Copie sua sequência para compartilhar',
    inARow: 'em sequência',
    general: {
      title: 'Geral',
      description:
        'Escolha a aparência, o idioma, os sons, as notificações e o bloqueio enquanto você foca.',
      locked:
        'Uma sessão de foco está em andamento. As configurações de sessão e de bloqueio são liberadas quando ela terminar.',
      language: {
        title: 'Idioma',
        description: 'Automático segue o idioma do seu navegador.',
        auto: 'Automático',
      },
      appearance: {
        title: 'Aparência',
        description: 'Automático segue o modo claro ou escuro do seu sistema.',
        auto: 'Automático',
        light: 'Claro',
        dark: 'Escuro',
      },
      sounds: {
        title: 'Sons',
        button: {
          label: 'Começar e desistir',
          description: 'Um clique suave ao começar ou parar uma sessão.',
        },
        victory: {
          label: 'Vitória',
          description: 'Toca quando uma sessão termina com a janela da extensão aberta.',
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
      session: {
        title: 'Sessão',
        noGiveUp: {
          label: 'Sem desistência',
          description:
            'Esconde o botão Desistir enquanto você foca. Começar pede um segundo clique, porque depois não tem volta.',
        },
      },
      blocking: {
        title: 'Bloqueio',
        allowlistMode: {
          label: 'Modo de sites permitidos',
          description:
            'Bloqueia todos os sites, exceto os sites permitidos, em vez de só os sites bloqueados.',
        },
      },
    },
    siteList: {
      activeMode: 'Modo ativo',
      locked:
        'Uma sessão de foco está em andamento. Esta lista é liberada quando a sessão terminar.',
      emptyEntry: 'Digite um site primeiro.',
      remove: (url: string) => `Remover ${url}`,
    },
    siteLists: {
      blocklist: {
        title: 'Sites bloqueados',
        description:
          'Enquanto você foca, toda página cujo endereço contenha um destes termos é coberta pela tela de foco.',
        inputLabel: 'Site para bloquear',
        placeholder: 'youtube.com',
        addLabel: 'Bloquear',
        listLabel: 'Sites bloqueados',
        emptyTitle: 'Nada bloqueado ainda',
        emptyText:
          'Adicione os sites que roubam sua atenção, como redes sociais ou plataformas de vídeo.',
        duplicate: 'Este site já está nos seus sites bloqueados.',
      },
      allowlist: {
        title: 'Sites permitidos',
        description:
          'No modo de sites permitidos, só as páginas cujo endereço contenha um destes termos continuam acessíveis enquanto você foca.',
        inputLabel: 'Site para permitir',
        placeholder: 'docs.google.com',
        addLabel: 'Permitir',
        listLabel: 'Sites permitidos',
        emptyTitle: 'Nada permitido ainda',
        emptyText:
          'Adicione as ferramentas de que você precisa para trabalhar, como seus documentos, editor ou plataforma de cursos.',
        duplicate: 'Este site já está nos seus sites permitidos.',
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
    giveUp: 'Desistir',
    confirmGiveUp: 'Clique de novo para desistir',
    noGiveUp: 'Desistir está desligado nesta sessão. Aguenta firme.',
  },
  welcome: {
    title: 'Boas-vindas ao FocusPocus',
    lead: 'Escolha os sites que tiram sua atenção. Enquanto uma sessão de foco roda, eles ficam cobertos pela tela de foco.',
    sitesTitle: 'Sites sugeridos',
    sitesHint: 'Você pode mudar seus sites bloqueados quando quiser nas configurações.',
    block: (count: number) => (count === 1 ? 'Bloquear 1 site' : `Bloquear ${count} sites`),
    pickOne: 'Escolha um site para bloquear',
    skip: 'Pular por agora',
    doneTitle: 'Tudo pronto',
    doneText: (count: number) =>
      count === 0
        ? 'Sua lista de bloqueio está vazia por enquanto. Adicione sites quando quiser.'
        : `${count === 1 ? '1 site está' : `${count} sites estão`} na sua lista de bloqueio.`,
    pinTip:
      'Abra o FocusPocus pela barra de ferramentas para começar sua primeira sessão. Fixe-o pelo menu de extensões para deixá-lo a um clique.',
    openSettings: 'Abrir configurações',
  },
  notification: {
    title: 'Sessão concluída!',
    message: 'Agora você pode fazer uma pausa!',
  },
};
