import type { SiteCopy } from './en';

export const ptBR: SiteCopy = {
  meta: {
    title: 'FocusPocus: bloqueie distrações e mantenha o foco',
    description:
      'Uma extensão gratuita e open source para Chrome e Firefox. Inicie um timer de foco e os sites que roubam sua atenção ficam bloqueados até ele acabar.',
  },
  nav: {
    home: 'FocusPocus, início',
    reviews: 'Avaliações',
    features: 'Recursos',
    github: 'GitHub',
    install: 'Instalar',
  },
  stores: {
    chrome: 'Adicionar ao Chrome',
    firefox: 'Adicionar ao Firefox',
  },
  hero: {
    titleLead: 'Mantenha o foco como se',
    titleAccent: 'estivesse sob um feitiço',
    lead: 'Uma extensão que bloqueia os sites que te distraem enquanto o timer de foco roda.',
  },
  focusScreen: {
    eyebrow: 'Tela de foco',
    title: 'Um site bloqueado espera você terminar',
    intro:
      'Abra um site bloqueado durante uma sessão e ele é coberto pela tela de foco, com o tempo restante. Ela some sozinha quando a sessão acaba.',
  },
  features: {
    eyebrow: 'Recursos',
    title: 'Pequena, e resolve',
    items: {
      lists: {
        title: 'Bloqueados ou permitidos',
        body: 'Bloqueie alguns sites, ou bloqueie tudo menos as ferramentas com que você trabalha.',
      },
      timer: {
        title: 'Sessões do tamanho que quiser',
        body: 'Atalhos de 1 minuto a 1 hora, ou clique no tempo e digite o seu.',
      },
      streak: {
        title: 'Uma sequência a proteger',
        body: 'Cada sessão concluída soma um. Desistir exige dois cliques e zera a sequência.',
      },
      alerts: {
        title: 'Sons e notificações',
        body: 'Uma notificação na hora da pausa, e sons opcionais. Tudo desligado até você ligar.',
      },
      languages: {
        title: 'No seu idioma',
        body: 'Inglês, português e espanhol, seguindo o navegador ou a sua escolha.',
      },
      private: {
        title: 'Nada sai do seu navegador',
        body: 'Sem conta, sem rastreamento, sem servidores. Suas listas e sua sequência ficam no seu dispositivo.',
        tags: ['Sem conta', 'Sem rastreamento', 'Sem servidores'],
      },
    },
  },
  reviews: {
    eyebrow: 'Avaliações',
    title: 'Quem recuperou o foco',
    intro: 'Veja o que quem usa o FocusPocus está achando.',
    rating: '5,0 na Chrome Web Store',
    stars: (count: number) => `${count} estrelas`,
    all: 'Ver todas na Chrome Web Store',
  },
  install: {
    title: 'Pronto para focar?',
    body: 'FocusPocus é gratuita no Chrome e no Firefox.',
    openSource: 'Open source sob a licença MIT. Achou um bug ou tem uma ideia?',
    contribute: 'Contribua no GitHub',
  },
  footer: {
    tagline: 'Uma extensão de navegador que bloqueia distrações enquanto você foca.',
    get: 'Baixe',
    project: 'Projeto',
    languages: 'Idiomas',
    source: 'Código-fonte',
    issues: 'Reportar um bug',
    support: 'Apoie o FocusPocus',
    license: 'Licença MIT',
    madeBy: 'Feito por',
    andContributors: 'e contribuidores.',
  },
  notFound: {
    title: 'Esta página não existe.',
    back: 'Voltar ao FocusPocus',
  },
  store: {
    title: 'Imagens da loja',
    tiles: {
      small: 'Mosaico pequeno (440x280)',
      marquee: 'Mosaico promocional (1400x560)',
    },
    tagline: 'Bloqueie distrações. Mantenha o foco.',
    slides: {
      timer: {
        eyebrow: 'Timer de foco',
        // The landing page's headline, word for word: the store and the site open with the same claim.
        title: 'Transforme sua produtividade como um passe de mágica.',
        lead: 'Inicie um timer e os sites que roubam sua atenção ficam bloqueados até ele acabar.',
      },
      focusScreen: {
        eyebrow: 'Tela de foco',
        title: 'Sites que distraem, bloqueados',
        lead: 'Abra um durante uma sessão e a tela de foco cobre ele, com o tempo restante.',
      },
      lists: {
        eyebrow: 'Suas regras',
        title: 'Bloqueados ou permitidos',
        lead: 'Bloqueie alguns sites, ou tudo menos as ferramentas com que você trabalha.',
      },
      streak: {
        eyebrow: 'Sequência',
        title: 'Qualquer duração. Uma sequência pra proteger.',
        lead: 'De 1 minuto a 1 hora, ou digite o seu. Cada sessão concluída soma um.',
      },
      yours: {
        eyebrow: 'Privada por padrão',
        title: 'Fala a sua língua',
        lead: 'Português, inglês e espanhol. Sem conta, sem rastreamento: tudo fica no seu navegador.',
      },
    },
  },
  mocks: {
    popup: 'O popup do FocusPocus',
    settings: 'A página de configurações do FocusPocus',
    focusScreen: 'Um site bloqueado coberto pela tela de foco',
  },
};
