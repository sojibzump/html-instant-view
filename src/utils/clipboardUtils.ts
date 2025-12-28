export class ClipboardUtils {
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  static async pasteFromClipboard(): Promise<string> {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      throw new Error('Clipboard access denied. Please allow clipboard permissions.');
    }
  }

  static async hasClipboardPermission(): Promise<boolean> {
    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      return permission.state === 'granted' || permission.state === 'prompt';
    } catch (err) {
      // If permissions API not supported, assume we can try
      return true;
    }
  }

  static async copySelection(editor: any): Promise<boolean> {
    if (!editor) return false;
    
    try {
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (selection && model) {
        const selectedText = model.getValueInRange(selection);
        if (selectedText) {
          await this.copyToClipboard(selectedText);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error copying selection:', err);
      return false;
    }
  }

  static async pasteAtCursor(editor: any): Promise<boolean> {
    if (!editor) return false;
    
    try {
      const clipboardText = await this.pasteFromClipboard();
      if (clipboardText) {
        const selection = editor.getSelection();
        editor.executeEdits('paste', [
          {
            range: selection,
            text: clipboardText,
            forceMoveMarkers: true,
          },
        ]);
        editor.focus();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error pasting:', err);
      return false;
    }
  }

  static deleteSelection(editor: any): boolean {
    if (!editor) return false;
    
    try {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        editor.executeEdits('delete', [
          {
            range: selection,
            text: '',
            forceMoveMarkers: true,
          },
        ]);
        editor.focus();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting selection:', err);
      return false;
    }
  }

  static cutSelection(editor: any): Promise<boolean> {
    return (async () => {
      if (!editor) return false;
      
      try {
        const selection = editor.getSelection();
        const model = editor.getModel();
        if (selection && model && !selection.isEmpty()) {
          const selectedText = model.getValueInRange(selection);
          const copied = await this.copyToClipboard(selectedText);
          if (copied) {
            editor.executeEdits('cut', [
              {
                range: selection,
                text: '',
                forceMoveMarkers: true,
              },
            ]);
            editor.focus();
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Error cutting selection:', err);
        return false;
      }
    })();
  }

  static selectAll(editor: any): boolean {
    if (!editor) return false;
    
    try {
      const model = editor.getModel();
      if (model) {
        const fullRange = model.getFullModelRange();
        editor.setSelection(fullRange);
        editor.focus();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error selecting all:', err);
      return false;
    }
  }

  static duplicateLine(editor: any): boolean {
    if (!editor) return false;
    
    try {
      editor.trigger('keyboard', 'editor.action.copyLinesDownAction', null);
      return true;
    } catch (err) {
      console.error('Error duplicating line:', err);
      return false;
    }
  }

  static deleteLine(editor: any): boolean {
    if (!editor) return false;
    
    try {
      editor.trigger('keyboard', 'editor.action.deleteLines', null);
      return true;
    } catch (err) {
      console.error('Error deleting line:', err);
      return false;
    }
  }
}
