import type { SiteCopy } from './en';

export const es: SiteCopy = {
  meta: {
    title: 'FocusPocus: bloquea distracciones y mantén el foco',
    description:
      'Una extensión gratuita y de código abierto para Chrome y Firefox. Inicia un temporizador de concentración y los sitios que roban tu atención quedan bloqueados hasta que termine.',
  },
  nav: {
    home: 'FocusPocus, inicio',
    reviews: 'Reseñas',
    focusScreen: 'Pantalla de concentración',
    features: 'Funciones',
    github: 'GitHub',
    install: 'Instalar',
  },
  stores: {
    chrome: 'Añadir a Chrome',
    firefox: 'Añadir a Firefox',
  },
  hero: {
    titleLead: 'Mantén el foco',
    titleAccent: 'como bajo un hechizo',
    lead: 'Una extensión que bloquea los sitios que te distraen mientras corre tu temporizador.',
  },
  focusScreen: {
    eyebrow: 'Pantalla de concentración',
    title: 'Un sitio bloqueado espera a que termines',
    intro:
      'Abre un sitio bloqueado durante una sesión y lo cubre la pantalla de concentración, con el tiempo restante. Desaparece sola cuando la sesión termina.',
  },
  features: {
    eyebrow: 'Funciones',
    title: 'Pequeña, y cumple',
    items: {
      lists: {
        title: 'Bloqueados o permitidos',
        body: 'Bloquea unos pocos sitios, o bloquea todo menos las herramientas con las que trabajas.',
      },
      timer: {
        title: 'Sesiones a tu medida',
        body: 'Atajos de 1 minuto a 1 hora, o haz clic en el tiempo y escribe el tuyo.',
      },
      streak: {
        title: 'Una racha que proteger',
        body: 'Cada sesión terminada suma uno. Rendirse requiere dos clics y la deja en cero.',
      },
      alerts: {
        title: 'Sonidos y notificaciones',
        body: 'Una notificación cuando toca descansar, y sonidos opcionales. Todo apagado hasta que lo actives.',
      },
      languages: {
        title: 'En tu idioma',
        body: 'Inglés, portugués y español, según tu navegador o tu elección.',
      },
      private: {
        title: 'Nada sale de tu navegador',
        body: 'Sin cuenta, sin rastreo, sin servidores. Tus listas y tu racha se guardan en tu dispositivo.',
        tags: ['Sin cuenta', 'Sin rastreo', 'Sin servidores'],
      },
    },
  },
  reviews: {
    eyebrow: 'Reseñas',
    title: 'Quienes recuperaron el foco',
    intro: 'Mira lo que dicen quienes usan FocusPocus.',
    rating: '5,0 en la Chrome Web Store',
    stars: (count: number) => `${count} estrellas`,
    all: 'Verlas todas en la Chrome Web Store',
  },
  install: {
    title: '¿Listo para concentrarte?',
    body: 'FocusPocus es gratis en Chrome y Firefox.',
    openSource: 'Código abierto bajo la licencia MIT. ¿Encontraste un error o tienes una idea?',
    contribute: 'Contribuye en GitHub',
  },
  footer: {
    tagline: 'Una extensión de navegador que bloquea distracciones mientras te concentras.',
    get: 'Descárgala',
    project: 'Proyecto',
    languages: 'Idiomas',
    source: 'Código fuente',
    issues: 'Reportar un error',
    support: 'Apoya FocusPocus',
    license: 'Licencia MIT',
    madeBy: 'Hecho por',
    andContributors: 'y colaboradores.',
  },
  notFound: {
    title: 'Esta página no existe.',
    back: 'Volver a FocusPocus',
  },
  mocks: {
    popup: 'El popup de FocusPocus',
    settings: 'La página de configuración de FocusPocus',
    focusScreen: 'Un sitio bloqueado cubierto por la pantalla de concentración',
  },
};
