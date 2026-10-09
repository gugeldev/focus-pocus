// Joins class names, skipping the falsy ones: cx('a', isOn && 'b').
function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export { cx };
