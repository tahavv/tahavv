// Split an element's text into one span per character, words kept whole so lines
// still break between them. Screen readers get the original text through aria-label.
export function splitChars(element: HTMLElement): HTMLElement[] {
    if (element.dataset.split) return [...element.querySelectorAll<HTMLElement>('.char')]
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim()
    element.dataset.split = '1'
    element.setAttribute('aria-label', text)
    const chars: HTMLElement[] = []
    const holder = document.createElement('span')
    holder.setAttribute('aria-hidden', 'true')
    text.split(' ').forEach((word, index) => {
        if (index) holder.append(' ')
        const wordSpan = document.createElement('span')
        wordSpan.className = 'word'
        for (const letter of word) {
            const char = document.createElement('span')
            char.className = 'char'
            char.textContent = letter
            wordSpan.append(char)
            chars.push(char)
        }
        holder.append(wordSpan)
    })
    element.replaceChildren(holder)
    return chars
}
