const messages = [
  'Keep going!',
  'Never quit!',
  'Stay focused!',
  'You can do it!',
  "Don't give up!",
  'Reach your goals!',
  'Stay motivated!',
  'You got this!',
];

function getDoNotGiveUpMessage() {
  const random = Math.floor(Math.random() * messages.length);
  return messages[random];
}

export { getDoNotGiveUpMessage };
