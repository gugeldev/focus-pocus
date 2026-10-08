import { type FormEvent, useState } from 'react';
import type { ListType, SiteListCopy } from '@/components/site-lists';
import { Button } from '@/components/ui/button';
import { IconAdd } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

type Props = {
  type: ListType;
  copy: SiteListCopy;
  disabled: boolean;
  /** Returns false when the entry was refused, so the field keeps the text. */
  onAdd: (url: string) => boolean;
};

/** The field and button that add an entry. The text is saved trimmed, otherwise as typed. */
export function AddSiteForm({ type, copy, disabled, onAdd }: Props) {
  const [draft, setDraft] = useState('');
  const inputId = `${type}-input`;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onAdd(draft.trim())) setDraft('');
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        {copy.inputLabel}
      </label>
      <Input
        id={inputId}
        className="flex-1"
        type="text"
        placeholder={copy.placeholder}
        autoComplete="off"
        value={draft}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button type="submit" variant="secondary" disabled={disabled}>
        <IconAdd size={18} aria-hidden="true" />
        {copy.addLabel}
      </Button>
    </form>
  );
}
