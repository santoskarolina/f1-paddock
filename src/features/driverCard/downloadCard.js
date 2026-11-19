/**
 * Gera um PNG do elemento da carta e dispara o download.
 * A biblioteca html-to-image só é baixada no primeiro clique (import dinâmico),
 * então não pesa no carregamento da página.
 */
export async function downloadCardImage(node, fileName) {
  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(node, { pixelRatio: 3 });

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}
