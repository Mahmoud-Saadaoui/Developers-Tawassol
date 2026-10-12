import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../context/LocaleContext';
import MarkdownEditor from './MarkdownEditor';

function renderEditor(props: Partial<React.ComponentProps<typeof MarkdownEditor>> = {}) {
  const onChange = vi.fn();
  render(
    <LocaleProvider>
      <MarkdownEditor value="" onChange={onChange} placeholder="Write here" {...props} />
    </LocaleProvider>,
  );
  return { onChange };
}

describe('MarkdownEditor', () => {
  it('calls onChange while typing in write mode', async () => {
    const user = userEvent.setup();
    const { onChange } = renderEditor();

    await user.type(screen.getByPlaceholderText('Write here'), 'Hi');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith('i');
  });

  it('renders the markdown preview when switching to preview mode', async () => {
    const user = userEvent.setup();
    renderEditor({ value: '# Hello world' });

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows an empty hint in preview when there is no content', async () => {
    const user = userEvent.setup();
    renderEditor({ value: '' });

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});
