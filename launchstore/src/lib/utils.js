module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hours = date.getHours()
        const minutes = date.getMinutes()

        return {
            year,
            month,
            day,
            hours,
            minutes,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        return Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)
    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, '')

        if(value.length > 14) value = value.slice(0, -1)

        if(value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1/$2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
        } else {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1-$2')
        }

        return value
    },
    formatCEP(value) {
        value = value.replace(/\D/g, '')

        if(value.length > 8) value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, '$1-$2')

        return value
    }
}