
export class ClipboardUtils {
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
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
      throw new Error('Clipboard access denied');
    }
  }

  static async hasClipboardPermission(): Promise<boolean> {
    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      return permission.state === 'granted';
    } catch (err) {
      return false;
    }
  }
}
