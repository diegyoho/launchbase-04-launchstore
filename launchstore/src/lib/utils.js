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
    }
}