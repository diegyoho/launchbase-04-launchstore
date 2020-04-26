const Mask = {
    apply(input, mask) {
        if( mask === 'apply')
            return new Error('Apply isn\'t a valid mask!')

        setTimeout(function() {
            input.value = Mask[mask](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g, '')

        return Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    }
}