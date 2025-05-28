
export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateXML = (xmlContent: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  try {
    // Check for basic XML structure
    if (!xmlContent.trim()) {
      return {
        isValid: false,
        errors: [{ line: 1, column: 1, message: 'Empty content', type: 'error' }]
      };
    }

    // Check XML declaration
    if (!xmlContent.includes('<?xml')) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Missing XML declaration',
        type: 'warning'
      });
    }

    // Check DOCTYPE
    if (!xmlContent.includes('<!DOCTYPE html>')) {
      errors.push({
        line: 2,
        column: 1,
        message: 'Missing DOCTYPE declaration',
        type: 'warning'
      });
    }

    // Check for required Blogger namespaces
    const requiredNamespaces = [
      'xmlns:b=\'http://www.google.com/2005/gml/b\'',
      'xmlns:data=\'http://www.google.com/2005/gml/data\'',
      'xmlns:expr=\'http://www.google.com/2005/gml/expr\''
    ];

    requiredNamespaces.forEach((namespace, index) => {
      if (!xmlContent.includes(namespace)) {
        errors.push({
          line: 3,
          column: 1,
          message: `Missing required namespace: ${namespace}`,
          type: 'error'
        });
      }
    });

    // Check for basic tag matching (simplified)
    const openTags: string[] = [];
    const tagRegex = /<(\/?)([\w-]+)[^>]*>/g;
    let match;
    let lineNumber = 1;

    while ((match = tagRegex.exec(xmlContent)) !== null) {
      const isClosing = match[1] === '/';
      const tagName = match[2];
      
      // Count line numbers
      const beforeMatch = xmlContent.substring(0, match.index);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

      if (isClosing) {
        const lastOpen = openTags.pop();
        if (lastOpen !== tagName) {
          errors.push({
            line: lineNumber,
            column: match.index - beforeMatch.lastIndexOf('\n'),
            message: `Mismatched closing tag: expected </${lastOpen}> but found </${tagName}>`,
            type: 'error'
          });
        }
      } else if (!match[0].endsWith('/>')) {
        // Self-closing tags don't need to be tracked
        openTags.push(tagName);
      }
    }

    // Check for unclosed tags
    if (openTags.length > 0) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: `Unclosed tags: ${openTags.join(', ')}`,
        type: 'error'
      });
    }

    // Check for common Blogger XML patterns
    if (xmlContent.includes('<data:') && !xmlContent.includes('b:skin')) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Blogger data tags found but missing b:skin section',
        type: 'warning'
      });
    }

    return {
      isValid: errors.filter(e => e.type === 'error').length === 0,
      errors
    };
    
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: `Validation error: ${error}`,
        type: 'error'
      }]
    };
  }
};

export const detectLanguage = (content: string): 'html' | 'xml' => {
  const xmlIndicators = [
    '<?xml',
    'xmlns:b=',
    'xmlns:data=',
    'xmlns:expr=',
    '<data:',
    '<b:',
    'expr:',
    'b:version='
  ];

  const foundIndicators = xmlIndicators.filter(indicator => 
    content.includes(indicator)
  ).length;

  return foundIndicators >= 2 ? 'xml' : 'html';
};
