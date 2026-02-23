// Utilitário para carregar conteúdo do CMS
export async function loadContent(filePath) {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    return parseFrontmatter(text);
  } catch (error) {
    console.error('Erro ao carregar conteúdo:', error);
    return null;
  }
}

export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  const data = {};
  match[1].split('\n').forEach(line => {
    if (line.includes(': ')) {
      const [key, ...value] = line.split(': ');
      if (key && value.length) {
        // Tenta parsear JSON para listas/objetos
        try {
          data[key.trim()] = JSON.parse(value.join(': ').trim());
        } catch {
          data[key.trim()] = value.join(': ').trim();
        }
      }
    }
  });

  return { data, content: match[2] };
}