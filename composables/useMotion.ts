// Shared by the background field and its pause control in the footer.
export function useMotion() {
    const paused = useState('motion-paused', () => false)

    function setPaused(value: boolean) {
        paused.value = value
        try { localStorage.setItem('motion', value ? 'paused' : 'on') } catch {}
    }

    function restore() {
        try { paused.value = localStorage.getItem('motion') === 'paused' } catch {}
    }

    return { paused, setPaused, restore }
}
