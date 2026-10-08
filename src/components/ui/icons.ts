/**
 * Every icon in the extension, imported from one place.
 *
 * Deep imports on purpose: `@phosphor-icons/react`'s root re-exports ~1500
 * icons, which a development build bundles whole. Each glyph comes from its own
 * module instead.
 *
 * Domain meanings live here, not in the components: change the icon for
 * "blocklist" once and it changes everywhere.
 */

export type { Icon as IconComponent } from '@phosphor-icons/react';
export { ArrowUpRightIcon as IconExternal } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
export {
  CheckCircleIcon as IconAllowlist,
  CheckCircleIcon as IconSuccess,
} from '@phosphor-icons/react/dist/csr/CheckCircle';
export { CopyIcon as IconCopy } from '@phosphor-icons/react/dist/csr/Copy';
export { FlameIcon as IconStreak } from '@phosphor-icons/react/dist/csr/Flame';
export { GearSixIcon as IconSettings } from '@phosphor-icons/react/dist/csr/GearSix';
export { HeartIcon as IconSupport } from '@phosphor-icons/react/dist/csr/Heart';
export { PlusIcon as IconAdd } from '@phosphor-icons/react/dist/csr/Plus';
export { ProhibitIcon as IconBlocklist } from '@phosphor-icons/react/dist/csr/Prohibit';
export { SlidersHorizontalIcon as IconGeneral } from '@phosphor-icons/react/dist/csr/SlidersHorizontal';
export { WarningCircleIcon as IconError } from '@phosphor-icons/react/dist/csr/WarningCircle';
export { XIcon as IconRemove } from '@phosphor-icons/react/dist/csr/X';
