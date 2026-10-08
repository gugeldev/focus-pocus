import { IconError, IconSuccess } from '@/components/ui/icons';
import { cx } from '@/lib/cx';
import { removeToast, type Toast, useToasts } from '@/lib/toast';

/** One toast: green check for a confirmation, red for an error. */
function ToastCard({ id, message, error, leaving }: Toast) {
  const Icon = error ? IconError : IconSuccess;

  return (
    <div
      role={error ? 'alert' : 'status'}
      onAnimationEnd={() => leaving && removeToast(id)}
      className={cx(
        'flex max-w-[min(360px,calc(100vw-32px))] items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium shadow-popover',
        error
          ? 'border-danger-line bg-danger-wash text-danger-soft'
          : 'border-border-strong bg-raised text-text',
        leaving ? 'animate-toast-out' : 'animate-toast-in',
      )}
    >
      <Icon
        weight="fill"
        size={16}
        aria-hidden="true"
        className={cx('shrink-0', error ? 'text-danger' : 'text-success')}
      />
      <span>{message}</span>
    </div>
  );
}

/** The toasts raised by toast() (src/lib/toast.ts), bottom center. Mounted once per page by mount(). */
export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-100 flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 flex-col items-center gap-2"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} {...item} />
      ))}
    </div>
  );
}
