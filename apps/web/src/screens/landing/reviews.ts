import type { Locale } from '@focus-pocus/locales';

/**
 * Reviews from the Chrome Web Store listing, with the reviewer's name and the
 * date. Written in Portuguese; the English and Spanish are faithful
 * translations, so each page shows them in its own language. Newest first.
 */

/** Every one of them gave five stars (the maintainer's word, from the listing). */
export const reviewStars = 5;

type Review = { name: string; date: string; text: Record<Locale, string> };

export const reviews: Review[] = [
  {
    name: 'André Rigo',
    date: '2025-05-30',
    text: {
      'pt-BR': 'muito bom, simples e funcional, melhorou 10x meu foco, recomendo!',
      en: 'very good, simple and functional, improved my focus 10x, I recommend it!',
      es: 'muy bueno, simple y funcional, mejoró 10 veces mi concentración, ¡lo recomiendo!',
    },
  },
  {
    name: 'luiz henrique marques ferreira',
    date: '2025-01-09',
    text: { 'pt-BR': 'Ótimo', en: 'Great', es: 'Excelente' },
  },
  {
    name: 'Dino Sauro',
    date: '2024-07-28',
    text: {
      'pt-BR': 'Te amo dev que esqueci o nome que vi no twitter.',
      en: 'Love you, dev whose name I forgot, the one I saw on Twitter.',
      es: 'Te amo, dev cuyo nombre olvidé, el que vi en Twitter.',
    },
  },
  {
    name: 'Dione Quevedo',
    date: '2024-06-12',
    text: {
      'pt-BR':
        'Também vi seu post no LinkedIn e resolvi testar, achei a ideia muito boa e já instalei. Desde já parabéns pela iniciativa!',
      en: 'I also saw your post on LinkedIn and decided to try it. I loved the idea and already installed it. Congrats on the initiative!',
      es: 'Yo también vi tu post en LinkedIn y decidí probarla. Me pareció muy buena idea y ya la instalé. ¡Felicitaciones por la iniciativa!',
    },
  },
  {
    name: 'Nathalia Campos',
    date: '2024-06-09',
    text: {
      'pt-BR': 'Vi no Linkedin e achei incrível. Muito útil !',
      en: 'Saw it on LinkedIn and found it amazing. Very useful!',
      es: 'La vi en LinkedIn y me pareció increíble. ¡Muy útil!',
    },
  },
  {
    name: 'Diego Lima',
    date: '2024-06-08',
    text: {
      'pt-BR': 'Vi sobre numa postagem no Linkedin! Já instalei e vou testá-lo!',
      en: "Saw it in a LinkedIn post! Already installed it and I'm going to try it!",
      es: '¡La vi en una publicación de LinkedIn! ¡Ya la instalé y la voy a probar!',
    },
  },
  {
    name: 'Rafael Mainieri',
    date: '2024-05-31',
    text: {
      'pt-BR':
        'Vi essa extensão em um post do LinkedIn e achei sensacional! Já estou usando e está me ajudando de mais!!',
      en: "I saw this extension in a LinkedIn post and found it sensational! I'm already using it and it's helping me so much!!",
      es: '¡Vi esta extensión en un post de LinkedIn y me pareció sensacional! ¡Ya la estoy usando y me está ayudando muchísimo!!',
    },
  },
  {
    name: 'Márcio André Gama',
    date: '2024-05-22',
    text: {
      'pt-BR': 'Extensão Perfeita, já fixei!!',
      en: 'Perfect extension, already pinned it!!',
      es: '¡Extensión perfecta, ya la fijé!!',
    },
  },
  {
    name: 'Matheus Oliveira Guimarães',
    date: '2024-05-21',
    text: {
      'pt-BR': 'Simples e extremamente útil!!',
      en: 'Simple and extremely useful!!',
      es: '¡¡Simple y extremadamente útil!!',
    },
  },
  {
    name: 'Gustavo Zampieri',
    date: '2024-05-20',
    text: {
      'pt-BR': 'Melhor plugin pra foco',
      en: 'Best plugin for focus',
      es: 'El mejor plugin para concentrarse',
    },
  },
  {
    name: 'Manuela Viana',
    date: '2024-05-20',
    text: {
      'pt-BR': 'Adorei a iniciativa, super intuitivo e fácil de usar. Parabéns João Vitor.',
      en: 'Loved the initiative, super intuitive and easy to use. Congrats, João Vitor.',
      es: 'Me encantó la iniciativa, súper intuitiva y fácil de usar. Felicitaciones, João Vitor.',
    },
  },
  {
    name: 'Rodrigo Golfeto',
    date: '2024-05-20',
    text: {
      'pt-BR': 'Extremamente prático, com uma interface intuitiva e atraente. Recomendo!',
      en: 'Extremely practical, with an intuitive and attractive interface. I recommend it!',
      es: 'Extremadamente práctica, con una interfaz intuitiva y atractiva. ¡La recomiendo!',
    },
  },
  {
    name: 'Bianca Leal',
    date: '2024-05-20',
    text: {
      'pt-BR': 'Muito prático e fácil de usar.',
      en: 'Very practical and easy to use.',
      es: 'Muy práctica y fácil de usar.',
    },
  },
  {
    name: 'Davi Santana',
    date: '2024-05-19',
    text: {
      'pt-BR': 'Perfeito, o cara que fez essa extensão é igual meu prefeito, um pai :D',
      en: 'Perfect, the guy who made this extension is like my mayor, a true father figure :D',
      es: 'Perfecta, el que hizo esta extensión es como mi alcalde, un padre :D',
    },
  },
  {
    name: 'João Pedro Dos Santos',
    date: '2024-05-19',
    text: {
      'pt-BR': 'Muito útil!! Parabéns ao desenvolvedor :)',
      en: 'Very useful!! Congrats to the developer :)',
      es: '¡¡Muy útil!! Felicitaciones al desarrollador :)',
    },
  },
  {
    name: 'Maria',
    date: '2024-05-19',
    text: {
      'pt-BR': 'Incrível e me ajudou muito!',
      en: 'Amazing, and it helped me a lot!',
      es: '¡Increíble y me ayudó mucho!',
    },
  },
  {
    name: 'Jeferson Augusto',
    date: '2024-05-10',
    text: {
      'pt-BR': 'Extensão ótima, acompanhei todo o processo',
      en: 'Great extension, I followed the whole process',
      es: 'Excelente extensión, seguí todo el proceso',
    },
  },
  {
    name: 'Guilherme Cabral',
    date: '2024-05-10',
    text: {
      'pt-BR': 'Extensão ótima pra se manter focado nos estudos! Feita por um Brasileiro Incrível!',
      en: 'Great extension for staying focused on your studies! Made by an amazing Brazilian!',
      es: '¡Excelente extensión para mantenerse concentrado en los estudios! ¡Hecha por un brasileño increíble!',
    },
  },
];

export type { Review };
