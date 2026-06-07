/**
 * Renders intro/welcome copy with **bold** spans wrapped in <strong>.
 *
 * The pattern requires the emphasized text to contain no "*", so a single
 * leading "*" used as a section marker (e.g. "*Thời gian:") stays literal.
 * Render inside a whitespace-pre-wrap container to preserve line breaks.
 */
export function renderIntroBody(body: string) {
  return body
    .split(/\*\*([^*]+?)\*\*/g)
    .map((seg, i) => (i % 2 === 1 ? <strong key={i}>{seg}</strong> : seg));
}
