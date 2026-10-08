/**
 * Reviews from the Chrome Web Store listing, copied as written (in Portuguese)
 * with the reviewer's name and the date; never edited or translated. Newest first.
 */

/** Every one of them gave five stars (the maintainer's word, from the listing). */
export const reviewStars = 5;

export const reviews = [
  {
    name: 'André Rigo',
    date: '2025-05-30',
    text: 'muito bom, simples e funcional, melhorou 10x meu foco, recomendo!',
  },
  { name: 'luiz henrique marques ferreira', date: '2025-01-09', text: 'Ótimo' },
  {
    name: 'Dino Sauro',
    date: '2024-07-28',
    text: 'Te amo dev que esqueci o nome que vi no twitter.',
  },
  {
    name: 'Dione Quevedo',
    date: '2024-06-12',
    text: 'Também vi seu post no LinkedIn e resolvi testar, achei a ideia muito boa e já instalei. Desde já parabéns pela iniciativa!',
  },
  {
    name: 'Nathalia Campos',
    date: '2024-06-09',
    text: 'Vi no Linkedin e achei incrível. Muito útil !',
  },
  {
    name: 'Diego Lima',
    date: '2024-06-08',
    text: 'Vi sobre numa postagem no Linkedin! Já instalei e vou testá-lo!',
  },
  {
    name: 'Rafael Mainieri',
    date: '2024-05-31',
    text: 'Vi essa extensão em um post do LinkedIn e achei sensacional! Já estou usando e está me ajudando de mais!!',
  },
  { name: 'Márcio André Gama', date: '2024-05-22', text: 'Extensão Perfeita, já fixei!!' },
  {
    name: 'Matheus Oliveira Guimarães',
    date: '2024-05-21',
    text: 'Simples e extremamente útil!!',
  },
  { name: 'Gustavo Zampieri', date: '2024-05-20', text: 'Melhor plugin pra foco' },
  {
    name: 'Manuela Viana',
    date: '2024-05-20',
    text: 'Adorei a iniciativa, super intuitivo e fácil de usar. Parabéns João Vitor.',
  },
  {
    name: 'Rodrigo Golfeto',
    date: '2024-05-20',
    text: 'Extremamente prático, com uma interface intuitiva e atraente. Recomendo!',
  },
  { name: 'Bianca Leal', date: '2024-05-20', text: 'Muito prático e fácil de usar.' },
  {
    name: 'Davi Santana',
    date: '2024-05-19',
    text: 'Perfeito, o cara que fez essa extensão é igual meu prefeito, um pai :D',
  },
  {
    name: 'João Pedro Dos Santos',
    date: '2024-05-19',
    text: 'Muito útil!! Parabéns ao desenvolvedor :)',
  },
  { name: 'Maria', date: '2024-05-19', text: 'Incrível e me ajudou muito!' },
  {
    name: 'Jeferson Augusto',
    date: '2024-05-10',
    text: 'Extensão ótima, acompanhei todo o processo',
  },
  {
    name: 'Guilherme Cabral',
    date: '2024-05-10',
    text: 'Extensão ótima pra se manter focado nos estudos! Feita por um Brasileiro Incrível!',
  },
];

export type Review = (typeof reviews)[number];
