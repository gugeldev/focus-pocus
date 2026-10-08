import type { Messages } from './en';

export const es: Messages = {
  popup: {
    settings: 'Configuración',
    streakTitle: 'Copiar tu racha',
    streakLabel: 'sesiones seguidas, copiar para compartir',
    timer: 'Temporizador',
    customSession: 'Sesión personalizada',
    customTimeTitle: 'Definir un tiempo personalizado',
    customTimeLabel: 'Tiempo personalizado, como hh:mm:ss, mm:ss o segundos',
    customTimeHint: 'Haz clic para personalizar',
    customTimeEditingHint: 'Enter guarda · Esc cancela',
    sessionSettings: 'Configuración de la sesión',
    modes: { blocklist: 'Bloqueados', allowlist: 'Permitidos' },
    start: 'Empezar a concentrarme',
    giveUp: 'Rendirme',
    encouragements: [
      '¡Sigue así!',
      '¡Nunca te rindas!',
      '¡Sigue concentrado!',
      '¡Tú puedes!',
      '¡No te rindas!',
      '¡Por tus metas!',
      '¡Mantente motivado!',
      '¡Vas muy bien!',
    ],
  },
  options: {
    pageTitle: 'FocusPocus · Configuración',
    sections: 'Secciones de la configuración',
    streakTitle: 'Copia tu racha para compartirla',
    inARow: 'al hilo',
    support: 'Apoya a FocusPocus',
    general: {
      title: 'General',
      description:
        'Elige el idioma, los sonidos, las notificaciones y el bloqueo mientras te concentras.',
      locked:
        'Hay una sesión de concentración en curso. La configuración de bloqueo se desbloquea cuando termine.',
      language: {
        title: 'Idioma',
        description: 'Automático sigue el idioma de tu navegador.',
        auto: 'Automático',
      },
      sounds: {
        title: 'Sonidos',
        button: {
          label: 'Empezar y rendirse',
          description: 'Un clic suave al empezar o detener una sesión.',
        },
        victory: {
          label: 'Victoria',
          description: 'Suena cuando una sesión termina con la ventana de la extensión abierta.',
        },
        giveUp: {
          label: 'Rendirse',
          description: 'Un recordatorio de que rendirte te cuesta la racha.',
        },
      },
      notifications: {
        title: 'Notificaciones',
        finished: {
          label: 'Sesión terminada',
          description: 'Una notificación del sistema que te avisa que es hora de un descanso.',
        },
      },
      blocking: {
        title: 'Bloqueo',
        allowlistMode: {
          label: 'Modo de sitios permitidos',
          description:
            'Bloquea todos los sitios excepto los sitios permitidos, en lugar de solo los sitios bloqueados.',
        },
      },
    },
    siteList: {
      activeMode: 'Modo activo',
      locked: 'Hay una sesión de concentración en curso. Esta lista se desbloquea cuando termine.',
      emptyEntry: 'Escribe un sitio primero.',
      remove: (url: string) => `Quitar ${url}`,
    },
    siteLists: {
      blocklist: {
        title: 'Sitios bloqueados',
        description:
          'Mientras te concentras, toda página cuya dirección contenga uno de estos términos queda cubierta por la pantalla de concentración.',
        inputLabel: 'Sitio para bloquear',
        placeholder: 'youtube.com',
        addLabel: 'Bloquear',
        listLabel: 'Sitios bloqueados',
        emptyTitle: 'Nada bloqueado todavía',
        emptyText:
          'Agrega los sitios que te roban la atención, como redes sociales o plataformas de video.',
        duplicate: 'Este sitio ya está en tus sitios bloqueados.',
      },
      allowlist: {
        title: 'Sitios permitidos',
        description:
          'En el modo de sitios permitidos, solo las páginas cuya dirección contenga uno de estos términos siguen accesibles mientras te concentras.',
        inputLabel: 'Sitio para permitir',
        placeholder: 'docs.google.com',
        addLabel: 'Permitir',
        listLabel: 'Sitios permitidos',
        emptyTitle: 'Nada permitido todavía',
        emptyText:
          'Agrega las herramientas que necesitas para trabajar, como tus documentos, tu editor o tu plataforma de cursos.',
        duplicate: 'Este sitio ya está en tus sitios permitidos.',
      },
    },
  },
  share: {
    starting:
      '¡Estoy empezando mi racha en la extensión FocusPocus ahora! 🚀\n\nPruébala en la Chrome Web Store o en la tienda de Firefox',
    current: (streak: number) =>
      `¡Mi racha actual en la extensión FocusPocus es de ${streak}! 🎯\n\nPruébala en la Chrome Web Store o en la tienda de Firefox`,
    copied: 'Racha copiada al portapapeles',
    copyFailed: 'No se pudo copiar tu racha.',
  },
  overlay: {
    eyebrow: 'Modo concentración',
    title: 'Este sitio está bajo un hechizo de concentración',
    lead: 'Volverá cuando termine tu sesión. Hasta entonces, el trabajo que tienes delante merece tu atención.',
    timeLabel: 'restantes en esta sesión',
    warning: 'Rendirte reinicia tu racha.',
  },
  notification: {
    title: '¡Sesión terminada!',
    message: '¡Ahora puedes tomar un descanso!',
  },
};
